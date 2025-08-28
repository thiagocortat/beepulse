'use client'

interface MobileExperienceProps {
  mobileScore: number
}

export default function MobileExperience({ mobileScore }: MobileExperienceProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excelente experiência mobile'
    if (score >= 65) return 'Boa experiência, com melhorias possíveis'
    if (score >= 50) return 'Experiência mediana, necessita otimizações'
    return 'Experiência mobile precisa de atenção urgente'
  }

  const mobileIssues = [
    {
      issue: 'Velocidade de carregamento lenta',
      present: mobileScore < 70,
      impact: 'Alto',
      solution: 'Otimizar imagens e reduzir JavaScript'
    },
    {
      issue: 'Botões muito pequenos para toque',
      present: mobileScore < 60,
      impact: 'Médio',
      solution: 'Aumentar área de toque para 44px mínimo'
    },
    {
      issue: 'Texto difícil de ler',
      present: mobileScore < 65,
      impact: 'Alto',
      solution: 'Usar fonte mínima de 16px e contraste adequado'
    },
    {
      issue: 'Layout não responsivo',
      present: mobileScore < 55,
      impact: 'Crítico',
      solution: 'Implementar design mobile-first'
    },
    {
      issue: 'Formulários difíceis de preencher',
      present: mobileScore < 70,
      impact: 'Alto',
      solution: 'Otimizar campos e teclados virtuais'
    }
  ]

  const presentIssues = mobileIssues.filter(issue => issue.present)
  const mobileStats = {
    mobileTraffic: 68,
    mobileBookings: 45,
    averageSessionTime: mobileScore > 70 ? '3:24' : '1:47'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiência Mobile</h2>
        <p className="text-gray-600">Análise da performance em dispositivos móveis</p>
      </div>

      {/* Score Mobile */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(mobileScore)} mb-4`}>
          <span className={`text-3xl font-bold ${getScoreColor(mobileScore)}`}>
            {mobileScore}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Score Mobile</h3>
        <p className={`font-medium ${getScoreColor(mobileScore)}`}>
          {getScoreMessage(mobileScore)}
        </p>
      </div>

      {/* Estatísticas Mobile */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">{mobileStats.mobileTraffic}%</div>
          <div className="text-sm text-blue-800">Tráfego Mobile</div>
          <div className="text-xs text-blue-600 mt-1">do total de visitantes</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">{mobileStats.mobileBookings}%</div>
          <div className="text-sm text-green-800">Reservas Mobile</div>
          <div className="text-xs text-green-600 mt-1">das conversões totais</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">{mobileStats.averageSessionTime}</div>
          <div className="text-sm text-purple-800">Tempo Médio</div>
          <div className="text-xs text-purple-600 mt-1">de sessão mobile</div>
        </div>
      </div>

      {/* Problemas Identificados */}
      {presentIssues.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Problemas Identificados</h3>
          <div className="space-y-4">
            {presentIssues.map((issue, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-red-800">{issue.issue}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.impact === 'Crítico' ? 'bg-red-200 text-red-800' :
                    issue.impact === 'Alto' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {issue.impact}
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  <strong>Solução:</strong> {issue.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações de Melhoria */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🚀 Melhorias Prioritárias</h4>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Implementar design responsivo completo</li>
            <li>• Otimizar velocidade de carregamento</li>
            <li>• Melhorar usabilidade dos formulários</li>
            <li>• Aumentar área de toque dos botões</li>
          </ul>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">📈 Impacto Esperado</h4>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• +35% aumento em conversões mobile</li>
            <li>• +50% tempo de permanência no site</li>
            <li>• -40% taxa de rejeição mobile</li>
            <li>• Melhor posicionamento no Google</li>
          </ul>
        </div>
      </div>

      {/* Comparativo Desktop vs Mobile */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">📱 Desktop vs Mobile</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Desktop</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de Conversão</span>
                <span className="font-medium">4.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo de Sessão</span>
                <span className="font-medium">4:15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Páginas por Sessão</span>
                <span className="font-medium">3.8</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Mobile</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de Conversão</span>
                <span className={`font-medium ${mobileScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {mobileScore > 70 ? '3.1%' : '1.8%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo de Sessão</span>
                <span className={`font-medium ${mobileScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {mobileStats.averageSessionTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Páginas por Sessão</span>
                <span className={`font-medium ${mobileScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {mobileScore > 70 ? '2.9' : '1.6'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}