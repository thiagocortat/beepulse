import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AnalysisSnapshot } from '@/types/analysis'
import ExemploRelatorioClient from './ExemploRelatorioClient'

export const metadata: Metadata = {
  title: 'Exemplo de Relatório BeePulse | Veja como funciona na prática',
  description: 'Confira um exemplo real de relatório BeePulse com análise completa de performance, SEO, segurança e recomendações para hotéis.'
}

async function getDemoSnapshot(): Promise<AnalysisSnapshot | null> {
  try {
    const { data, error } = await supabase
      .from('analises')
      .select('analysis_snapshot')
      .eq('site_url', 'demo')
      .single()

    if (error || !data) {
      console.log('No DEMO snapshot found')
      return null
    }

    return data.analysis_snapshot as AnalysisSnapshot
  } catch (error) {
    console.error('Error fetching DEMO snapshot:', error)
    return null
  }
}

export default async function ExemploRelatorio() {
  const demoSnapshot = await getDemoSnapshot()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Exemplo de Relatório BeePulse
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja exatamente o que você receberá ao analisar seu site
          </p>
        </div>

        {demoSnapshot ? (
          <ExemploRelatorioClient snapshot={demoSnapshot} />
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center mb-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-400">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Preview em preparação
              </h3>
              <p className="text-gray-600 mb-6">
                 Preview em preparação. Em breve, você poderá ver um exemplo real de relatório BeePulse.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-200">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-200">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/#analisar" 
            className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Quero meu diagnóstico
          </Link>
        </div>
      </div>
    </div>
  )
}