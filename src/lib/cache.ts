interface CacheEntry<T> {
  data: T
  expiresAt: number
  createdAt: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 1000 // Máximo de entradas no cache

  set<T>(key: string, data: T, ttlMs: number): void {
    // Remove entradas antigas se o cache estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    const now = Date.now()
    this.cache.set(key, {
      data,
      expiresAt: now + ttlMs,
      createdAt: now
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    
    // Remove entradas expiradas
    entries.forEach(([key, entry]) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    })

    // Se ainda estiver cheio, remove as mais antigas
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries
        .filter(([key]) => this.cache.has(key))
        .sort(([, a], [, b]) => a.createdAt - b.createdAt)
      
      const toRemove = sortedEntries.slice(0, Math.floor(this.maxSize * 0.2))
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }

  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    this.cache.forEach(entry => {
      if (now > entry.expiresAt) {
        expired++
      } else {
        valid++
      }
    })

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize
    }
  }
}

// Instância global do cache
export const apiCache = new MemoryCache()

// TTLs para diferentes tipos de dados (em milissegundos)
export const CACHE_TTL = {
  PSI: 12 * 60 * 60 * 1000,        // 12 horas
  CRUX: 12 * 60 * 60 * 1000,       // 12 horas
  SAFE_BROWSING: 24 * 60 * 60 * 1000, // 24 horas
  SSL_LABS: 24 * 60 * 60 * 1000,   // 24 horas
  OBSERVATORY: 24 * 60 * 60 * 1000, // 24 horas
  RDAP: 24 * 60 * 60 * 1000,       // 24 horas
  DNS: 24 * 60 * 60 * 1000,        // 24 horas
} as const

// Função helper para gerar chaves de cache consistentes
export function generateCacheKey(prefix: string, url: string, params?: Record<string, any>): string {
  const baseKey = `${prefix}:${url.toLowerCase()}`
  if (!params) return baseKey
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return `${baseKey}:${sortedParams}`
}

// Função helper para cache com fallback
export async function cacheWithFallback<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number,
  fallbackValue?: T
): Promise<T> {
  try {
    // Tenta buscar do cache primeiro
    const cached = apiCache.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Se não estiver no cache, busca da API
    const result = await fetchFn()
    apiCache.set(key, result, ttl)
    return result
  } catch (error) {
    console.error(`Cache fallback for key ${key}:`, error)
    
    // Tenta buscar uma versão expirada do cache como fallback
    const expiredEntry = apiCache.get<T>(key)
    if (expiredEntry !== null) {
      console.warn(`Using expired cache for key ${key}`)
      return expiredEntry
    }

    // Se tiver um valor de fallback, usa ele
    if (fallbackValue !== undefined) {
      return fallbackValue
    }

    // Se não tiver fallback, relança o erro
    throw error
  }
}