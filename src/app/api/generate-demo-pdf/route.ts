import { NextRequest, NextResponse } from 'next/server'
import { AnalysisSnapshot } from '@/types/analysis'
import jsPDF from 'jspdf'

function generateDemoPDF(snapshot: AnalysisSnapshot): Buffer {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  
  // Cores BeePulse
  const colors = {
    beeYellow: [255, 210, 0] as [number, number, number],
    beeBlack: [26, 26, 26] as [number, number, number]
  }
  
  // CAPA
  pdf.setFillColor(...colors.beeYellow)
  pdf.rect(0, 0, pageWidth, 80, 'F')
  
  pdf.setTextColor(...colors.beeBlack)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Relatório BeePulse', margin, 40)
  pdf.setFontSize(16)
  pdf.text(snapshot.meta.siteUrl, margin, 55)
  
  const analysisDate = new Date(snapshot.meta.analyzedAtISO).toLocaleDateString('pt-BR')
  pdf.setFontSize(12)
  pdf.text(`Análise realizada em ${analysisDate}`, margin, 100)
  
  // Score principal
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.text(snapshot.meta.beePulseScore.toString(), margin, 140)
  pdf.setFontSize(16)
  pdf.text('BeePulse Score', margin + 50, 140)
  
  // Lighthouse scores
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  let yPos = 170
  pdf.text(`Performance: ${snapshot.psi.performance}`, margin, yPos)
  pdf.text(`SEO: ${snapshot.psi.seo}`, margin, yPos + 15)
  pdf.text(`Acessibilidade: ${snapshot.psi.accessibility}`, margin, yPos + 30)
  pdf.text(`Boas Práticas: ${snapshot.psi.bestPractices}`, margin, yPos + 45)
  
  // Segurança
  yPos += 80
  pdf.setFont('helvetica', 'bold')
  pdf.text('Segurança:', margin, yPos)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Safe Browsing: ${snapshot.security.safeBrowsing}`, margin, yPos + 15)
  pdf.text(`SSL Labs: ${snapshot.security.sslLabsGrade}`, margin, yPos + 30)
  pdf.text(`Observatory: ${snapshot.security.observatoryGrade}`, margin, yPos + 45)
  
  return Buffer.from(pdf.output('arraybuffer'))
}

export async function POST(request: NextRequest) {
  try {
    const { snapshot }: { snapshot: AnalysisSnapshot } = await request.json()

    if (!snapshot) {
      return NextResponse.json({ error: 'Snapshot é obrigatório' }, { status: 400 })
    }

    const pdfBuffer = generateDemoPDF(snapshot)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="relatorio-beepulse-demo.pdf"',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar PDF demo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}