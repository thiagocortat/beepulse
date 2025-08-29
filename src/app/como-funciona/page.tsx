import { Metadata } from 'next'
import Link from 'next/link'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Como o BeePulse funciona | Diagnóstico de Performance Digital',
  description: 'Entenda como o BeePulse analisa seu site em 4 passos simples: validação, coleta de dados reais, análise completa e relatório em PDF.'
}

const faqItems = [
  {
    question: 'Por que mobile pode ser diferente de desktop?',
    answer: 'Os dados do CrUX (Chrome User Experience Report) refletem experiências reais de usuários. Mobile geralmente tem conexões mais lentas e processamento limitado, resultando em métricas diferentes.'
  },
  {
    question: 'E se não houver dados CrUX para meu site?',
    answer: 'Sites com pouco tráfego podem não ter dados CrUX suficientes. Neste caso, focamos nos dados do Lighthouse e outras métricas disponíveis, ajustando o cálculo do score automaticamente.'
  },
  {
    question: 'Vocês executam reserva real?',
    answer: 'Não, simulamos o diagnóstico sem realizar transações reais. Analisamos a performance e usabilidade do seu site de forma segura, sem interferir no seu sistema de reservas.'
  }
]

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Como o BeePulse funciona
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Diagnóstico real com fontes reconhecidas e recomendações práticas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  1. Digite o site
                </h3>
                <p className="text-gray-600">
                  Validamos o domínio e normalizamos a URL para garantir análise precisa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2. Coletamos dados reais
                </h3>
                <p className="text-gray-600">
                  PageSpeed/Lighthouse, CrUX (Core Web Vitals), SSL Labs, Mozilla Observatory, RDAP e DNS.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  3. Mostramos sua nota (0–100)
                </h3>
                <p className="text-gray-600">
                  Painel com categorias (Performance, SEO, Acessibilidade, Boas Práticas), Web Vitals, Segurança, Domínio & DNS.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  4. Relatório completo + PDF
                </h3>
                <p className="text-gray-600">
                  Snapshot salvo e PDF visual com a identidade BeePulse para compartilhar com sua equipe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <FAQ items={faqItems} />
        </div>

        <div className="text-center">
          <a
            href="/#analisar"
            className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Analisar meu site
          </a>
        </div>
      </div>
    </div>
  )
}