import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Benefícios do BeePulse | Mais reservas diretas para seu hotel',
  description: 'Descubra como o diagnóstico BeePulse pode aumentar suas reservas diretas, melhorar a experiência mobile e fortalecer a segurança do seu site.'
}

export default function Beneficios() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Benefícios para seu hotel/pousada
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforme dados técnicos em resultados reais para seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-green-600">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Mais reservas diretas</h3>
            </div>
            <p className="text-gray-600">
              Site rápido e claro reduz abandono no funil de reservas.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-blue-600">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Experiência mobile melhor</h3>
            </div>
            <p className="text-gray-600">
              Web Vitals otimizados aumentam conversão em dispositivos móveis.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-red-600">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Segurança & confiança</h3>
            </div>
            <p className="text-gray-600">
              TLS e headers corretos evitam bloqueios e alertas de segurança.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-yellow-600">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Caminho de melhoria</h3>
            </div>
            <p className="text-gray-600">
              Recomendações práticas conectadas às soluções Omnibees.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hotéis confiam na Omnibees
          </h2>
          <p className="text-gray-600 mb-6">
            Mais de 9.500 hotéis parceiros e +R$25 bilhões em transações anuais. 
            Líder em tecnologia hoteleira no Brasil e América Latina.
          </p>
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg border">
            <span className="text-yellow-500 mr-2">⭐</span>
            <span className="font-semibold text-gray-900">+93% satisfação dos clientes</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/exemplo-relatorio" 
            className="inline-block bg-white border-2 border-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-50 transition-colors text-center"
          >
            Ver exemplo de relatório
          </Link>
          <Link 
            href="/#analisar" 
            className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
          >
            Analisar meu site
          </Link>
        </div>
      </div>
    </div>
  )
}