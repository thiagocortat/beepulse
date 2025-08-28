'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getReportById, getAnalysisById, ReportData } from '@/lib/supabase'
import ReportPageNew from '@/components/ReportPageNew'
import { AnalysisSnapshot } from '@/types/analysis'
import { mockAnalysisSnapshot } from '@/data/mockAnalysisSnapshot'
// import { analyzeWebsite } from '@/lib/analysis' // Movido para API route

interface ExtendedReportData extends ReportData {
  analysis_id?: string
}

export default function RelatorioPage() {
  const params = useParams()
  const [reportData, setReportData] = useState<ExtendedReportData | null>(null)
  const [analysisSnapshot, setAnalysisSnapshot] = useState<AnalysisSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReport() {
      try {
        const data = await getReportById(params?.id as string)
        
        if (!data) throw new Error('Relatório não encontrado')

        setReportData(data as ExtendedReportData)
        
        // Se há analysis_id, buscar o analysisSnapshot
        if ((data as any).analysis_id) {
          const analysisData = await getAnalysisById((data as any).analysis_id)
          if (analysisData) {
            setAnalysisSnapshot(analysisData.analysis_snapshot)
          }
        } else {
          // Tentar obter análise real do website via API
          try {
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: data.site_url,
                hotelName: data.nome_hotel
              })
            })
            
            const result = await response.json()
            
            if (result.success && result.data) {
              setAnalysisSnapshot(result.data)
            } else {
              throw new Error(result.error || 'Erro na API de análise')
            }
          } catch (error) {
            // Para demonstração, usar mock mas com a URL real do lead
            const mockWithRealUrl = {
              ...mockAnalysisSnapshot,
              meta: {
                ...mockAnalysisSnapshot.meta,
                siteUrl: data.site_url || mockAnalysisSnapshot.meta.siteUrl
              }
            }
            setAnalysisSnapshot(mockWithRealUrl)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar relatório'
        if (errorMessage === 'Relatório não encontrado') {
          setError('Este relatório não existe. Verifique se o link está correto ou se o relatório foi gerado recentemente.')
        } else {
          setError(errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      fetchReport()
    }
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Relatório não encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'Este relatório não existe ou foi removido.'}</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    )
  }

  // Se temos analysisSnapshot, usar o novo componente
  if (analysisSnapshot) {
    const leadData = {
      id: reportData.id.toString(),
      nome_hotel: reportData.nome_hotel,
      nome_completo: '', // Não disponível no contexto atual
      email: '' // Não disponível no contexto atual
    }
    
    return <ReportPageNew analysisSnapshot={analysisSnapshot} leadData={leadData} />
  }

  // Fallback - tentar análise real ou usar mock data
  const leadData = {
    id: reportData.id.toString(),
    nome_hotel: reportData.nome_hotel,
    nome_completo: '', // Não disponível no contexto atual
    email: '' // Não disponível no contexto atual
  }
  
  // Este código não deveria ser executado, mas como fallback
  const mockWithRealUrl = {
    ...mockAnalysisSnapshot,
    meta: {
      ...mockAnalysisSnapshot.meta,
      siteUrl: reportData.site_url || mockAnalysisSnapshot.meta.siteUrl
    }
  }
  
  return <ReportPageNew analysisSnapshot={mockWithRealUrl} leadData={leadData} />
}