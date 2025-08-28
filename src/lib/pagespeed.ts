interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number }
      seo: { score: number }
      'best-practices': { score: number }
    }
  }
}

interface ScoreData {
  performance: number
  seo: number
  mobile: number
  overall: number
  url: string
}

export async function analyzeWebsite(url: string): Promise<ScoreData> {
  const apiKey = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || 'demo-key'
  
  // Se não tiver API key configurada ou for a key de demo, retorna dados simulados
  if (apiKey === 'demo-key' || apiKey === 'AIzaSyDYCZQKmVqtNRLcNDfHDJlTgwjUcVMc9sg') {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Gera scores aleatórios para demonstração
    const performance = Math.floor(Math.random() * 40) + 60 // 60-100
    const seo = Math.floor(Math.random() * 30) + 70 // 70-100
    const mobile = Math.floor(Math.random() * 50) + 50 // 50-100
    const overall = Math.round((performance + seo + mobile) / 3)
    
    return {
      performance,
      seo,
      mobile,
      overall,
      url
    }
  }

  try {
    // Análise para desktop
    const desktopResponse = await fetch(
      `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance&category=seo&category=best-practices&strategy=desktop`
    )
    
    if (!desktopResponse.ok) {
      throw new Error('Erro ao analisar o site')
    }
    
    const desktopData: PageSpeedResponse = await desktopResponse.json()
    
    // Análise para mobile
    const mobileResponse = await fetch(
      `https://www.googleapis.com/pagespeed/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance&strategy=mobile`
    )
    
    const mobileData: PageSpeedResponse = await mobileResponse.json()
    
    // Extrai os scores
    const performance = Math.round((desktopData.lighthouseResult.categories.performance?.score || 0) * 100)
    const seo = Math.round((desktopData.lighthouseResult.categories.seo?.score || 0) * 100)
    const mobile = Math.round((mobileData.lighthouseResult.categories.performance?.score || 0) * 100)
    const overall = Math.round((performance + seo + mobile) / 3)
    
    return {
      performance,
      seo,
      mobile,
      overall,
      url
    }
  } catch (error) {
    console.error('Erro na análise PageSpeed:', error)
    throw new Error('Não foi possível analisar o site. Tente novamente.')
  }
}

export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}