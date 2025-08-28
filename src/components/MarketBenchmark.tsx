'use client'

interface MarketBenchmarkProps {
  overallScore: number
}

export default function MarketBenchmark({ overallScore }: MarketBenchmarkProps) {
  // Dados simulados de benchmark
  const benchmarkData = {
    regional: {
      average: 78,
      top10: 92,
      bottom10: 45
    },
    national: {
      average: 74,
      top10: 89,
      bottom10: 42
    },
    international: {
      average: 81,
      top10: 95,
      bottom10: 48
    }
  }

  const categories = [
    {
      name: 'Hotéis da Região',
      average: benchmarkData.regional.average,
      description: 'Hotéis similares na sua região',
      icon: '🏨'
    },
    {
      name: 'Média Nacional',
      average: benchmarkData.national.average,
      description: 'Hotéis do mesmo porte no Brasil',
      icon: '🇧🇷'
    },
    {
      name: 'Padrão Internacional',
      average: benchmarkData.international.average,
      description: 'Hotéis de referência mundial',
      icon: '🌍'
    }
  ]

  const getPerformanceStatus = (userScore: number, benchmarkScore: number) => {
    const diff = userScore - benchmarkScore
    if (diff >= 10) return { status: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' }
    if (diff >= 0) return { status: 'Acima da Média', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (diff >= -10) return { status: 'Abaixo da Média', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { status: 'Muito Abaixo', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const getPositionPercentile = (score: number) => {
    if (score >= 90) return 'Top 5%'
    if (score >= 80) return 'Top 20%'
    if (score >= 70) return 'Top 40%'
    if (score >= 60) return 'Top 60%'
    return 'Bottom 40%'
  }

  const competitorAnalysis = {
    betterThan: Math.round((overallScore / 100) * 85),
    worseThan: Math.round(100 - (overallScore / 100) * 85),
    position: getPositionPercentile(overallScore)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparativo com o Mercado</h2>
        <p className="text-gray-600">Como seu hotel se posiciona em relação à concorrência</p>
      </div>

      {/* Posição Geral */}
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="text-4xl font-bold text-gray-900 mb-2">{competitorAnalysis.position}</div>
        <p className="text-lg text-gray-700 mb-2">Seu hotel está no {competitorAnalysis.position} do mercado</p>
        <p className="text-sm text-gray-600">
          Performance melhor que {competitorAnalysis.betterThan}% dos hotéis analisados
        </p>
      </div>

      {/* Comparativos por Categoria */}
      <div className="space-y-6 mb-8">
        {categories.map((category, index) => {
          const performance = getPerformanceStatus(overallScore, category.average)
          const difference = overallScore - category.average
          
          return (
            <div key={index} className={`p-6 rounded-lg border ${performance.bg}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${performance.color}`}>
                    {difference > 0 ? '+' : ''}{difference} pontos
                  </div>
                  <div className={`text-sm font-medium ${performance.color}`}>
                    {performance.status}
                  </div>
                </div>
              </div>
              
              {/* Barra Comparativa */}
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Seu Hotel: {overallScore}</span>
                  <span>Média: {category.average}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 relative">
                  {/* Barra da média */}
                  <div 
                    className="absolute h-4 bg-gray-400 rounded-full"
                    style={{ width: `${category.average}%` }}
                  ></div>
                  {/* Barra do hotel */}
                  <div 
                    className={`absolute h-4 rounded-full transition-all duration-1000 ${
                      overallScore > category.average ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${overallScore}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Análise Detalhada */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Pontos Fortes */}
        <div className="p-6 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            💪 Pontos Fortes vs Concorrência
          </h4>
          <ul className="space-y-2 text-green-800 text-sm">
            {overallScore >= benchmarkData.regional.average && (
              <li>• Performance acima da média regional</li>
            )}
            {overallScore >= 70 && (
              <li>• Boa experiência geral do usuário</li>
            )}
            {overallScore >= 80 && (
              <li>• Entre os melhores da categoria</li>
            )}
            <li>• Potencial de crescimento identificado</li>
          </ul>
        </div>

        {/* Oportunidades */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            🎯 Oportunidades de Melhoria
          </h4>
          <ul className="space-y-2 text-blue-800 text-sm">
            {overallScore < benchmarkData.regional.average && (
              <li>• Alcançar média regional (+{benchmarkData.regional.average - overallScore} pontos)</li>
            )}
            {overallScore < benchmarkData.international.average && (
              <li>• Atingir padrão internacional</li>
            )}
            <li>• Otimizações podem gerar vantagem competitiva</li>
            <li>• Investimento em digital traz ROI comprovado</li>
          </ul>
        </div>
      </div>

      {/* Ranking Simulado */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">🏆 Ranking Competitivo (Simulado)</h4>
        <div className="space-y-3">
          {[
            { name: 'Hotel Premium Líder', score: 94, position: 1 },
            { name: 'Concorrente A', score: 87, position: 2 },
            { name: 'Concorrente B', score: 82, position: 3 },
            { name: 'SEU HOTEL', score: overallScore, position: overallScore >= 82 ? 3 : overallScore >= 75 ? 4 : 5, highlight: true },
            { name: 'Concorrente C', score: 75, position: overallScore > 75 ? 5 : 4 },
            { name: 'Média do Mercado', score: benchmarkData.regional.average, position: 6, isAverage: true }
          ].sort((a, b) => b.score - a.score).map((hotel, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
              hotel.highlight ? 'bg-yellow-100 border-2 border-yellow-300' :
              hotel.isAverage ? 'bg-gray-200' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                  {index + 1}
                </div>
                <span className={`font-medium ${
                  hotel.highlight ? 'text-yellow-800' :
                  hotel.isAverage ? 'text-gray-600' : 'text-gray-800'
                }`}>
                  {hotel.name}
                </span>
              </div>
              <div className={`font-bold ${
                hotel.highlight ? 'text-yellow-800' :
                hotel.isAverage ? 'text-gray-600' : 'text-gray-800'
              }`}>
                {hotel.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}