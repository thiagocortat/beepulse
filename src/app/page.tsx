'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import DomainInput from '@/components/DomainInput'
import ScorePreview from '@/components/ScorePreview'
import HowItWorks from '@/components/HowItWorks'
import Benefits from '@/components/Benefits'
import ReportPreview from '@/components/ReportPreview'
import LeadForm from '@/components/LeadForm'
import Authority from '@/components/Authority'
import Footer from '@/components/Footer'
import { analyzeWebsite } from '@/lib/pagespeed'

interface ScoreData {
  performance: number
  seo: number
  mobile: number
  overall: number
  url: string
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [analysisError, setAnalysisError] = useState('')

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true)
    setAnalysisError('')
    setScoreData(null)

    try {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('lastAnalyzedUrl', url) } catch {}
      }
      const result = await analyzeWebsite(url)
      setScoreData(result)
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar o site')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleViewFullReport = () => {
    const formElement = document.getElementById('lead-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <DomainInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
      {analysisError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{analysisError}</p>
          </div>
        </div>
      )}
      <ScorePreview scoreData={scoreData} onViewFullReport={handleViewFullReport} />
      <HowItWorks />
      <Benefits />
      <ReportPreview />
      <LeadForm analysisData={scoreData} />
      <Authority />
      <Footer />
    </main>
  )
}
