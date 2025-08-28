import { AnalysisSnapshot, Recommendation } from '@/types/analysis';

export function generateRecommendations(snapshot: AnalysisSnapshot): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Checkout performance issues
  if (snapshot.psi.performance < 70) {
    recommendations.push({
      area: 'checkout',
      message: 'Performance baixa pode impactar conversões. Otimize o processo de reserva com checkout mais rápido.',
      omniLink: 'https://omnibees.com/pt/solucoes/bee-direct'
    });
  }
  
  // Mobile experience issues
  const hasPoorMobileCrUX = snapshot.crux.mobile.lcp.goodPct < 50 || 
                           snapshot.crux.mobile.cls.goodPct < 50 || 
                           snapshot.crux.mobile.inp.goodPct < 50;
  
  if (snapshot.psi.accessibility < 80 || hasPoorMobileCrUX) {
    recommendations.push({
      area: 'mobile',
      message: 'Experiência mobile deficiente. Melhore a usabilidade e velocidade para dispositivos móveis.',
      omniLink: 'https://omnibees.com/pt/solucoes/bee-mobile'
    });
  }
  
  // SEO issues
  if (snapshot.psi.seo < 80) {
    recommendations.push({
      area: 'seo',
      message: 'SEO pode ser melhorado para aumentar visibilidade online e atrair mais hóspedes.',
      omniLink: 'https://omnibees.com/pt/solucoes/bee-connect'
    });
  }
  
  // Security issues
  if (snapshot.security.safeBrowsing === 'AT_RISK' || 
      snapshot.security.sslLabsGrade === 'F' || 
      snapshot.security.observatoryGrade === 'F') {
    recommendations.push({
      area: 'seguranca',
      message: 'Problemas de segurança detectados. Implemente HTTPS adequado e headers de segurança.',
      omniLink: 'https://omnibees.com/pt/suporte/boas-praticas-seguranca'
    });
  }
  
  // Missing security headers
  if (snapshot.security.missingHeaders.length > 2) {
    recommendations.push({
      area: 'seguranca',
      message: `Headers de segurança ausentes: ${snapshot.security.missingHeaders.join(', ')}. Configure adequadamente.`,
      omniLink: 'https://omnibees.com/pt/suporte/configuracao-headers'
    });
  }
  
  // DNS/Infrastructure issues
  if (!snapshot.dns.hasMX || !snapshot.dns.hasNS || snapshot.dns.aRecordsCount === 0) {
    recommendations.push({
      area: 'dns',
      message: 'Configuração DNS incompleta. Verifique registros MX, NS e A para melhor confiabilidade.',
      omniLink: 'https://omnibees.com/pt/suporte/configuracao-dns'
    });
  }
  
  // Payment conversion opportunities
  if (snapshot.psi.performance < 80 || snapshot.psi.bestPractices < 80) {
    recommendations.push({
      area: 'checkout',
      message: 'Otimize conversões com métodos de pagamento locais como PIX e checkout simplificado.',
      omniLink: 'https://omnibees.com/pt/solucoes/bee2pay'
    });
  }
  
  // Domain age considerations
  if (snapshot.domain.ageYears && snapshot.domain.ageYears < 1) {
    recommendations.push({
      area: 'seo',
      message: 'Domínio novo detectado. Foque em construir autoridade com conteúdo de qualidade e backlinks.',
      omniLink: 'https://omnibees.com/pt/solucoes/bee-connect'
    });
  }
  
  // CDN recommendations
  if (!snapshot.dns.inferredCDN && snapshot.psi.performance < 70) {
    recommendations.push({
      area: 'mobile',
      message: 'Considere usar CDN para melhorar velocidade de carregamento global do seu site.',
      omniLink: 'https://omnibees.com/pt/suporte/otimizacao-performance'
    });
  }
  
  // Sort by priority and return max 5
  return recommendations
    .sort((a, b) => {
      const priority = { 'checkout': 4, 'seguranca': 3, 'mobile': 2, 'seo': 1, 'dns': 0 };
      return priority[b.area] - priority[a.area];
    })
    .slice(0, 5);
}