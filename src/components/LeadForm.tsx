'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { insertLead, LeadBeePulse } from '@/lib/supabase'

interface ScoreData {
  performance: number
  seo: number
  mobile: number
  overall: number
  url: string
}

interface LeadFormProps {
  analysisData?: ScoreData | null
}

export default function LeadForm({ analysisData }: LeadFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    nome_hotel: '',
    site_url: ''
  })
  const [leadSource, setLeadSource] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const lastUrl = typeof window !== 'undefined' ? localStorage.getItem('lastAnalyzedUrl') : null
    const initialUrl = analysisData?.url || lastUrl || ''
    const storedSource = typeof window !== 'undefined' ? localStorage.getItem('lead_source') : ''
    setFormData(prev => ({ ...prev, site_url: initialUrl }))
    setLeadSource(storedSource || '')
  }, [analysisData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const lastUrl = typeof window !== 'undefined' ? localStorage.getItem('lastAnalyzedUrl') : null
      const siteFromForm = formData.site_url?.trim() || ''
      const siteUrl = siteFromForm || analysisData?.url || lastUrl || null

      const leadData: any = {
        nome_completo: formData.nome_completo,
        email: formData.email,
        telefone: formData.telefone,
        nome_hotel: formData.nome_hotel,
        site_url: siteUrl,
        score_basico: analysisData ? JSON.stringify({
          performance: analysisData.performance,
          seo: analysisData.seo,
          mobile: analysisData.mobile,
          overall: analysisData.overall
        }) : null
      }

      if (leadSource) {
        leadData.lead_source = leadSource
      }
      
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar dados')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar lead')
      }

      const leadId = result.lead.id
      
      try { localStorage.removeItem('lead_source') } catch {}
      router.push(`/relatorio/${leadId}`)
      
    } catch (err) {
      setError('Erro ao enviar formulário. Tente novamente.')
      console.error('Erro ao processar lead:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="lead-form" className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Obrigado pelo seu interesse!
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Recebemos seus dados e em breve nossa equipe entrará em contato com seu relatório completo do BeePulse.
            </p>
            
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <p className="text-yellow-800 font-semibold">
                📧 Verifique seu email nos próximos minutos
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                Enviaremos um preview do seu relatório em instantes
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="lead-form" className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fale com um especialista Omnibees
          </h2>
          <p className="text-xl text-gray-600">
            Deixe seus dados e nossa equipe entra em contato para orientar os próximos passos.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="lead_source" value={leadSource} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome_completo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome_completo"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label htmlFor="nome_hotel" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Hotel *
                </label>
                <input
                  type="text"
                  id="nome_hotel"
                  name="nome_hotel"
                  value={formData.nome_hotel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="Nome do seu hotel"
                />
              </div>
            </div>

            <div>
              <label htmlFor="site_url" className="block text-sm font-semibold text-gray-700 mb-2">
                Site do hotel
              </label>
              <input
                type="text"
                id="site_url"
                name="site_url"
                value={formData.site_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                placeholder="https://seuhotel.com.br"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Relatório Completo'}
              </button>
              {error && (
                <p className="text-red-600 text-center mt-3">{error}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}