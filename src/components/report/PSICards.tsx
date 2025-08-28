'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface PSICardsProps {
  psiData: AnalysisSnapshot['psi']
}

export default function PSICards({ psiData }: PSICardsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const categories = [
    {
      key: 'performance' as const,
      title: 'Performance',
      icon: '⚡',
      description: 'Velocidade de carregamento'
    },
    {
      key: 'seo' as const,
      title: 'SEO',
      icon: '🔍',
      description: 'Otimização para buscadores'
    },
    {
      key: 'accessibility' as const,
      title: 'Acessibilidade',
      icon: '♿',
      description: 'Usabilidade inclusiva'
    },
    {
      key: 'bestPractices' as const,
      title: 'Boas Práticas',
      icon: '✅',
      description: 'Padrões web modernos'
    }
  ]

  const getOpportunitiesForCategory = (category: string) => {
    return psiData.topOpportunities
      .filter(opp => opp.category === category)
      .slice(0, 3)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PageSpeed Insights (Lighthouse)</h2>
        <p className="text-gray-600">Análise técnica baseada em dados do Google</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const score = psiData[category.key]
          const opportunities = getOpportunitiesForCategory(category.key === 'bestPractices' ? 'best-practices' : category.key)
          
          return (
            <div key={category.key} className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${getBarColor(score)}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
              
              {opportunities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Principais oportunidades:</h4>
                  <ul className="space-y-1">
                    {opportunities.map((opp, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-yellow-500 mr-1">•</span>
                        <span>{opp.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}