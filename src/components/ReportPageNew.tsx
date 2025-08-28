'use client'

import { useRef } from 'react'
import { AnalysisSnapshot } from '@/types/analysis'
import ReportHeader from '@/components/report/ReportHeader'
import PSICards from './report/PSICards'
import CoreWebVitals from './report/CoreWebVitals'
import SecuritySection from './report/SecuritySection'
import DomainDNSSection from './report/DomainDNSSection'
import RecommendationsSection from './report/RecommendationsSection'
import ReportFooter from './report/ReportFooter'
import ReportPDFNew, { ReportPDFNewRef } from './ReportPDFNew'

interface ReportPageNewProps {
  analysisSnapshot: AnalysisSnapshot
  leadData?: {
    id: string
    nome_hotel: string
    nome_completo: string
    email: string
  }
}

export default function ReportPageNew({ analysisSnapshot, leadData }: ReportPageNewProps) {
  const pdfRef = useRef<ReportPDFNewRef>(null)

  const handleDownloadPDF = () => {
    if (pdfRef.current) {
      pdfRef.current.generatePDF()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Header */}
      <ReportHeader 
        analysisSnapshot={analysisSnapshot}
        hotelName={leadData?.nome_hotel || 'Hotel'}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Cartões PSI */}
        <div className="animate-fade-in">
          <PSICards psiData={analysisSnapshot.psi} />
        </div>

        {/* Core Web Vitals */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CoreWebVitals cruxData={analysisSnapshot.crux} notes={analysisSnapshot.notes} />
        </div>

        {/* Segurança */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SecuritySection securityData={analysisSnapshot.security} notes={analysisSnapshot.notes} />
        </div>

        {/* Domínio & DNS */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <DomainDNSSection 
            domainData={analysisSnapshot.domain} 
            dnsData={analysisSnapshot.dns}
            notes={analysisSnapshot.notes}
          />
        </div>

        {/* Recomendações Omnibees */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <RecommendationsSection recommendations={analysisSnapshot.recommendations} />
        </div>

        {/* Botão PDF Visual */}
        <div className="animate-fade-in" style={{ animationDelay: '1.0s' }}>
          <ReportPDFNew 
            ref={pdfRef}
            analysisSnapshot={analysisSnapshot}
            hotelName={leadData?.nome_hotel || 'Hotel'}
          />
        </div>
      </div>

      {/* Footer */}
      <ReportFooter notes={analysisSnapshot.notes} />
    </div>
  )
}