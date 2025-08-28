import { AnalysisSnapshot } from '@/types/analysis'

export const mockAnalysisSnapshot: AnalysisSnapshot = {
  meta: {
    siteUrl: 'https://exemplo-hotel.com',
    analyzedAtISO: new Date().toISOString(),
    beePulseScore: 75
  },
  psi: {
    performance: 0.68,
    seo: 0.92,
    accessibility: 0.85,
    bestPractices: 0.78,
    topOpportunities: [
      {
        id: 'largest-contentful-paint',
        title: 'Largest Contentful Paint',
        description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.',
        category: 'performance',
        impact: 'high',
        savings: { ms: 2400 }
      },
      {
        id: 'cumulative-layout-shift',
        title: 'Cumulative Layout Shift',
        description: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.',
        category: 'performance',
        impact: 'medium',
        savings: { ms: 0 }
      },
      {
        id: 'unused-css-rules',
        title: 'Remove unused CSS',
        description: 'Remove dead rules from stylesheets and defer the loading of CSS not used for above-the-fold content.',
        category: 'performance',
        impact: 'medium',
        savings: { bytes: 45600 }
      }
    ]
  },
  crux: {
    mobile: {
      lcp: { p75: 2800, goodPct: 65 },
      cls: { p75: 0.15, goodPct: 72 },
      inp: { p75: 180, goodPct: 68 },
      fcp: { p75: 1800, goodPct: 78 },
      ttfb: { p75: 600, goodPct: 85 }
    },
    desktop: {
      lcp: { p75: 1200, goodPct: 88 },
      cls: { p75: 0.08, goodPct: 92 },
      inp: { p75: 120, goodPct: 85 },
      fcp: { p75: 900, goodPct: 95 },
      ttfb: { p75: 400, goodPct: 92 }
    }
  },
  security: {
    safeBrowsing: 'OK',
    sslLabsGrade: 'A',
    observatoryGrade: 'B+',
    missingHeaders: ['Content-Security-Policy', 'X-Frame-Options']
  },
  domain: {
    registrar: 'GoDaddy',
    createdAt: '2018-03-15T00:00:00Z',
    expiresAt: '2025-03-15T00:00:00Z',
    ageYears: 6
  },
  dns: {
    aRecordsCount: 2,
    hasMX: true,
    hasNS: true,
    inferredCDN: 'Cloudflare',
    dohLatencyMs: 45
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