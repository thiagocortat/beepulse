import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, LeadBeePulse } from '@/lib/supabase'
import Logger from '@/lib/logger'

interface SalesforceWebhookResponse {
  success: boolean
  id?: string
  message?: string
  errors?: unknown[]
}

class SalesforceService {
  static async createLead(leadData: LeadBeePulse, leadSource?: string): Promise<string> {
    const webhookUrl = process.env.SALESFORCE_WEBHOOK_URL
    
    if (!webhookUrl) {
      Logger.error('salesforce', 'SALESFORCE_WEBHOOK_URL não configurada', { email: leadData.email })
      throw new Error('SALESFORCE_WEBHOOK_URL não configurada')
    }
    
    const nameParts = leadData.nome_completo.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'N/A'
    
    const webhookData: Record<string, any> = {
      FirstName: firstName,
      LastName: lastName,
      Email: leadData.email,
      Phone: leadData.telefone,
      Company: `Hotel ${leadData.nome_hotel}`,
      Website: leadData.site_url,
      Status: 'Novo Lead – BeePulse',
      Score_BeePulse__c: leadData.score_basico ? parseFloat(leadData.score_basico) : null,
      Source: 'BeePulse',
      CreatedAt: new Date().toISOString()
    }

    if (leadSource) webhookData.lead_source = leadSource

    Logger.info('salesforce', 'Enviando lead para webhook', {
      webhookUrl: webhookUrl.replace(/\/[^/]+$/, '/***'),
      email: leadData.email,
      payload: {
        ...webhookData,
        Email: leadData.email.replace(/(.{2}).*(@.*)/, '$1***$2')
      }
    })

    const startTime = Date.now()
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BeePulse/1.0'
        },
        body: JSON.stringify(webhookData)
      })

      const responseTime = Date.now() - startTime
      
      Logger.info('salesforce', 'Resposta do webhook recebida', {
        email: leadData.email,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const errorData = await response.text()
        Logger.error('salesforce', 'Webhook retornou erro HTTP', {
          email: leadData.email,
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseTime: `${responseTime}ms`
        })
        throw new Error(`Failed to send lead to Salesforce webhook: ${response.statusText} - ${errorData}`)
      }

      const result: SalesforceWebhookResponse = await response.json()
      
      Logger.info('salesforce', 'Resposta do webhook processada', {
        email: leadData.email,
        success: result.success,
        salesforceId: result.id,
        message: result.message,
        responseTime: `${responseTime}ms`
      })
      
      if (!result.success) {
        Logger.error('salesforce', 'Webhook retornou success=false', {
          email: leadData.email,
          result,
          responseTime: `${responseTime}ms`
        })
        throw new Error(`Salesforce webhook failed: ${result.message || JSON.stringify(result.errors)}`)
      }

      Logger.info('salesforce', 'Lead criado com sucesso no Salesforce', {
        email: leadData.email,
        salesforceId: result.id,
        responseTime: `${responseTime}ms`
      })

      return result.id || `webhook_${Date.now()}`
    } catch (error) {
      const responseTime = Date.now() - startTime
      Logger.error('salesforce', 'Erro na requisição do webhook', {
        email: leadData.email,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        responseTime: `${responseTime}ms`
      }, error instanceof Error ? error : new Error('Erro desconhecido'))
      throw error
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body: any = req.body

    const leadData: Omit<LeadBeePulse, 'id' | 'created_at'> = {
      nome_completo: body.nome_completo,
      email: body.email,
      telefone: body.telefone,
      nome_hotel: body.nome_hotel,
      site_url: body.site_url || null,
      score_basico: body.score_basico || null,
      relatório_avancado: body.relatório_avancado || null,
      pdf_url: body.pdf_url || null,
      salesforce_id: null,
      email_sent: false,
      analysis_id: body.analysis_id || null
    }

    const leadSource: string | undefined = typeof body.lead_source === 'string' ? body.lead_source : undefined

    if (!leadData.nome_completo || !leadData.email || !leadData.telefone || !leadData.nome_hotel) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    let salesforceId: string | null = null
    let salesforceError: string | null = null

    try {
      if (process.env.SALESFORCE_WEBHOOK_URL && 
          process.env.SALESFORCE_WEBHOOK_URL !== 'https://your-webhook-url.com/salesforce') {
        
        salesforceId = await SalesforceService.createLead(leadData, leadSource)
        Logger.info('salesforce', 'Lead enviado com sucesso', { salesforceId, email: leadData.email })
      } else {
        Logger.info('salesforce', 'Salesforce não configurado - modo demo')
        salesforceId = `demo_sf_${Date.now()}`
      }
    } catch (error) {
      Logger.error('salesforce', 'Erro ao enviar lead para Salesforce', { email: leadData.email }, error instanceof Error ? error : new Error('Erro desconhecido'))
      salesforceError = error instanceof Error ? error.message : 'Erro desconhecido'
    }

    const leadWithSalesforce = {
      nome_completo: leadData.nome_completo,
      email: leadData.email,
      telefone: leadData.telefone,
      nome_hotel: leadData.nome_hotel,
      site_url: leadData.site_url || null,
      score_basico: leadData.score_basico || null,
      salesforce_id: salesforceId,
      email_sent: false,
      analysis_id: leadData.analysis_id || null,
      pdf_url: leadData.pdf_url || null,
      relatório_avancado: leadData.relatório_avancado || null
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      Logger.info('supabase', 'Lead salvo em modo demo', { email: leadData.email, salesforce_id: salesforceId })
      const mockLead = { 
        ...leadWithSalesforce, 
        id: Date.now(), 
        created_at: new Date().toISOString() 
      }
      
      return res.status(200).json({ 
        success: true, 
        lead: mockLead,
        salesforce_id: salesforceId,
        salesforce_error: salesforceError
      })
    }

    try {
      const { data, error } = await supabase
        .from('leads_beepulse')
        .insert([leadWithSalesforce])
        .select()

      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ 
        success: true, 
        lead: data[0],
        salesforce_id: salesforceId,
        salesforce_error: salesforceError
      })
    } catch (supabaseError) {
      Logger.error('supabase', 'Erro ao salvar lead no Supabase - usando modo demo', { email: leadData.email }, supabaseError instanceof Error ? supabaseError : new Error('Erro desconhecido'))
      
      const mockLead = { 
        ...leadWithSalesforce, 
        id: Date.now(), 
        created_at: new Date().toISOString() 
      }
      
      return res.status(200).json({ 
        success: true, 
        lead: mockLead,
        salesforce_id: salesforceId,
        salesforce_error: salesforceError,
        supabase_error: 'Conexão com banco indisponível - usando modo demo'
      })
    }

  } catch (error) {
    Logger.error('general', 'Erro na API de lead', { body: req.body }, error instanceof Error ? error : new Error('Erro desconhecido'))
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}