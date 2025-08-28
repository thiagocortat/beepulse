import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, LeadBeePulse } from '@/lib/supabase'
import Logger from '@/lib/logger'

interface SalesforceTokenResponse {
  access_token: string
  instance_url: string
  id: string
  token_type: string
  issued_at: string
  signature: string
}

interface SalesforceLeadResponse {
  id: string
  success: boolean
  errors: any[]
}

class SalesforceService {
  private static async getAccessToken(): Promise<string> {
    const tokenUrl = `${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
      refresh_token: process.env.SALESFORCE_REFRESH_TOKEN!
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    if (!response.ok) {
      throw new Error(`Failed to get Salesforce token: ${response.statusText}`)
    }

    const data: SalesforceTokenResponse = await response.json()
    return data.access_token
  }

  static async createLead(leadData: LeadBeePulse): Promise<string> {
    const accessToken = await this.getAccessToken()
    
    // Separar nome completo em FirstName e LastName
    const nameParts = leadData.nome_completo.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'N/A'
    
    const salesforceData = {
      FirstName: firstName,
      LastName: lastName,
      Email: leadData.email,
      Phone: leadData.telefone,
      Company: `Hotel ${leadData.nome_hotel}`,
      Website: leadData.site_url,
      Status: 'Novo Lead – BeePulse',
      Score_BeePulse__c: leadData.score_basico ? parseFloat(leadData.score_basico) : null,
      Relatorio_BeePulse_URL__c: leadData.pdf_url
    }

    const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v58.0/sobjects/Lead/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(salesforceData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to create Salesforce lead: ${response.statusText} - ${errorData}`)
    }

    const result: SalesforceLeadResponse = await response.json()
    
    if (!result.success) {
      throw new Error(`Salesforce lead creation failed: ${JSON.stringify(result.errors)}`)
    }

    return result.id
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
      // Verificar se as variáveis de ambiente do Salesforce estão configuradas
      if (process.env.SALESFORCE_CLIENT_ID && 
          process.env.SALESFORCE_CLIENT_SECRET && 
          process.env.SALESFORCE_INSTANCE_URL && 
          process.env.SALESFORCE_REFRESH_TOKEN &&
          process.env.SALESFORCE_CLIENT_ID !== 'your_salesforce_client_id') {
        
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