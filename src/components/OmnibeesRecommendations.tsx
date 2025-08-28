'use client'

interface OmnibeesRecommendationsProps {
  scores: {
    performance: number
    seo: number
    mobile: number
    overall: number
  }
}

export default function OmnibeesRecommendations({ scores }: OmnibeesRecommendationsProps) {
  const recommendations = [
    {
      product: 'BeeDirect',
      title: 'Motor de Reservas Otimizado',
      description: 'Sistema de reservas diretas com checkout ultrarrápido e conversão otimizada',
      trigger: scores.performance < 70 || scores.overall < 75,
      benefits: [
        'Checkout 3x mais rápido',
        'Aumento de 40% nas conversões',
        'Integração com todos os canais',
        'Dashboard de performance em tempo real'
      ],
      icon: '🚀',
      color: 'blue',
      priority: 'high'
    },
    {
      product: 'Bee2Pay',
      title: 'Gateway de Pagamento Especializado',
      description: 'Solução completa de pagamentos para hotelaria com PIX, cartões e wallets digitais',
      trigger: scores.performance < 65,
      benefits: [
        'PIX instantâneo para reservas',
        'Taxas competitivas para hotelaria',
        'Checkout mobile otimizado',
        'Suporte 24/7 especializado'
      ],
      icon: '💳',
      color: 'green',
      priority: 'high'
    },
    {
      product: 'BeeConnect',
      title: 'Visibilidade em Canais Digitais',
      description: 'Maximize sua presença online e apareça nos principais canais de distribuição',
      trigger: scores.seo < 70,
      benefits: [
        'Presença em +200 canais',
        'Otimização automática de preços',
        'Gestão centralizada de inventário',
        'Relatórios de performance detalhados'
      ],
      icon: '🌐',
      color: 'purple',
      priority: 'medium'
    },
    {
      product: 'BeeAnalytics',
      title: 'Inteligência de Dados Avançada',
      description: 'Dashboard completo com insights de performance e oportunidades de crescimento',
      trigger: scores.overall < 80,
      benefits: [
        'Análises preditivas de demanda',
        'Otimização automática de preços',
        'Relatórios personalizados',
        'Alertas de oportunidades'
      ],
      icon: '📊',
      color: 'yellow',
      priority: 'low'
    }
  ]

  const activeRecommendations = recommendations.filter(rec => rec.trigger)
  const priorityOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3 }
  const sortedRecommendations = activeRecommendations.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string, border: string, text: string, button: string } } = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', button: 'bg-green-600 hover:bg-green-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', button: 'bg-purple-600 hover:bg-purple-700' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', button: 'bg-indigo-600 hover:bg-indigo-700' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', button: 'bg-yellow-600 hover:bg-yellow-700' }
    }
    return colors[color] || colors.blue
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: { text: 'Alta Prioridade', class: 'bg-red-100 text-red-800' },
      medium: { text: 'Prioridade Média', class: 'bg-yellow-100 text-yellow-800' },
      low: { text: 'Baixa Prioridade', class: 'bg-green-100 text-green-800' }
    }
    return badges[priority as keyof typeof badges] || badges.medium
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Soluções Recomendadas</h2>
        <p className="text-gray-600">Produtos Omnibees personalizados para suas necessidades</p>
      </div>

      {/* Header Omnibees */}
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Omnibees</span>
          <span className="text-yellow-600 font-semibold">Ecosystem</span>
        </div>
        <p className="text-gray-700">
          Baseado na análise do seu site, identificamos {sortedRecommendations.length} soluções 
          que podem impulsionar significativamente seus resultados
        </p>
      </div>

      {/* Recomendações */}
      <div className="space-y-6">
        {sortedRecommendations.map((rec, index) => {
          const colorClasses = getColorClasses(rec.color)
          const priorityBadge = getPriorityBadge(rec.priority)
          
          return (
            <div key={index} className={`border rounded-xl p-6 ${colorClasses.bg} ${colorClasses.border}`}>
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className="text-4xl flex-shrink-0">{rec.icon}</div>
                
                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold ${colorClasses.text}`}>
                      {rec.product}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadge.class}`}>
                      {priorityBadge.text}
                    </span>
                  </div>
                  
                  <h4 className={`text-lg font-semibold ${colorClasses.text} mb-3`}>
                    {rec.title}
                  </h4>
                  
                  <p className={`${colorClasses.text} mb-4 opacity-90`}>
                    {rec.description}
                  </p>
                  
                  {/* Benefícios */}
                  <div className="grid md:grid-cols-2 gap-2 mb-6">
                    {rec.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className={`flex items-center gap-2 ${colorClasses.text} opacity-80`}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Ações */}
                  <div className="flex flex-wrap gap-3">
                    <button className={`${colorClasses.button} text-white px-6 py-2 rounded-lg font-semibold transition-colors`}>
                      Conhecer {rec.product}
                    </button>
                    <button className={`border ${colorClasses.border} ${colorClasses.text} px-6 py-2 rounded-lg font-semibold transition-colors hover:bg-white`}>
                      Solicitar Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Call to Action Final */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">🚀 Acelere sua Transformação Digital</h3>
        <p className="mb-6 opacity-90">
          Fale com nossos especialistas e descubra como o ecossistema Omnibees 
          pode revolucionar os resultados do seu hotel
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold transition-colors">
            Falar com Especialista
          </button>
          <button className="border border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
            Agendar Apresentação
          </button>
        </div>
      </div>

      {/* Estatísticas de Sucesso */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">+2.500</div>
          <div className="text-sm text-gray-600">Hotéis Atendidos</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold text-green-600 mb-1">+45%</div>
          <div className="text-sm text-gray-600">Aumento Médio em Conversões</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
          <div className="text-sm text-gray-600">Satisfação dos Clientes</div>
        </div>
      </div>
    </div>
  )
}