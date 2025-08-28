import { AnalysisSnapshot } from '@/types/analysis';

const GRADE_SCORES = {
  'A+': 100,
  'A': 90,
  'A-': 85,
  'B+': 80,
  'B': 75,
  'B-': 70,
  'C+': 65,
  'C': 60,
  'C-': 55,
  'D+': 50,
  'D': 45,
  'D-': 40,
  'E': 30,
  'F': 20,
  'T': 0, // Trust issues
  'M': 0, // Certificate name mismatch
};

export function calculateBeePulseScore(snapshot: AnalysisSnapshot): number {
  const hasCrUXData = !snapshot.notes.missingDataFlags.includes('crux-mobile') && 
                     !snapshot.notes.missingDataFlags.includes('crux-desktop');
  
  let totalScore = 0;
  let maxPossibleScore = 100;
  
  // Base Score (60% or 70% if no CrUX data)
  const baseWeight = hasCrUXData ? 0.6 : 0.7;
  const baseScore = calculateBaseScore(snapshot);
  totalScore += baseScore * baseWeight;
  
  // Real User Experience (25% or 0% if no CrUX data)
  if (hasCrUXData) {
    const cruxScore = calculateCrUXScore(snapshot);
    totalScore += cruxScore * 0.25;
  }
  
  // Security (15%)
  const securityScore = calculateSecurityScore(snapshot);
  totalScore += securityScore * 0.15;
  
  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

function calculateBaseScore(snapshot: AnalysisSnapshot): number {
  const { psi } = snapshot;
  
  // Performance: 35%, SEO: 15%, Best Practices: 5%, Accessibility: 5%
  const performanceWeight = 35 / 60; // 35% of base score
  const seoWeight = 15 / 60; // 15% of base score
  const bestPracticesWeight = 5 / 60; // 5% of base score
  const accessibilityWeight = 5 / 60; // 5% of base score
  
  return (
    psi.performance * performanceWeight +
    psi.seo * seoWeight +
    psi.bestPractices * bestPracticesWeight +
    psi.accessibility * accessibilityWeight
  );
}

function calculateCrUXScore(snapshot: AnalysisSnapshot): number {
  const { crux } = snapshot;
  
  // Average mobile and desktop scores
  const mobileScore = calculateDeviceCrUXScore(crux.mobile);
  const desktopScore = calculateDeviceCrUXScore(crux.desktop);
  
  return (mobileScore + desktopScore) / 2;
}

function calculateDeviceCrUXScore(vitals: any): number {
  const { lcp, cls, inp } = vitals;
  
  // Core Web Vitals: LCP, CLS, INP are the most important
  // If ≥75% "good" in all three, full score; otherwise scale linearly
  const coreVitalsGoodPct = (lcp.goodPct + cls.goodPct + inp.goodPct) / 3;
  
  if (coreVitalsGoodPct >= 75) {
    return 100;
  }
  
  // Linear scaling from 0 to 100 based on percentage of good scores
  return Math.max(0, (coreVitalsGoodPct / 75) * 100);
}

function calculateSecurityScore(snapshot: AnalysisSnapshot): number {
  const { security } = snapshot;
  
  // Hard penalty: Safe Browsing "AT_RISK" zeros this entire block
  if (security.safeBrowsing === 'AT_RISK') {
    return 0;
  }
  
  let securityScore = 0;
  
  // SSL Labs: up to 10 points (out of 15)
  const sslScore = GRADE_SCORES[security.sslLabsGrade as keyof typeof GRADE_SCORES] || 0;
  securityScore += (sslScore / 100) * (10 / 15) * 100;
  
  // Observatory: up to 5 points (out of 15)
  const observatoryScore = GRADE_SCORES[security.observatoryGrade as keyof typeof GRADE_SCORES] || 0;
  securityScore += (observatoryScore / 100) * (5 / 15) * 100;
  
  return Math.min(100, securityScore);
}