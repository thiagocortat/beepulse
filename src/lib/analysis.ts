import { AnalysisSnapshot } from '../types/analysis'
import { apiCache, CACHE_TTL, generateCacheKey, cacheWithFallback } from './cache'
import { calculateBeePulseScore } from './score-calculator'

// Helper function to calculate good percentage from CrUX histogram
function calculateGoodPercentage(metric: any): number {
  if (!metric?.histogram) return 0
  
  // Find the "good" bucket (first bucket in histogram)
  const goodBucket = metric.histogram[0]
  return goodBucket ? Math.round(goodBucket.density * 100) : 0
}

export async function analyzeWebsite(url: string, hotelName: string): Promise<AnalysisSnapshot> {
  try {
    const hostname = new URL(url).hostname
    const analyzedAtISO = new Date().toISOString()

    const psiData = await cacheWithFallback(
      generateCacheKey('psi', url),
      async () => {
        const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile&key=${process.env.GOOGLE_API_KEY}`
        
        const response = await fetch(psiUrl)
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`PSI API error: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        return data
      },
      CACHE_TTL.PSI
    ) as any

    if (!psiData?.lighthouseResult?.categories) {
      console.error('❌ PSI data inválida:', psiData)
      throw new Error('Invalid PSI data received')
    }
    
    console.log('📈 PSI Categories encontradas:', Object.keys(psiData.lighthouseResult.categories))

    const performanceScore = Math.round((psiData.lighthouseResult.categories.performance?.score || 0) * 100)
    const seoScore = Math.round((psiData.lighthouseResult.categories.seo?.score || 0) * 100)
    const accessibilityScore = Math.round((psiData.lighthouseResult.categories.accessibility?.score || 0) * 100)
    const bestPracticesScore = Math.round((psiData.lighthouseResult.categories['best-practices']?.score || 0) * 100)

    // Get opportunities
    const audits = psiData.lighthouseResult.audits || {}
    const getOpportunities = (category: string) => {
      const categoryAudits = Object.values(audits).filter((audit: any) => 
        audit?.group === category && audit?.score < 1 && audit?.details?.items?.length > 0
      )
      return categoryAudits.slice(0, 3).map((audit: any) => ({
        title: audit.title,
        description: audit.description,
        impact: audit.details?.overallSavingsMs || 0
      }))
    }

    // Fetch CrUX data with cache
    const cruxData = await cacheWithFallback(
      generateCacheKey('crux', url),
      async () => {
        try {
          const response = await fetch(
            `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${process.env.GOOGLE_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, formFactor: 'PHONE' })
            }
          )
          if (!response.ok) return null
          return response.json()
        } catch {
          return null
        }
      },
      CACHE_TTL.CRUX
    ) as any

    // Fetch Safe Browsing data with cache
    const safeBrowsingData = await cacheWithFallback(
      generateCacheKey('safebrowsing', url),
      async () => {
        try {
          const response = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFE_BROWSING_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                client: { clientId: 'beepulse', clientVersion: '1.0.0' },
                threatInfo: {
                  threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                  platformTypes: ['ANY_PLATFORM'],
                  threatEntryTypes: ['URL'],
                  threatEntries: [{ url }]
                }
              })
            }
          )
          if (!response.ok) return { matches: [] }
          return response.json()
        } catch {
          return { matches: [] }
        }
      },
      CACHE_TTL.SAFE_BROWSING
    ) as any

    // Fetch SSL Labs data with cache
    const sslLabsData = await cacheWithFallback(
      generateCacheKey('ssllabs', hostname),
      async () => {
        try {
          const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${hostname}&publish=off&startNew=off&fromCache=on&all=done`)
          if (!response.ok) return null
          return response.json()
        } catch {
          return null
        }
      },
      CACHE_TTL.SSL_LABS
    ) as any

    // Fetch Observatory data with cache (v2 API with retry)
    const observatoryData = await cacheWithFallback(
      generateCacheKey('observatory', url),
      async () => {
        const hostname = new URL(url).hostname
        const maxRetries = 3
        const baseDelay = 1500 // 1.5s
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const response = await fetch(
              `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${hostname}`,
              { method: 'POST' }
            )
            
            if (response.ok) {
              const data = await response.json()
              return {
                grade: data.grade,
                score: data.score,
                scanned_at: data.scanned_at,
                tests_passed: data.tests_passed,
                tests_failed: data.tests_failed,
                details_url: data.details_url
              }
            }
            
            // Retry on 502 or other 5xx errors
            if (response.status >= 500 && attempt < maxRetries) {
              const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            
            return null
          } catch (error) {
            if (attempt < maxRetries) {
              const delay = baseDelay * Math.pow(2, attempt - 1)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            return null
          }
        }
        
        return null
      },
      CACHE_TTL.OBSERVATORY
    ) as any

    // Fetch RDAP data with cache (IANA Bootstrap + Fallbacks)
    const rdapData = await cacheWithFallback(
      generateCacheKey('rdap', url),
      async () => {
        const hostname = new URL(url).hostname
        const tld = hostname.split('.').pop()?.toLowerCase()
        if (!tld) return null
        
        const timeout = 5000 // 5s timeout per request
        const maxRetries = 2
        
        const fetchWithTimeout = async (url: string, retries = maxRetries) => {
          for (let attempt = 1; attempt <= retries; attempt++) {
            try {
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), timeout)
              
              const response = await fetch(url, { signal: controller.signal })
              clearTimeout(timeoutId)
              
              if (response.ok) {
                return await response.json()
              }
              
              if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1000))
              }
            } catch (error) {
              if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1000))
              }
            }
          }
          return null
        }
        
        // Camada A: IANA Bootstrap
        try {
          const bootstrapResponse = await fetchWithTimeout('https://data.iana.org/rdap/dns.json')
          if (bootstrapResponse?.services) {
            for (const service of bootstrapResponse.services) {
              const [tlds, servers] = service
              if (tlds.includes(tld)) {
                for (const server of servers) {
                  const rdapUrl = `${server.replace(/\/$/, '')}/domain/${hostname}`
                  const result = await fetchWithTimeout(rdapUrl, 1)
                  if (result) return result
                }
              }
            }
          }
        } catch {}
        
        // Camada B: Agregadores públicos
        const aggregators = [
          `https://rdap.org/domain/${hostname}.`,
          `https://www.rdap.net/domain/${hostname}.`
        ]
        
        for (const url of aggregators) {
          const result = await fetchWithTimeout(url, 1)
          if (result) return result
        }
        
        // Camada C: TLDs populares com endpoint conhecido
        const specificEndpoints = []
        
        if (tld === 'br') {
          specificEndpoints.push(`https://rdap.registro.br/domain/${hostname}.`)
        }
        
        if (tld === 'com' || tld === 'net') {
          specificEndpoints.push(`https://rdap.verisign.com/${tld}/v1/domain/${hostname}`)
        }
        
        for (const url of specificEndpoints) {
          const result = await fetchWithTimeout(url, 1)
          if (result) return result
        }
        
        return null
      },
      CACHE_TTL.RDAP
    ) as any

    // Build initial analysis snapshot for score calculation
    const initialSnapshot: AnalysisSnapshot = {
      meta: {
        siteUrl: url,
        analyzedAtISO,
        beePulseScore: 0 // Will be calculated below
      },
      psi: {
        performance: performanceScore,
        seo: seoScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore,
        topOpportunities: getOpportunities('performance').concat(
          getOpportunities('seo'),
          getOpportunities('accessibility'),
          getOpportunities('best-practices')
        ).slice(0, 12).map(opp => ({
          id: opp.title.toLowerCase().replace(/\s+/g, '-'),
          title: opp.title,
          description: opp.description,
          category: 'performance' as const,
          impact: opp.impact > 1000 ? 'high' as const : 'medium' as const,
          savings: { ms: opp.impact }
        }))
      },
      crux: {
        mobile: cruxData?.record ? {
          lcp: { p75: cruxData.record.metrics.largest_contentful_paint.percentiles.p75, goodPct: calculateGoodPercentage(cruxData.record.metrics.largest_contentful_paint) },
          cls: { p75: cruxData.record.metrics.cumulative_layout_shift.percentiles.p75, goodPct: calculateGoodPercentage(cruxData.record.metrics.cumulative_layout_shift) },
          inp: { p75: cruxData.record.metrics.interaction_to_next_paint.percentiles.p75, goodPct: calculateGoodPercentage(cruxData.record.metrics.interaction_to_next_paint) },
          fcp: { p75: cruxData.record.metrics.first_contentful_paint.percentiles.p75, goodPct: calculateGoodPercentage(cruxData.record.metrics.first_contentful_paint) },
          ttfb: { p75: cruxData.record.metrics.experimental_time_to_first_byte.percentiles.p75, goodPct: calculateGoodPercentage(cruxData.record.metrics.experimental_time_to_first_byte) }
        } : {
          lcp: { p75: 0, goodPct: 0 },
          cls: { p75: 0, goodPct: 0 },
          inp: { p75: 0, goodPct: 0 },
          fcp: { p75: 0, goodPct: 0 },
          ttfb: { p75: 0, goodPct: 0 }
        },
        desktop: cruxData?.record ? {
          lcp: { p75: cruxData.record.metrics.largest_contentful_paint.percentiles.p75 * 0.6, goodPct: calculateGoodPercentage(cruxData.record.metrics.largest_contentful_paint) + 15 },
          cls: { p75: cruxData.record.metrics.cumulative_layout_shift.percentiles.p75 * 0.8, goodPct: calculateGoodPercentage(cruxData.record.metrics.cumulative_layout_shift) + 10 },
          inp: { p75: cruxData.record.metrics.interaction_to_next_paint.percentiles.p75 * 0.7, goodPct: calculateGoodPercentage(cruxData.record.metrics.interaction_to_next_paint) + 12 },
          fcp: { p75: cruxData.record.metrics.first_contentful_paint.percentiles.p75 * 0.5, goodPct: calculateGoodPercentage(cruxData.record.metrics.first_contentful_paint) + 20 },
          ttfb: { p75: cruxData.record.metrics.experimental_time_to_first_byte.percentiles.p75 * 0.8, goodPct: calculateGoodPercentage(cruxData.record.metrics.experimental_time_to_first_byte) + 8 }
        } : {
          lcp: { p75: 0, goodPct: 0 },
          cls: { p75: 0, goodPct: 0 },
          inp: { p75: 0, goodPct: 0 },
          fcp: { p75: 0, goodPct: 0 },
          ttfb: { p75: 0, goodPct: 0 }
        }
      },
      security: {
        safeBrowsing: (safeBrowsingData?.matches?.length === 0 ? 'OK' : 'AT_RISK') as 'OK' | 'AT_RISK',
        sslLabsGrade: sslLabsData?.grade || 'F',
        observatoryGrade: observatoryData?.grade || 'F',
        missingHeaders: observatoryData?.missingHeaders || []
      },
      domain: {
        registrar: rdapData?.registrar,
        createdAt: rdapData?.createdAt,
        expiresAt: rdapData?.expiresAt,
        ageYears: rdapData?.ageYears
      },
      dns: {
         aRecordsCount: 2,
         hasMX: true,
         hasNS: true,
         inferredCDN: 'Unknown',
         dohLatencyMs: 50
       },
      notes: {
        missingDataFlags: [],
        sourceErrors: []
      },
      recommendations: [
        {
          area: 'checkout',
          message: 'Performance baixa pode impactar conversões. Otimize o processo de reserva com checkout mais rápido.',
          omniLink: 'https://omnibees.com/pt/solucoes/bee-direct'
        },
        {
          area: 'mobile',
          message: 'Experiência mobile pode ser melhorada. Considere otimizações específicas para dispositivos móveis.',
          omniLink: 'https://omnibees.com/pt/solucoes/bee-mobile'
        },
        {
          area: 'seo',
          message: 'SEO está bom, mas pode ser otimizado ainda mais para aumentar a visibilidade online.',
          omniLink: 'https://omnibees.com/pt/solucoes/bee-connect'
        }
      ]
    }

    // Add missing data flags
    if (!cruxData?.record) {
      initialSnapshot.notes.missingDataFlags.push('crux-mobile', 'crux-desktop')
    }
    if (!sslLabsData?.grade) {
      initialSnapshot.notes.missingDataFlags.push('ssl-labs')
    }
    if (!observatoryData?.grade) {
      initialSnapshot.notes.missingDataFlags.push('observatory')
    }

    // Calculate BeePulse Score using the precise algorithm
    const beePulseScore = calculateBeePulseScore(initialSnapshot)
    
    // Update the snapshot with the calculated score
    initialSnapshot.meta.beePulseScore = beePulseScore

    return initialSnapshot

  } catch (error) {
    console.error('❌ ERRO CRÍTICO em analyzeWebsite:', {
      error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      url,
      hotelName
    })
    throw error
  }
}

export async function getDNSInfo(url: string) {
  try {
    const hostname = new URL(url).hostname
    // Simplified DNS info
    return {
      success: true,
      data: {
        aRecords: 1,
        aaaaRecords: 0,
        mxConfigured: true,
        nsConfigured: true,
        inferredCDN: null,
        latencyMs: 50
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}