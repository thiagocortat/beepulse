import { DNSRecord, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 2000;

const DOH_PROVIDERS = [
  'https://dns.google/resolve',
  'https://cloudflare-dns.com/dns-query',
];

const CDN_PATTERNS = {
  'cloudflare': ['cloudflare', 'cf-ray'],
  'fastly': ['fastly'],
  'amazon': ['amazon', 'aws', 'cloudfront'],
  'google': ['google', 'goog'],
  'microsoft': ['azure', 'microsoft'],
  'akamai': ['akamai'],
  'maxcdn': ['maxcdn'],
  'keycdn': ['keycdn'],
  'bunnycdn': ['bunnycdn'],
};

interface DNSInfo {
  aRecordsCount: number;
  hasMX: boolean;
  hasNS: boolean;
  inferredCDN?: string;
  dohLatencyMs?: number;
}

export async function getDNSInfo(url: string): Promise<APIResponse<DNSInfo>> {
  const hostname = new URL(url).hostname;
  const domain = hostname.replace(/^www\./, '');
  
  try {
    const startTime = Date.now();
    const results = await Promise.allSettled([
      queryDNS(domain, 'A'),
      queryDNS(domain, 'AAAA'),
      queryDNS(domain, 'MX'),
      queryDNS(domain, 'NS'),
      queryDNS(domain, 'CNAME'),
    ]);
    const endTime = Date.now();
    
    const aRecords = results[0].status === 'fulfilled' ? results[0].value : [];
    const aaaaRecords = results[1].status === 'fulfilled' ? results[1].value : [];
    const mxRecords = results[2].status === 'fulfilled' ? results[2].value : [];
    const nsRecords = results[3].status === 'fulfilled' ? results[3].value : [];
    const cnameRecords = results[4].status === 'fulfilled' ? results[4].value : [];
    
    const allRecords = [...aRecords, ...aaaaRecords, ...cnameRecords];
    const inferredCDN = inferCDN(allRecords);
    
    return {
      success: true,
      data: {
        aRecordsCount: aRecords.length + aaaaRecords.length,
        hasMX: mxRecords.length > 0,
        hasNS: nsRecords.length > 0,
        inferredCDN,
        dohLatencyMs: endTime - startTime,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `DNS API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown DNS API error',
    };
  }
}

async function queryDNS(domain: string, type: string): Promise<DNSRecord[]> {
  const provider = DOH_PROVIDERS[0]; // Use Google DNS as primary
  const apiUrl = `${provider}?name=${encodeURIComponent(domain)}&type=${type}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/dns-json',
        'User-Agent': 'BeePulse/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`DNS query failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Answer || [];
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function inferCDN(records: DNSRecord[]): string | undefined {
  const recordData = records.map(r => r.data?.toLowerCase() || '').join(' ');
  
  for (const [cdnName, patterns] of Object.entries(CDN_PATTERNS)) {
    if (patterns.some(pattern => recordData.includes(pattern))) {
      return cdnName;
    }
  }
  
  return undefined;
}