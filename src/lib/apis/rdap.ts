import { RDAPResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 5000;

const RDAP_SERVERS = {
  'com': 'https://rdap.verisign.com/com/v1/',
  'net': 'https://rdap.verisign.com/net/v1/',
  'org': 'https://rdap.publicinterestregistry.org/rdap/',
  'info': 'https://rdap.afilias.net/rdap/v1/',
  'biz': 'https://rdap.afilias.net/rdap/v1/',
  'br': 'https://rdap.registro.br/',
  'uk': 'https://rdap.nominet.uk/uk/',
  'de': 'https://rdap.denic.de/',
  'fr': 'https://rdap.nic.fr/',
  'it': 'https://rdap.nic.it/',
  'es': 'https://rdap.nic.es/',
  'nl': 'https://rdap.sidn.nl/',
  'au': 'https://rdap.auda.org.au/',
  'ca': 'https://rdap.cira.ca/rdap/',
  'jp': 'https://rdap.jprs.jp/',
  'cn': 'https://rdap.cnnic.cn/',
};

function getRDAPServer(domain: string): string {
  const tld = domain.split('.').pop()?.toLowerCase();
  if (tld && RDAP_SERVERS[tld as keyof typeof RDAP_SERVERS]) {
    return RDAP_SERVERS[tld as keyof typeof RDAP_SERVERS];
  }
  // Fallback to IANA bootstrap service
  return 'https://rdap.iana.org/';
}

export async function getDomainInfo(url: string): Promise<APIResponse<RDAPResponse>> {
  const hostname = new URL(url).hostname;
  const domain = hostname.replace(/^www\./, '');
  const rdapServer = getRDAPServer(domain);
  const apiUrl = `${rdapServer}domain/${encodeURIComponent(domain)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'BeePulse/1.0',
        'Accept': 'application/rdap+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `RDAP API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'RDAP API timeout',
        };
      }
      return {
        success: false,
        error: `RDAP API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown RDAP API error',
    };
  }
}