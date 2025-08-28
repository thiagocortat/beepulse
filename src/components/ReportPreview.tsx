export default function ReportPreview() {
  const metrics = [
    { name: 'Performance', score: 74, color: 'bg-orange-500', description: 'Velocidade de carregamento' },
    { name: 'SEO', score: 62, color: 'bg-red-500', description: 'Otimização para buscadores' },
    { name: 'Mobile', score: 68, color: 'bg-yellow-500', description: 'Experiência em dispositivos móveis' },
    { name: 'Acessibilidade', score: 81, color: 'bg-green-500', description: 'Usabilidade para todos os usuários' }
  ]

  const insights = [
    {
      type: 'Crítico',
      title: 'Checkout lento',
      description: 'Processo de reserva demora 8.3s para carregar',
      impact: 'Alto',
      color: 'text-red-600 bg-red-50'
    },
    {
      type: 'Importante',
      title: 'SEO abaixo da média',
      description: 'Faltam meta descriptions em 67% das páginas',
      impact: 'Médio',
      color: 'text-orange-600 bg-orange-50'
    },
    {
      type: 'Oportunidade',
      title: 'Site não otimizado para mobile',
      description: 'Botões pequenos e texto difícil de ler',
      impact: 'Alto',
      color: 'text-yellow-600 bg-yellow-50'
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Veja como será seu relatório
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Análise detalhada com insights práticos para melhorar a performance do seu site
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-300 text-sm font-mono">beepulse.omnibees.com</div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Relatório BeePulse – Hotel Exemplo
                </h3>
                <p className="text-gray-600">Análise realizada em {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-500 mb-1">74/100</div>
                <div className="text-sm text-gray-500">Pontuação Geral</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                    <div className="text-2xl font-bold text-gray-900">{metric.score}</div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${metric.color}`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6">Principais Insights</h4>
              
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${insight.color}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white">
                            {insight.type}
                          </span>
                          <span className="text-xs text-gray-500">Impacto: {insight.impact}</span>
                        </div>
                        
                        <h5 className="font-semibold text-gray-900 mb-1">{insight.title}</h5>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                      
                      <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h5 className="font-semibold text-yellow-800">Potencial de Melhoria</h5>
                  <p className="text-sm text-yellow-700">Implementando nossas recomendações, você pode aumentar suas conversões em até 35%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}