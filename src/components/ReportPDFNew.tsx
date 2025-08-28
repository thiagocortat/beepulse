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
        
        // Cores BeePulse
        const colors = {
          beeYellow: [255, 210, 0],
          beeBlack: [26, 26, 26],
          white: [255, 255, 255],
          grayLight: [245, 245, 245],
          grayMid: [153, 153, 153],
          success: [0, 166, 80],
          alert: [255, 179, 0],
          attention: [255, 138, 0],
          risk: [229, 57, 53]
        }
        
        // Funções auxiliares
        const getScoreColor = (score: number) => {
          if (score >= 90) return colors.success
          if (score >= 50) return colors.alert
          return colors.risk
        }
        
        const getGradeColor = (grade: string) => {
          if (['A+', 'A'].includes(grade)) return colors.success
          if (grade === 'B') return colors.alert
          if (grade === 'C') return colors.attention
          return colors.risk
        }
        
        const getBadgeColor = (grade: string) => {
          if (['A+', 'A'].includes(grade)) return colors.success
          if (grade === 'B') return colors.alert
          if (grade === 'C') return colors.attention
          return colors.risk
        }
        
        const drawProgressBar = (x: number, y: number, width: number, height: number, value: number, maxValue: number = 100) => {
           // Fundo da barra
           pdf.setFillColor(colors.grayLight[0], colors.grayLight[1], colors.grayLight[2])
           pdf.rect(x, y, width, height, 'F')
           
           // Barra de progresso
           const fillWidth = (value / maxValue) * width
           const barColor = getScoreColor(value)
           pdf.setFillColor(barColor[0], barColor[1], barColor[2])
           pdf.rect(x, y, fillWidth, height, 'F')
         }
         
         const drawBadge = (x: number, y: number, text: string, color: number[], textColor: number[] = colors.white) => {
           const textWidth = pdf.getTextWidth(text)
           const badgeWidth = textWidth + 12
           const badgeHeight = 8
           
           pdf.setFillColor(color[0], color[1], color[2])
           pdf.rect(x, y, badgeWidth, badgeHeight, 'F')
           
           pdf.setTextColor(textColor[0], textColor[1], textColor[2])
           pdf.setFontSize(10)
           pdf.text(text, x + 6, y + 5.5)
         }
         
         const drawCard = (x: number, y: number, width: number, height: number, title: string, content: string) => {
           // Fundo do card
           pdf.setFillColor(colors.grayLight[0], colors.grayLight[1], colors.grayLight[2])
           pdf.rect(x, y, width, height, 'F')
           
           // Título
           pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
           pdf.setFontSize(12)
           pdf.text(title, x + 8, y + 15)
           
           // Conteúdo
           pdf.setFontSize(10)
           pdf.text(content, x + 8, y + 25)
         }
         
         const addHeader = (pageNum: number, totalPages: number) => {
           if (pageNum === 1) return // Sem header na capa
           
           pdf.setFontSize(10)
           pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
           pdf.text(`Relatório BeePulse — ${analysisSnapshot.meta.siteUrl}`, margin, 15)
         }
         
         const addFooter = (pageNum: number, totalPages: number) => {
           pdf.setFontSize(9)
           pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
           const footerText = `BeePulse · Página ${pageNum} de ${totalPages} · ${new Date(analysisSnapshot.meta.analyzedAtISO).toLocaleDateString('pt-BR')}`
           const textWidth = pdf.getTextWidth(footerText)
           pdf.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10)
         }
        
        let pageCount = 1
        
        // PÁGINA 1: CAPA
         // Fundo superior escuro
         pdf.setFillColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
         pdf.rect(0, 0, pageWidth, 80, 'F')
         
         // Título principal
         pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2])
         pdf.setFontSize(28)
         pdf.text('Relatório BeePulse', margin, 35)
         
         pdf.setFontSize(20)
         pdf.text(analysisSnapshot.meta.siteUrl, margin, 50)
         
         pdf.setFontSize(16)
         pdf.text('Diagnóstico de performance digital para hotelaria', margin, 65)
         
         // BeePulse Score em destaque
         const scoreY = 120
         pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
         pdf.setFontSize(48)
         pdf.text(analysisSnapshot.meta.beePulseScore.toString(), margin, scoreY)
         
         pdf.setFontSize(16)
         pdf.text('/100', margin + 40, scoreY)
         
         // Barra de score
         drawProgressBar(margin, scoreY + 10, 120, 8, analysisSnapshot.meta.beePulseScore)
         
         // Data
         pdf.setFontSize(12)
         pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
         pdf.text(`Análise realizada em ${new Date(analysisSnapshot.meta.analyzedAtISO).toLocaleDateString('pt-BR')}`, margin, scoreY + 35)
        
        // PÁGINA 2: RESUMO EXECUTIVO
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        addFooter(pageCount, 7)
        
        let currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Resumo Executivo', margin, currentY)
        currentY += 25
        
        // Cards PSI em grid 2x2
        const cardWidth = (pageWidth - margin * 2 - 10) / 2
        const cardHeight = 35
        
        // Performance
        drawCard(margin, currentY, cardWidth, cardHeight, 'Performance', `${analysisSnapshot.psi.performance}/100`)
        drawProgressBar(margin + 8, currentY + 28, cardWidth - 16, 4, analysisSnapshot.psi.performance)
        
        // SEO
        drawCard(margin + cardWidth + 10, currentY, cardWidth, cardHeight, 'SEO', `${analysisSnapshot.psi.seo}/100`)
        drawProgressBar(margin + cardWidth + 18, currentY + 28, cardWidth - 16, 4, analysisSnapshot.psi.seo)
        
        currentY += cardHeight + 10
        
        // Accessibility
        drawCard(margin, currentY, cardWidth, cardHeight, 'Acessibilidade', `${analysisSnapshot.psi.accessibility}/100`)
        drawProgressBar(margin + 8, currentY + 28, cardWidth - 16, 4, analysisSnapshot.psi.accessibility)
        
        // Best Practices
        drawCard(margin + cardWidth + 10, currentY, cardWidth, cardHeight, 'Boas Práticas', `${analysisSnapshot.psi.bestPractices}/100`)
        drawProgressBar(margin + cardWidth + 18, currentY + 28, cardWidth - 16, 4, analysisSnapshot.psi.bestPractices)
        
        currentY += cardHeight + 20
        
        // Segurança em badges
        pdf.setFontSize(14)
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.text('Segurança', margin, currentY)
        currentY += 15
        
        let badgeX = margin
        
        // Safe Browsing
        const sbColor = analysisSnapshot.security.safeBrowsing === 'OK' ? colors.success : colors.risk
        drawBadge(badgeX, currentY, `Safe Browsing: ${analysisSnapshot.security.safeBrowsing}`, sbColor)
        badgeX += 80
        
        // SSL Grade
        const sslColor = getGradeColor(analysisSnapshot.security.sslLabsGrade)
        drawBadge(badgeX, currentY, `SSL: ${analysisSnapshot.security.sslLabsGrade}`, sslColor)
        badgeX += 50
        
        // Observatory
        const obsColor = getGradeColor(analysisSnapshot.security.observatoryGrade)
        drawBadge(badgeX, currentY, `Observatory: ${analysisSnapshot.security.observatoryGrade}`, obsColor)
        
        currentY += 25
        
        // CrUX Mini-cards
        pdf.setFontSize(14)
        pdf.text('Core Web Vitals (Mobile)', margin, currentY)
        currentY += 15
        
        const miniCardWidth = (pageWidth - margin * 2 - 20) / 3
        
        // LCP
        drawCard(margin, currentY, miniCardWidth, 25, 'LCP', `${analysisSnapshot.crux.mobile.lcp.goodPct}% bons`)
        
        // INP
        drawCard(margin + miniCardWidth + 10, currentY, miniCardWidth, 25, 'INP', `${analysisSnapshot.crux.mobile.inp.goodPct}% bons`)
        
        // CLS
        drawCard(margin + (miniCardWidth + 10) * 2, currentY, miniCardWidth, 25, 'CLS', `${analysisSnapshot.crux.mobile.cls.goodPct}% bons`)
        
        currentY += 35
        
        pdf.setFontSize(10)
        pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
        pdf.text(`Desktop: LCP ${analysisSnapshot.crux.desktop.lcp.goodPct}%, INP ${analysisSnapshot.crux.desktop.inp.goodPct}%, CLS ${analysisSnapshot.crux.desktop.cls.goodPct}%`, margin, currentY)
        
        // PÁGINA 3: LIGHTHOUSE (PSI)
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        
        currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Lighthouse (PageSpeed Insights)', margin, currentY)
        currentY += 25
        
        // Painel 2x2 das categorias
        const psiCategories = [
          { name: 'Performance', score: analysisSnapshot.psi.performance },
          { name: 'SEO', score: analysisSnapshot.psi.seo },
          { name: 'Acessibilidade', score: analysisSnapshot.psi.accessibility },
          { name: 'Boas Práticas', score: analysisSnapshot.psi.bestPractices }
        ]
        
        psiCategories.forEach((category, index) => {
          const col = index % 2
          const row = Math.floor(index / 2)
          const x = margin + col * (cardWidth + 10)
          const y = currentY + row * (cardHeight + 15)
          
          drawCard(x, y, cardWidth, cardHeight, category.name, `${category.score}/100`)
          
          // Barra colorida por estado
           const scoreColor = getScoreColor(category.score)
           pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
           pdf.rect(x + 8, y + 28, cardWidth - 16, 4, 'F')
        })
        
        currentY += (cardHeight + 15) * 2 + 20
        
        // Top 3 oportunidades
        if (analysisSnapshot.psi.topOpportunities && analysisSnapshot.psi.topOpportunities.length > 0) {
          pdf.setFontSize(14)
          pdf.text('Top 3 Oportunidades de Melhoria', margin, currentY)
          currentY += 15
          
          analysisSnapshot.psi.topOpportunities.slice(0, 3).forEach((opportunity, index) => {
            pdf.setFontSize(11)
          pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
            pdf.text(`${index + 1}. ${opportunity}`, margin, currentY)
            currentY += 12
          })
        }
        
        currentY += 20
        
        // Nota metodológica
        pdf.setFontSize(9)
        pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
        const methodNote = 'Dados obtidos via Google PageSpeed Insights API. Scores baseados no Lighthouse v10+.'
        pdf.text(methodNote, margin, currentY)
        
        // PÁGINA 4: CORE WEB VITALS (CrUX)
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        
        currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Core Web Vitals (Chrome UX Report)', margin, currentY)
        currentY += 25
        
        // Duas colunas: Mobile | Desktop
        const colWidth = (pageWidth - margin * 2 - 20) / 2
        
        // Mobile
        pdf.setFontSize(16)
        pdf.text('Mobile', margin, currentY)
        
        // Desktop
        pdf.text('Desktop', margin + colWidth + 20, currentY)
        
        currentY += 20
        
        const metrics = ['lcp', 'inp', 'cls']
        const metricNames = { lcp: 'LCP', inp: 'INP', cls: 'CLS' }
        
        metrics.forEach((metric, index) => {
          const y = currentY + index * 40
          
          // Mobile
          const mobileData = analysisSnapshot.crux.mobile[metric as keyof typeof analysisSnapshot.crux.mobile]
          pdf.setFontSize(12)
          pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
          pdf.text(`${metricNames[metric as keyof typeof metricNames]}`, margin, y)
          
          pdf.setFontSize(10)
          pdf.text(`P75: ${mobileData.p75}${metric === 'cls' ? '' : 'ms'}`, margin, y + 10)
          pdf.text(`${mobileData.goodPct}% bons`, margin, y + 20)
          
          // Barra de progresso mobile
          drawProgressBar(margin, y + 25, colWidth - 10, 6, mobileData.goodPct)
          
          // Desktop
          const desktopData = analysisSnapshot.crux.desktop[metric as keyof typeof analysisSnapshot.crux.desktop]
          pdf.text(`${metricNames[metric as keyof typeof metricNames]}`, margin + colWidth + 20, y)
          pdf.text(`P75: ${desktopData.p75}${metric === 'cls' ? '' : 'ms'}`, margin + colWidth + 20, y + 10)
          pdf.text(`${desktopData.goodPct}% bons`, margin + colWidth + 20, y + 20)
          
          // Barra de progresso desktop
          drawProgressBar(margin + colWidth + 20, y + 25, colWidth - 10, 6, desktopData.goodPct)
        })
        
        // PÁGINA 5: SEGURANÇA & CONFIABILIDADE
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        
        currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Segurança & Confiabilidade', margin, currentY)
        currentY += 25
        
        // Safe Browsing
        pdf.setFontSize(14)
        pdf.text('Safe Browsing', margin, currentY)
        currentY += 15
        
        if (analysisSnapshot.security.safeBrowsing === 'OK') {
           pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2])
           pdf.rect(margin, currentY, 100, 20, 'F')
           pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2])
           pdf.setFontSize(12)
           pdf.text('✓ SEGURO', margin + 30, currentY + 13)
         } else {
           pdf.setFillColor(colors.risk[0], colors.risk[1], colors.risk[2])
           pdf.rect(margin, currentY, 150, 20, 'F')
           pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2])
           pdf.setFontSize(12)
           pdf.text('⚠ ATENÇÃO: Risco detectado', margin + 20, currentY + 13)
         }
        
        currentY += 35
        
        // SSL Labs
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(14)
        pdf.text('SSL Labs', margin, currentY)
        currentY += 15
        
        const sslGradeColor = getGradeColor(analysisSnapshot.security.sslLabsGrade)
        drawBadge(margin, currentY, `Grade: ${analysisSnapshot.security.sslLabsGrade}`, sslGradeColor)
        
        currentY += 25
        
        // Observatory
        pdf.setFontSize(14)
        pdf.text('Mozilla Observatory', margin, currentY)
        currentY += 15
        
        const obsGradeColor = getGradeColor(analysisSnapshot.security.observatoryGrade)
        drawBadge(margin, currentY, `Grade: ${analysisSnapshot.security.observatoryGrade}`, obsGradeColor)
        
        currentY += 25
        
        // Headers ausentes
        if (analysisSnapshot.security.missingHeaders && analysisSnapshot.security.missingHeaders.length > 0) {
          pdf.setFontSize(12)
          pdf.text('Headers de Segurança Ausentes:', margin, currentY)
          currentY += 15
          
          analysisSnapshot.security.missingHeaders.forEach((header, index) => {
            pdf.setFontSize(10)
            pdf.setTextColor(colors.risk[0], colors.risk[1], colors.risk[2])
            pdf.text(`🛡 ${header}`, margin + 10, currentY + index * 12)
          })
        }
        
        // PÁGINA 6: DOMÍNIO & DNS
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        
        currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Domínio & DNS', margin, currentY)
        currentY += 25
        
        // Linha do tempo do domínio
        if (analysisSnapshot.domain.createdAt && analysisSnapshot.domain.expiresAt) {
          pdf.setFontSize(14)
          pdf.text('Histórico do Domínio', margin, currentY)
          currentY += 15
          
          pdf.setFontSize(11)
          pdf.text(`Criado: ${new Date(analysisSnapshot.domain.createdAt).toLocaleDateString('pt-BR')}`, margin, currentY)
          pdf.text(`Idade: ${analysisSnapshot.domain.ageYears} anos`, margin + 80, currentY)
          pdf.text(`Expira: ${new Date(analysisSnapshot.domain.expiresAt).toLocaleDateString('pt-BR')}`, margin + 140, currentY)
          
          currentY += 25
        }
        
        // Cards DNS
        const dnsCardWidth = (pageWidth - margin * 2 - 30) / 4
        
        // MX
        drawCard(margin, currentY, dnsCardWidth, 30, 'MX Records', analysisSnapshot.dns.hasMX ? 'Sim' : 'Não')
        
        // NS
        drawCard(margin + dnsCardWidth + 10, currentY, dnsCardWidth, 30, 'NS Records', analysisSnapshot.dns.hasNS ? 'OK' : 'Erro')
        
        // CDN
        drawCard(margin + (dnsCardWidth + 10) * 2, currentY, dnsCardWidth, 30, 'CDN', analysisSnapshot.dns.inferredCDN || 'N/A')
        
        // Latência DoH
        drawCard(margin + (dnsCardWidth + 10) * 3, currentY, dnsCardWidth, 30, 'Latência DoH', `${analysisSnapshot.dns.dohLatencyMs}ms`)
        
        currentY += 45
        
        // Notas
        pdf.setFontSize(9)
        pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
        pdf.text('Dados obtidos via RDAP/DoH; podem estar em cache por 24h.', margin, currentY)
        
        // PÁGINA 7: APÊNDICE
        pdf.addPage()
        pageCount++
        addHeader(pageCount, 7)
        
        currentY = 40
        
        pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.setFontSize(20)
        pdf.text('Apêndice', margin, currentY)
        currentY += 25
        
        // Tabela de dados técnicos
        pdf.setFontSize(12)
        pdf.text('Dados Técnicos da Análise', margin, currentY)
        currentY += 15
        
        const tableData = [
          ['Campo', 'Valor'],
          ['URL Analisada', analysisSnapshot.meta.siteUrl],
          ['Data da Análise', new Date(analysisSnapshot.meta.analyzedAtISO).toLocaleString('pt-BR')],
          ['BeePulse Score', `${analysisSnapshot.meta.beePulseScore}/100`],
          ['Performance (PSI)', `${analysisSnapshot.psi.performance}/100`],
          ['SEO (PSI)', `${analysisSnapshot.psi.seo}/100`],
          ['Safe Browsing', analysisSnapshot.security.safeBrowsing],
          ['SSL Grade', analysisSnapshot.security.sslLabsGrade],
          ['Observatory Grade', analysisSnapshot.security.observatoryGrade]
        ]
        
        // Cabeçalho da tabela
        pdf.setFillColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
        pdf.rect(margin, currentY, pageWidth - margin * 2, 12, 'F')
        pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2])
        pdf.setFontSize(10)
        pdf.text('Campo', margin + 5, currentY + 8)
        pdf.text('Valor', margin + 80, currentY + 8)
        
        currentY += 12
        
        // Linhas da tabela
        tableData.slice(1).forEach((row, index) => {
          if (index % 2 === 0) {
            pdf.setFillColor(colors.grayLight[0], colors.grayLight[1], colors.grayLight[2])
            pdf.rect(margin, currentY, pageWidth - margin * 2, 10, 'F')
          }
          
          pdf.setTextColor(colors.beeBlack[0], colors.beeBlack[1], colors.beeBlack[2])
          pdf.setFontSize(9)
          pdf.text(row[0], margin + 5, currentY + 7)
          pdf.text(row[1], margin + 80, currentY + 7)
          
          currentY += 10
        })
        
        currentY += 15
        
        // Fontes dos dados
        pdf.setFontSize(11)
        pdf.text('Fontes dos Dados', margin, currentY)
        currentY += 12
        
        const sources = [
          'PageSpeed Insights: Google PageSpeed Insights API v5',
          'Chrome UX Report: Google CrUX API',
          'Safe Browsing: Google Safe Browsing API v4',
          'SSL Labs: Qualys SSL Labs API v3',
          'Observatory: Mozilla HTTP Observatory API v2',
          'RDAP: IANA Bootstrap + Registry APIs',
          'DNS: Google/Cloudflare DNS over HTTPS'
        ]
        
        sources.forEach((source, index) => {
          pdf.setFontSize(9)
          pdf.setTextColor(colors.grayMid[0], colors.grayMid[1], colors.grayMid[2])
          pdf.text(`• ${source}`, margin, currentY + index * 10)
        })
        
        currentY += sources.length * 10 + 15
        
        // Período de cache
        pdf.setFontSize(9)
        pdf.text('Políticas de Cache: Performance/CrUX (12h) • Segurança (24h) • DNS/Domínio (24h)', margin, currentY)
        
        // Adicionar footers em todas as páginas
        const totalPages = pageCount
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          addFooter(i, totalPages)
        }
        
        // Salvar PDF
        const fileName = `beepulse-${hotelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
        pdf.save(fileName)
        
        console.log('✅ PDF multi-página gerado com sucesso!')
        
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