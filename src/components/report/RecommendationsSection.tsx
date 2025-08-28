'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface RecommendationsSectionProps {
  recommendations: AnalysisSnapshot['recommendations']
}

export default function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'checkout': return '💳'
      case 'mobile': return '📱'
      case 'seo': return '🔍'
      case 'seguranca': return '🔒'
      case 'dns': return '🌐'
      default: return '💡'
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'checkout': return 'bg-green-50 border-green-200 text-green-800'
      case 'mobile': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'seo': return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'seguranca': return 'bg-red-50 border-red-200 text-red-800'
      case 'dns': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAreaTitle = (area: string) => {
    switch (area) {
      case 'checkout': return 'Checkout & Conversão'
      case 'mobile': return 'Experiência Mobile'
      case 'seo': return 'SEO & Visibilidade'
      case 'seguranca': return 'Segurança'
      case 'dns': return 'DNS & Infraestrutura'
      default: return 'Geral'
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recomendações Omnibees</h2>
          <p className="text-gray-600">Soluções personalizadas para seu hotel</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Excelente performance!</h3>
          <p className="text-green-700">
            Seu site está bem otimizado. Continue monitorando regularmente para manter a qualidade.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recomendações Omnibees</h2>
        <p className="text-gray-600">Soluções personalizadas baseadas na análise do seu site</p>
      </div>

      <div className="space-y-6">
        {recommendations.slice(0, 5).map((recommendation, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-6 ${getAreaColor(recommendation.area)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{getAreaIcon(recommendation.area)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getAreaTitle(recommendation.area)}
                    </h3>
                    <span className="text-sm opacity-75">Prioridade {index + 1}</span>
                  </div>
                </div>
                
                <p className="mb-4 leading-relaxed">
                  {recommendation.message}
                </p>
                
                <a 
                  href={recommendation.omniLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
                >
                  🚀 Ver Solução Omnibees
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recommendations.length > 5 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            + {recommendations.length - 5} recomendações adicionais disponíveis no relatório completo
          </p>
        </div>
      )}
    </div>
  )
}