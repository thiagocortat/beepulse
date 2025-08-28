'use client'

interface BookingFunnelProps {
  scores: {
    performance: number
    seo: number
    mobile: number
    overall: number
  }
}

export default function BookingFunnel({ scores }: BookingFunnelProps) {
  // Simular taxas baseadas nos scores
  const calculateRates = () => {
    const baseRate = scores.overall / 100
    return {
      siteAccess: 100,
      bookingStart: Math.round(85 * baseRate + 15),
      checkout: Math.round(45 * baseRate + 25),
      completed: Math.round(35 * baseRate + 15)
    }
  }

  const rates = calculateRates()
  const abandonmentRate = 100 - rates.completed

  const funnelSteps = [
    {
      title: 'Acesso ao Site',
      percentage: rates.siteAccess,
      icon: '🌐',
      description: 'Visitantes chegam ao seu site'
    },
    {
      title: 'Início de Reserva',
      percentage: rates.bookingStart,
      icon: '🏨',
      description: 'Demonstram interesse em reservar'
    },
    {
      title: 'Checkout',
      percentage: rates.checkout,
      icon: '💳',
      description: 'Chegam ao processo de pagamento'
    },
    {
      title: 'Reserva Finalizada',
      percentage: rates.completed,
      icon: '✅',
      description: 'Completam a reserva com sucesso'
    }
  ]

  const getStepColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
    return colors[index]
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Jornada de Reservas</h2>
        <p className="text-gray-600">Análise do funil de conversão do seu site</p>
      </div>

      {/* Alerta de Taxa de Abandono */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-800">
              Seu site perde em média {abandonmentRate}% das reservas
            </h3>
            <p className="text-red-600 text-sm">
              A cada 100 visitantes interessados, apenas {rates.completed} finalizam a reserva
            </p>
          </div>
        </div>
      </div>

      {/* Funil Visual */}
      <div className="space-y-6">
        {funnelSteps.map((step, index) => {
          const width = (step.percentage / 100) * 100
          const isLast = index === funnelSteps.length - 1
          
          return (
            <div key={index} className="relative">
              {/* Linha conectora */}
              {!isLast && (
                <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gray-300 transform -translate-x-1/2 z-0"></div>
              )}
              
              {/* Step */}
              <div className="flex items-center gap-4">
                {/* Ícone */}
                <div className={`w-12 h-12 rounded-full ${getStepColor(index)} flex items-center justify-center text-white font-bold z-10`}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <span className="font-bold text-lg text-gray-700">{step.percentage}%</span>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ${getStepColor(index)}`}
                      style={{ 
                        width: `${width}%`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights e Recomendações */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Principais Gargalos */}
        <div className="p-6 bg-orange-50 rounded-lg">
          <h5 className="font-semibold text-orange-900 mb-3">🔍 Principais Gargalos</h5>
          <ul className="space-y-2 text-orange-800 text-sm">
            {rates.bookingStart < 70 && (
              <li>• Baixa conversão inicial - melhore a proposta de valor</li>
            )}
            {rates.checkout - rates.completed > 15 && (
              <li>• Alto abandono no checkout - simplifique o processo</li>
            )}
            {scores.mobile < 70 && (
              <li>• Experiência mobile prejudica conversões</li>
            )}
            {scores.performance < 70 && (
              <li>• Lentidão do site causa desistências</li>
            )}
          </ul>
        </div>

        {/* Oportunidades */}
        <div className="p-6 bg-green-50 rounded-lg">
          <h5 className="font-semibold text-green-900 mb-3">💡 Oportunidades</h5>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• Otimizar velocidade pode recuperar {Math.round(abandonmentRate * 0.3)}% das conversões</li>
            <li>• Checkout simplificado pode aumentar conversões em 25%</li>
            <li>• Chat online pode reduzir abandono em 15%</li>
            <li>• Garantias de segurança aumentam confiança</li>
          </ul>
        </div>
      </div>
    </div>
  )
}