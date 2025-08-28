'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { AnalysisSnapshot } from '@/types/analysis'

interface ReportPDFNewProps {
  analysisSnapshot: AnalysisSnapshot
  hotelName: string
  onGenerating?: (isGenerating: boolean) => void
}

export interface ReportPDFNewRef {
  generatePDF: () => void
}

const ReportPDFNew = forwardRef<ReportPDFNewRef, ReportPDFNewProps>(({ analysisSnapshot, hotelName, onGenerating }, ref) => {
  const generatePDF = () => {
    handleGeneratePDF()
  }

  useImperativeHandle(ref, () => ({
    generatePDF
  }))

  const handleGeneratePDF = () => {
    if (onGenerating) onGenerating(true)
    
    // Importar jsPDF dinamicamente
    import('jspdf').then((jsPDFModule) => {
      try {
        const jsPDF = jsPDFModule.default
        const pdf = new jsPDF()
        
        // Configurações básicas
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20
        let currentY = margin
        
        // Cores Omnibees
        const beeYellow = '#FFD200'
        const beeBlack = '#1A1A1A'
        
        // Capa do relatório
        pdf.setFillColor(beeYellow)
        pdf.rect(0, 0, pageWidth, 60, 'F')
        
        pdf.setTextColor(beeBlack)
        pdf.setFontSize(24)
        pdf.text('BeePulse Report', margin, 35)
        
        pdf.setFontSize(16)
        pdf.text(`${hotelName}`, margin, 50)
        
        currentY = 80
        
        // Score principal
        pdf.setFontSize(20)
        pdf.text(`BeePulse Score: ${analysisSnapshot.meta.beePulseScore}`, margin, currentY)
        currentY += 20
        
        // Informações básicas
        pdf.setFontSize(12)
        pdf.text(`URL: ${analysisSnapshot.meta.siteUrl}`, margin, currentY)
        currentY += 10
        pdf.text(`Data da Análise: ${new Date(analysisSnapshot.meta.analyzedAtISO).toLocaleDateString('pt-BR')}`, margin, currentY)
        currentY += 20
        
        // Seção PSI
        pdf.setFontSize(16)
        pdf.text('PageSpeed Insights', margin, currentY)
        currentY += 15
        
        pdf.setFontSize(12)
        pdf.text(`Performance: ${analysisSnapshot.psi.performance}`, margin, currentY)
        currentY += 8
        pdf.text(`SEO: ${analysisSnapshot.psi.seo}`, margin, currentY)
        currentY += 8
        pdf.text(`Acessibilidade: ${analysisSnapshot.psi.accessibility}`, margin, currentY)
        currentY += 8
        pdf.text(`Boas Práticas: ${analysisSnapshot.psi.bestPractices}`, margin, currentY)
        currentY += 20
        
        // Core Web Vitals
        pdf.setFontSize(16)
        pdf.text('Core Web Vitals', margin, currentY)
        currentY += 15
        
        pdf.setFontSize(12)
        pdf.text('Mobile:', margin, currentY)
        currentY += 8
        pdf.text(`  LCP: ${analysisSnapshot.crux.mobile.lcp.p75}ms (${analysisSnapshot.crux.mobile.lcp.goodPct}% bom)`, margin + 10, currentY)
        currentY += 8
        pdf.text(`  CLS: ${analysisSnapshot.crux.mobile.cls.p75} (${analysisSnapshot.crux.mobile.cls.goodPct}% bom)`, margin + 10, currentY)
        currentY += 8
        pdf.text(`  INP: ${analysisSnapshot.crux.mobile.inp.p75}ms (${analysisSnapshot.crux.mobile.inp.goodPct}% bom)`, margin + 10, currentY)
        currentY += 15
        
        pdf.text('Desktop:', margin, currentY)
        currentY += 8
        pdf.text(`  LCP: ${analysisSnapshot.crux.desktop.lcp.p75}ms (${analysisSnapshot.crux.desktop.lcp.goodPct}% bom)`, margin + 10, currentY)
        currentY += 8
        pdf.text(`  CLS: ${analysisSnapshot.crux.desktop.cls.p75} (${analysisSnapshot.crux.desktop.cls.goodPct}% bom)`, margin + 10, currentY)
        currentY += 8
        pdf.text(`  INP: ${analysisSnapshot.crux.desktop.inp.p75}ms (${analysisSnapshot.crux.desktop.inp.goodPct}% bom)`, margin + 10, currentY)
        currentY += 20
        
        // Segurança
        pdf.setFontSize(16)
        pdf.text('Segurança', margin, currentY)
        currentY += 15
        
        pdf.setFontSize(12)
        pdf.text(`Safe Browsing: ${analysisSnapshot.security.safeBrowsing}`, margin, currentY)
        currentY += 8
        pdf.text(`SSL Labs: ${analysisSnapshot.security.sslLabsGrade}`, margin, currentY)
        currentY += 8
        pdf.text(`Observatory: ${analysisSnapshot.security.observatoryGrade}`, margin, currentY)
        currentY += 15
        
        // Recomendações
        if (analysisSnapshot.recommendations.length > 0) {
          pdf.setFontSize(16)
          pdf.text('Recomendações Omnibees', margin, currentY)
          currentY += 15
          
          pdf.setFontSize(12)
          analysisSnapshot.recommendations.slice(0, 3).forEach((rec, index) => {
            pdf.text(`${index + 1}. ${rec.message}`, margin, currentY)
            currentY += 10
          })
        }
        
        // Rodapé
        pdf.setFontSize(10)
        pdf.setTextColor(128, 128, 128)
        pdf.text('Omnibees · BeePulse', margin, pageHeight - 20)
        pdf.text(`Página 1 · ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 80, pageHeight - 20)
        
        // Salvar PDF
        const fileName = `beepulse-${hotelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
        pdf.save(fileName)
        
        console.log('✅ PDF gerado com sucesso!')
        
      } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error)
        alert('Erro ao gerar PDF: ' + (error instanceof Error ? error.message : 'Desconhecido'))
      } finally {
        if (onGenerating) onGenerating(false)
      }
    }).catch((error) => {
      console.error('❌ Erro na importação do jsPDF:', error)
      alert('Erro na importação: ' + error.message)
      if (onGenerating) onGenerating(false)
    })
  }
  
  return (
    <div className="text-center">
      <button
        onClick={handleGeneratePDF}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        📄 Baixar Relatório PDF Omnibees
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Relatório visual completo com identidade Omnibees
      </p>
    </div>
  )
})

ReportPDFNew.displayName = 'ReportPDFNew'

export default ReportPDFNew