import { ObservatoryResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 12000;
const MAX_POLL_ATTEMPTS = 8;
const POLL_INTERVAL = 1500;

export async function getObservatoryScore(url: string): Promise<APIResponse<ObservatoryResponse>> {
  const hostname = new URL(url).hostname;
  const baseUrl = 'https://http-observatory.security.mozilla.org/api/v1';
  
  try {
    // Start scan
    const startResponse = await fetch(`${baseUrl}/analyze?host=${encodeURIComponent(hostname)}`, {
      method: 'POST',
      headers: {
        'User-Agent': 'BeePulse/1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rescan: false,
        hidden: true
      }),
    });

    if (!startResponse.ok) {
      return {
        success: false,
        error: `Observatory API error: ${startResponse.status} ${startResponse.statusText}`,
      };
    }

    let data = await startResponse.json();
    
    // Poll for results
    let attempts = 0;
    while (data.state === 'RUNNING' && attempts < MAX_POLL_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      
      const pollResponse = await fetch(`${baseUrl}/analyze?host=${encodeURIComponent(hostname)}`, {
        headers: {
          'User-Agent': 'BeePulse/1.0',
        },
      });

      if (!pollResponse.ok) {
        return {
          success: false,
          error: `Observatory API polling error: ${pollResponse.status} ${pollResponse.statusText}`,
        };
      }

      data = await pollResponse.json();
      attempts++;
    }

    if (data.state === 'RUNNING') {
      return {
        success: false,
        error: 'Observatory scan timeout',
      };
    }

    if (data.state === 'FAILED') {
      return {
        success: false,
        error: `Observatory scan failed: ${data.status_code || 'Unknown error'}`,
      };
    }

    // Get response headers
    const headersResponse = await fetch(`${baseUrl}/getScanResults?scan=${data.scan_id}`, {
      headers: {
        'User-Agent': 'BeePulse/1.0',
      },
    });

    let responseHeaders = {};
    if (headersResponse.ok) {
      const headersData = await headersResponse.json();
      responseHeaders = headersData.response_headers || {};
    }

    return {
      success: true,
      data: {
        ...data,
        response_headers: responseHeaders,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `Observatory API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown Observatory API error',
    };
  }
}