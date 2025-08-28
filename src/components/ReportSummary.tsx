'use client'

interface ReportSummaryProps {
  scores: {
    performance: number
    seo: number
    mobile: number
    overall: number
  }
  siteUrl: string
}

export default function ReportSummary({ scores, siteUrl }: ReportSummaryProps) {
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

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excelente performance digital!'
    if (score >= 65) return 'Boa performance, com oportunidades de melhoria'
    if (score >= 50) return 'Performance mediana, necessita otimizações'
    return 'Performance baixa, requer atenção urgente'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumo Geral</h2>
        <p className="text-gray-600">Análise completa do site: {siteUrl}</p>
      </div>

      {/* Score Principal */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 mb-4">
          <span className={`text-5xl font-bold ${getScoreColor(scores.overall)}`}>
            {scores.overall}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nota Geral</h3>
        <p className={`text-lg font-medium ${getScoreColor(scores.overall)}`}>
          {getScoreMessage(scores.overall)}
        </p>
      </div>

      {/* Gráfico de Barras */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento por Categoria</h4>
        
        {/* Performance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Performance</span>
            <span className={`font-bold ${getScoreColor(scores.performance)}`}>
              {scores.performance}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(scores.performance)}`}
              style={{ width: `${scores.performance}%` }}
            ></div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">SEO</span>
            <span className={`font-bold ${getScoreColor(scores.seo)}`}>
              {scores.seo}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(scores.seo)}`}
              style={{ width: `${scores.seo}%`, animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Mobile</span>
            <span className={`font-bold ${getScoreColor(scores.mobile)}`}>
              {scores.mobile}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(scores.mobile)}`}
              style={{ width: `${scores.mobile}%`, animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Insights Rápidos */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-3">💡 Insights Principais</h5>
        <ul className="space-y-2 text-blue-800">
          {scores.performance < 70 && (
            <li>• Velocidade de carregamento pode estar impactando conversões</li>
          )}
          {scores.seo < 70 && (
            <li>• Otimizações de SEO podem aumentar sua visibilidade online</li>
          )}
          {scores.mobile < 70 && (
            <li>• Experiência mobile precisa de melhorias para capturar mais reservas</li>
          )}
          {scores.overall >= 80 && (
            <li>• Seu site está bem otimizado! Foque em conversão e marketing</li>
          )}
        </ul>
      </div>
    </div>
  )
}