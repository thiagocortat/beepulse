import { useState, useEffect } from 'react'
import { supabase, LeadBeePulse } from '@/lib/supabase'
import Head from 'next/head'

interface LeadWithStatus extends LeadBeePulse {
  salesforce_status: 'success' | 'error' | 'pending'
  email_status: 'sent' | 'failed' | 'pending'
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<LeadWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      
      // Verificar se o Supabase está configurado
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Dados mockados para demonstração
        const mockLeads: LeadWithStatus[] = [
          {
            id: 1,
            nome_completo: 'João Silva',
            email: 'joao@hotelexemplo.com',
            telefone: '(11) 99999-9999',
            nome_hotel: 'Hotel Exemplo',
            site_url: 'https://hotelexemplo.com',
            score_basico: '85',
            salesforce_id: 'SF001',
            email_sent: true,
            salesforce_status: 'success',
            email_status: 'sent',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            nome_completo: 'Maria Santos',
            email: 'maria@pousadaverde.com',
            telefone: '(21) 88888-8888',
            nome_hotel: 'Pousada Verde',
            site_url: 'https://pousadaverde.com',
            score_basico: '72',
            salesforce_id: 'SF002',
            email_sent: false,
            salesforce_status: 'success',
            email_status: 'failed',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            nome_completo: 'Carlos Oliveira',
            email: 'carlos@resortparaiso.com',
            telefone: '(31) 77777-7777',
            nome_hotel: 'Resort Paraíso',
            site_url: 'https://resortparaiso.com',
            score_basico: '91',
            salesforce_id: null,
            email_sent: false,
            salesforce_status: 'error',
            email_status: 'pending',
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ]
        
        setLeads(mockLeads)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('leads_beepulse')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Processar dados para adicionar status
      const leadsWithStatus: LeadWithStatus[] = (data || []).map(lead => ({
        ...lead,
        salesforce_status: lead.salesforce_id ? 'success' : 'error',
        email_status: lead.email_sent ? 'sent' : 'failed'
      }))

      setLeads(leadsWithStatus)
    } catch (err) {
      setError('Erro ao carregar leads')
      console.error('Erro ao buscar leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, type: 'salesforce' | 'email') => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold'
    
    if (type === 'salesforce') {
      switch (status) {
        case 'success':
          return `${baseClasses} bg-green-100 text-green-800`
        case 'error':
          return `${baseClasses} bg-red-100 text-red-800`
        case 'pending':
          return `${baseClasses} bg-yellow-100 text-yellow-800`
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`
      }
    } else {
      switch (status) {
        case 'sent':
          return `${baseClasses} bg-green-100 text-green-800`
        case 'failed':
          return `${baseClasses} bg-red-100 text-red-800`
        case 'pending':
          return `${baseClasses} bg-yellow-100 text-yellow-800`
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`
      }
    }
  }

  const getStatusText = (status: string, type: 'salesforce' | 'email') => {
    if (type === 'salesforce') {
      switch (status) {
        case 'success': return 'Enviado'
        case 'error': return 'Erro'
        case 'pending': return 'Pendente'
        default: return 'Desconhecido'
      }
    } else {
      switch (status) {
        case 'sent': return 'Enviado'
        case 'failed': return 'Falhou'
        case 'pending': return 'Pendente'
        default: return 'Desconhecido'
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin - Leads BeePulse</title>
        <meta name="description" content="Painel administrativo dos leads BeePulse" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">Leads BeePulse</h1>
              <p className="mt-2 text-gray-600">Gerenciamento de leads e status de integração</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Leads</h2>
              <p className="text-sm text-gray-600">Total: {leads.length} leads</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome / Hotel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salesforce
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.nome_completo}</div>
                          <div className="text-sm text-gray-500">{lead.nome_hotel}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.telefone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.score_basico || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(lead.salesforce_status, 'salesforce')}>
                          {getStatusText(lead.salesforce_status, 'salesforce')}
                        </span>
                        {lead.salesforce_id && (
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {lead.salesforce_id}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(lead.email_status, 'email')}>
                          {getStatusText(lead.email_status, 'email')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.created_at ? formatDate(lead.created_at) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum lead encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}