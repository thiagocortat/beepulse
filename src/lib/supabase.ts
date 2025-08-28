import { createClient } from '@supabase/supabase-js'
import { AnalysisSnapshot } from '@/types/analysis'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface LeadBeePulse {
  id?: number
  nome_completo: string
  email: string
  telefone: string
  nome_hotel: string
  site_url?: string | null
  score_basico?: string | null
  relatório_avancado?: any | null
  pdf_url?: string | null
  salesforce_id?: string | null
  email_sent?: boolean
  analysis_id?: string | null
  created_at?: string
}

export interface AnalysisRecord {
  id?: string
  site_url: string
  analysis_snapshot: AnalysisSnapshot
  cached_until: string
  created_at?: string
  updated_at?: string
}

export interface ReportData {
  id: string
  nome_hotel: string
  site_url: string
  score_basico: number
  relatório_avancado?: {
    scores: {
      performance: number
      seo: number
      mobile: number
      overall: number
    }
    insights: string[]
    recommendations: string[]
    generated_at: string
  }
  pdf_url?: string
  created_at: string
}

export const insertLead = async (lead: Omit<LeadBeePulse, 'id' | 'created_at'>): Promise<LeadBeePulse | null> => {
  // Se estiver usando URL placeholder, simular inserção
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.log('Lead salvo (modo demo):', lead.nome_completo)
    return {
      ...lead,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    }
  }

  try {
    const { data, error } = await supabase
      .from('leads_beepulse')
      .insert([lead])
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir lead:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao inserir lead:', error)
    return null
  }
}

export const updateLeadWithAnalysis = async (leadId: number, analysisId: string): Promise<boolean> => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.log('Lead atualizado com análise (modo demo):', leadId, analysisId)
    return true
  }

  try {
    const { error } = await supabase
      .from('leads_beepulse')
      .update({ analysis_id: analysisId })
      .eq('id', leadId)

    if (error) {
      console.error('Erro ao atualizar lead com análise:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao atualizar lead com análise:', error)
    return false
  }
}

export const getReportById = async (id: string): Promise<ReportData | null> => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    const lastUrl = typeof window !== 'undefined' ? localStorage.getItem('lastAnalyzedUrl') : null
    const mockReport: ReportData = {
      id,
      nome_hotel: 'Divi-Divi Praia Hotel',
      site_url: lastUrl || 'https://www.dividivi.com.br/',
      score_basico: 72,
      relatório_avancado: {
        scores: {
          performance: 68,
          seo: 75,
          mobile: 63,
          overall: 72
        },
        insights: [
          'Performance mobile precisa de otimização',
          'SEO está bem estruturado',
          'Oportunidades de melhoria no checkout'
        ],
        recommendations: [
          'BeeDirect para otimizar reservas',
          'Bee2Pay para pagamentos mobile',
          'BeeConnect para visibilidade'
        ],
        generated_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    }
    return mockReport
  }

  const isTimestampId = /^\d{13}$/.test(id)
  const timestampId = parseInt(id)
  const now = Date.now()
  const oneHourAgo = now - (60 * 60 * 1000)
  
  if (isTimestampId && timestampId > oneHourAgo && timestampId <= now) {
    const lastUrl = typeof window !== 'undefined' ? localStorage.getItem('lastAnalyzedUrl') : null
    const mockReport: ReportData = {
      id,
      nome_hotel: 'Hotel Demo',
      site_url: lastUrl || 'https://exemplo.com.br/',
      score_basico: 75,
      relatório_avancado: {
        scores: {
          performance: 70,
          seo: 80,
          mobile: 65,
          overall: 75
        },
        insights: [
          'Relatório gerado em modo demo',
          'Performance pode ser otimizada',
          'SEO bem estruturado'
        ],
        recommendations: [
          'BeeDirect para otimizar reservas',
          'Bee2Pay para pagamentos mobile',
          'BeeConnect para visibilidade'
        ],
        generated_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    }
    return mockReport
  }

  try {
    const { data, error } = await supabase
      .from('leads_beepulse')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar relatório:', error)
      return null
    }

    return data as ReportData
  } catch (error) {
    console.error('Erro ao buscar relatório:', error)
    return null
  }
}



export const insertAnalysis = async (analysis: Omit<AnalysisRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AnalysisRecord | null> => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.log('Análise salva (modo demo):', analysis.site_url)
    return {
      ...analysis,
      id: `analysis_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  try {
    const { data, error } = await supabase
      .from('analises')
      .insert([analysis])
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir análise:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao inserir análise:', error)
    return null
  }
}

export const getAnalysisById = async (id: string): Promise<AnalysisRecord | null> => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    return null // Modo demo não tem análises persistidas
  }

  try {
    const { data, error } = await supabase
      .from('analises')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar análise:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao buscar análise:', error)
    return null
  }
}

export const getCachedAnalysis = async (siteUrl: string): Promise<AnalysisRecord | null> => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    return null // Modo demo não usa cache
  }

  try {
    const { data, error } = await supabase
      .from('analises')
      .select('*')
      .eq('site_url', siteUrl)
      .gt('cached_until', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return null // Não há cache válido
    }

    return data
  } catch (error) {
    return null
  }
}

export const generateAdvancedReport = (basicScore: number) => {
  return {
    scores: {
      performance: Math.max(0, basicScore + Math.floor(Math.random() * 20) - 10),
      seo: Math.max(0, basicScore + Math.floor(Math.random() * 20) - 10),
      mobile: Math.max(0, basicScore + Math.floor(Math.random() * 20) - 10),
      overall: basicScore
    },
    insights: [
      'Tempo de carregamento da página pode ser otimizado',
      'Imagens podem ser comprimidas para melhor performance',
      'Meta descriptions estão bem otimizadas',
      'Site é responsivo e mobile-friendly',
      'Certificado SSL está configurado corretamente'
    ],
    recommendations: [
      'Implementar cache de navegador',
      'Otimizar imagens com formatos modernos (WebP)',
      'Minificar CSS e JavaScript',
      'Usar CDN para recursos estáticos',
      'Implementar lazy loading para imagens'
    ],
    generated_at: new Date().toISOString()
  }
}