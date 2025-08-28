export interface AnalysisSnapshot {
  meta: {
    siteUrl: string;
    analyzedAtISO: string;
    beePulseScore: number;
  };
  psi: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
    topOpportunities: Opportunity[];
  };
  crux: {
    mobile: CoreWebVitals;
    desktop: CoreWebVitals;
  };
  security: {
    safeBrowsing: 'OK' | 'AT_RISK';
    sslLabsGrade: string;
    observatoryGrade: string;
    missingHeaders: string[];
  };
  domain: {
    registrar?: string;
    createdAt?: string;
    expiresAt?: string;
    ageYears?: number;
  };
  dns: {
    aRecordsCount: number;
    hasMX: boolean;
    hasNS: boolean;
    inferredCDN?: string;
    dohLatencyMs?: number;
  };
  notes: {
    missingDataFlags: string[];
    sourceErrors: string[];
  };
  recommendations: Recommendation[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'seo' | 'accessibility' | 'best-practices';
  impact: 'high' | 'medium' | 'low';
  savings?: {
    ms?: number;
    bytes?: number;
  };
}

export interface CoreWebVitals {
  lcp: {
    p75: number;
    goodPct: number;
  };
  cls: {
    p75: number;
    goodPct: number;
  };
  inp: {
    p75: number;
    goodPct: number;
  };
  fcp: {
    p75: number;
    goodPct: number;
  };
  ttfb: {
    p75: number;
    goodPct: number;
  };
}

export interface Recommendation {
  area: 'checkout' | 'mobile' | 'seo' | 'seguranca' | 'dns';
  message: string;
  omniLink: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface PSIResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      seo: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
    };
    audits: Record<string, {
      id: string;
      title: string;
      description: string;
      score?: number;
      numericValue?: number;
      details?: any;
    }>;
  };
}

export interface CrUXResponse {
  record: {
    metrics: {
      largest_contentful_paint: MetricData;
      cumulative_layout_shift: MetricData;
      interaction_to_next_paint: MetricData;
      first_contentful_paint: MetricData;
      experimental_time_to_first_byte: MetricData;
    };
  };
}

export interface MetricData {
  percentiles: {
    p75: number;
  };
  histogram: Array<{
    start: number;
    end?: number;
    density: number;
  }>;
}

export interface SafeBrowsingResponse {
  matches?: Array<{
    threatType: string;
    platformType: string;
    threat: {
      url: string;
    };
  }>;
}

export interface SSLLabsResponse {
  status: string;
  grade?: string;
  gradeTrustIgnored?: string;
  hasWarnings: boolean;
  isExceptional: boolean;
  endpoints?: Array<{
    grade: string;
    gradeTrustIgnored: string;
    hasWarnings: boolean;
    isExceptional: boolean;
  }>;
}

export interface ObservatoryResponse {
  grade: string;
  score: number;
  tests_passed: number;
  tests_failed: number;
  tests_quantity: number;
  response_headers: Record<string, string>;
}

export interface RDAPResponse {
  events?: Array<{
    eventAction: string;
    eventDate: string;
  }>;
  entities?: Array<{
    handle: string;
    vcardArray?: Array<any>;
  }>;
}

export interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}