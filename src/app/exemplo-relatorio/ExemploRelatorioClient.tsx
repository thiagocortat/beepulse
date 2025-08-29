'use client'

import { useState } from 'react'
import { AnalysisSnapshot } from '@/types/analysis'

interface ExemploRelatorioClientProps {
  snapshot: AnalysisSnapshot
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-100'
  if (score >= 75) return 'text-yellow-600 bg-yellow-100'
  if (score >= 50) return 'text-orange-600 bg-orange-100'
  return 'text-red-600 bg-red-100'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente'
  if (score >= 75) return 'Bom'
  if (score >= 50) return 'Precisa melhorar'
  return 'Crítico'
}

export default function ExemploRelatorioClient({ snapshot }: ExemploRelatorioClientProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const response = await fetch('/api/generate-demo-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'relatorio-beepulse-demo.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-8 mb-16">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-full mb-4">
            <span className="text-4xl font-bold text-black">{snapshot.meta.beePulseScore}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">BeePulse Score</h2>
          <p className="text-gray-600">{snapshot.meta.siteUrl}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 ${getScoreColor(snapshot.psi.performance)}`}>
              <span className="text-2xl font-bold">{snapshot.psi.performance}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-600">{getScoreLabel(snapshot.psi.performance)}</p>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 ${getScoreColor(snapshot.psi.seo)}`}>
              <span className="text-2xl font-bold">{snapshot.psi.seo}</span>
            </div>
            <h3 className="font-semibold text-gray-900">SEO</h3>
            <p className="text-sm text-gray-600">{getScoreLabel(snapshot.psi.seo)}</p>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 ${getScoreColor(snapshot.psi.accessibility)}`}>
              <span className="text-2xl font-bold">{snapshot.psi.accessibility}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Acessibilidade</h3>
            <p className="text-sm text-gray-600">{getScoreLabel(snapshot.psi.accessibility)}</p>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 ${getScoreColor(snapshot.psi.bestPractices)}`}>
              <span className="text-2xl font-bold">{snapshot.psi.bestPractices}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Boas Práticas</h3>
            <p className="text-sm text-gray-600">{getScoreLabel(snapshot.psi.bestPractices)}</p>
          </div>
        </div>

        {snapshot.crux && (
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Core Web Vitals (Dados Reais)</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">📱 Mobile</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">LCP</span>
                    <span className="font-semibold">{snapshot.crux.mobile.lcp.p75}s ({snapshot.crux.mobile.lcp.goodPct}% bom)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CLS</span>
                    <span className="font-semibold">{snapshot.crux.mobile.cls.p75} ({snapshot.crux.mobile.cls.goodPct}% bom)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">INP</span>
                    <span className="font-semibold">{snapshot.crux.mobile.inp.p75}ms ({snapshot.crux.mobile.inp.goodPct}% bom)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">💻 Desktop</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">LCP</span>
                    <span className="font-semibold">{snapshot.crux.desktop.lcp.p75}s ({snapshot.crux.desktop.lcp.goodPct}% bom)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CLS</span>
                    <span className="font-semibold">{snapshot.crux.desktop.cls.p75} ({snapshot.crux.desktop.cls.goodPct}% bom)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">INP</span>
                    <span className="font-semibold">{snapshot.crux.desktop.inp.p75}ms ({snapshot.crux.desktop.inp.goodPct}% bom)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Segurança & Confiabilidade</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 ${
                snapshot.security.safeBrowsing === 'OK' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <span className="text-2xl">{snapshot.security.safeBrowsing === 'OK' ? '✓' : '✗'}</span>
              </div>
              <h4 className="font-semibold text-gray-900">Safe Browsing</h4>
              <p className="text-sm text-gray-600">{snapshot.security.safeBrowsing}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 bg-green-100 text-green-600">
                <span className="text-2xl font-bold">{snapshot.security.sslLabsGrade}</span>
              </div>
              <h4 className="font-semibold text-gray-900">SSL Labs</h4>
              <p className="text-sm text-gray-600">Certificado SSL</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-2 bg-yellow-100 text-yellow-600">
                <span className="text-2xl font-bold">{snapshot.security.observatoryGrade}</span>
              </div>
              <h4 className="font-semibold text-gray-900">Observatory</h4>
              <p className="text-sm text-gray-600">Headers de segurança</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? 'Gerando PDF...' : 'Baixar PDF demo'}
        </button>
      </div>
    </div>
  )
}