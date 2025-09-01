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
  static async createLead(leadData: LeadBeePulse): Promise<string> {
    const webhookUrl = process.env.SALESFORCE_WEBHOOK_URL
    
    if (!webhookUrl) {
      throw new Error('SALESFORCE_WEBHOOK_URL não configurada')
    }
    
    // Separar nome completo em FirstName e LastName
    const nameParts = leadData.nome_completo.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'N/A'
    
    const webhookData = {
      FirstName: firstName,
      LastName: lastName,
      Email: leadData.email,
      Phone: leadData.telefone,
      Company: `Hotel ${leadData.nome_hotel}`,
      Website: leadData.site_url,
      Status: 'Novo Lead – BeePulse',
      Score_BeePulse__c: leadData.score_basico ? parseFloat(leadData.score_basico) : null,
      Relatorio_BeePulse_URL__c: leadData.pdf_url,
      Source: 'BeePulse',
      CreatedAt: new Date().toISOString()
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BeePulse/1.0'
      },
      body: JSON.stringify(webhookData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to send lead to Salesforce webhook: ${response.statusText} - ${errorData}`)
    }

    const result: SalesforceWebhookResponse = await response.json()
    
    if (!result.success) {
      throw new Error(`Salesforce webhook failed: ${result.message || JSON.stringify(result.errors)}`)
    }

    return result.id || `webhook_${Date.now()}`
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const leadData: Omit<LeadBeePulse, 'id' | 'created_at'> = req.body

    // Validar dados obrigatórios
    if (!leadData.nome_completo || !leadData.email || !leadData.telefone || !leadData.nome_hotel) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    let salesforceId: string | null = null
    let salesforceError: string | null = null

    // Tentar enviar para o Salesforce
    try {
      // Verificar se a URL do webhook do Salesforce está configurada
      if (process.env.SALESFORCE_WEBHOOK_URL && 
          process.env.SALESFORCE_WEBHOOK_URL !== 'https://your-webhook-url.com/salesforce') {
        
        salesforceId = await SalesforceService.createLead(leadData)
        Logger.info('salesforce', 'Lead enviado com sucesso', { salesforceId, email: leadData.email })
      } else {
        Logger.info('salesforce', 'Salesforce não configurado - modo demo')
        salesforceId = `demo_sf_${Date.now()}`
      }
    } catch (error) {
      Logger.error('salesforce', 'Erro ao enviar lead para Salesforce', { email: leadData.email }, error instanceof Error ? error : new Error('Erro desconhecido'))
      salesforceError = error instanceof Error ? error.message : 'Erro desconhecido'
    }

    // Salvar no Supabase com o ID do Salesforce
    const leadWithSalesforce = {
      ...leadData,
      salesforce_id: salesforceId,
      email_sent: false
    }

    // Verificar se o Supabase está configurado ou usar modo demo em caso de erro
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

    // Tentar salvar no Supabase com fallback para modo demo
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
      
      // Fallback para modo demo quando Supabase falha
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