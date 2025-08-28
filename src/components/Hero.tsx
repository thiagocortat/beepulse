'use client'

export default function Hero() {
  const scrollToAnalysis = () => {
    const analysisElement = document.getElementById('domain-analysis')
    if (analysisElement) {
      analysisElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          BeePulse – O Raio-X Digital do seu Hotel
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Descubra como seu site está performando e conquiste mais reservas diretas.
        </p>
        
        <button 
          onClick={scrollToAnalysis}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Analise Agora
        </button>
        
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-400 text-sm">beepulse.omnibees.com</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <div className="text-gray-600 mb-2">Análise de Performance Digital</div>
              <div className="text-2xl font-bold text-gray-900 mb-4">Hotel Exemplo - Relatório BeePulse</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Performance</div>
                  <div className="text-2xl font-bold text-orange-500">74/100</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-500">SEO</div>
                  <div className="text-2xl font-bold text-red-500">62/100</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Mobile</div>
                  <div className="text-2xl font-bold text-yellow-500">68/100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}