'use client'

interface ScoreData {
  performance: number
  seo: number
  mobile: number
  overall: number
  url: string
}

interface ScorePreviewProps {
  scoreData: ScoreData | null
  onViewFullReport: () => void
}

export default function ScorePreview({ scoreData, onViewFullReport }: ScorePreviewProps) {
  if (!scoreData) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excelente! Seu site está bem otimizado.'
    if (score >= 50) return 'Bom! Há oportunidades de melhoria.'
    return 'Atenção! Seu site precisa de otimizações urgentes.'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-omnibees-black mb-2">
            Análise do seu site
          </h3>
          <p className="text-omnibees-gray-medium">
            {scoreData.url}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-omnibees-black">
              Score Geral
            </span>
            <span className={`text-3xl font-bold ${getScoreColor(scoreData.overall)}`}>
              {scoreData.overall}/100
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ease-out ${getProgressColor(scoreData.overall)}`}
              style={{ width: `${scoreData.overall}%` }}
            ></div>
          </div>
          
          <p className={`text-center font-medium ${getScoreColor(scoreData.overall)}`}>
            {getScoreMessage(scoreData.overall)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-omnibees-black mb-1">Performance</h4>
            <p className={`text-2xl font-bold ${getScoreColor(scoreData.performance)}`}>
              {scoreData.performance}/100
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-omnibees-black mb-1">SEO</h4>
            <p className={`text-2xl font-bold ${getScoreColor(scoreData.seo)}`}>
              {scoreData.seo}/100
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-omnibees-black mb-1">Mobile</h4>
            <p className={`text-2xl font-bold ${getScoreColor(scoreData.mobile)}`}>
              {scoreData.mobile}/100
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-omnibees-yellow/10 to-yellow-100 rounded-lg p-6 text-center">
          <p className="text-omnibees-black mb-4 text-lg">
            <strong>Seu site está com nota {scoreData.overall}/100.</strong><br />
            Descubra oportunidades de melhoria no relatório completo.
          </p>
          <button
            onClick={onViewFullReport}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </div>
  )
}