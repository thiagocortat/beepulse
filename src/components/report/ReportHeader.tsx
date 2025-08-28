'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface ReportHeaderProps {
  analysisSnapshot: AnalysisSnapshot
  hotelName: string
  onDownloadPDF: (pdfUrl: string) => void
}

export default function ReportHeader({ analysisSnapshot, hotelName, onDownloadPDF }: ReportHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Relatório BeePulse - {hotelName}
            </h1>
            <p className="text-gray-600 mt-1">
              {analysisSnapshot.meta.siteUrl}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Análise realizada em {formatDate(analysisSnapshot.meta.analyzedAtISO)}
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(analysisSnapshot.meta.beePulseScore)}`}>
              {analysisSnapshot.meta.beePulseScore}
            </div>
            <div className="text-sm text-gray-500 mb-4">BeePulse Score</div>
            
            <button
              onClick={() => onDownloadPDF('mock-pdf-url')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              📄 Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}