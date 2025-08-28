import { SSLLabsResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 25000;
const MAX_POLL_ATTEMPTS = 10;
const POLL_INTERVAL = 2000;

export async function getSSLLabsGrade(url: string): Promise<APIResponse<SSLLabsResponse>> {
  const hostname = new URL(url).hostname;
  const apiUrl = 'https://api.ssllabs.com/api/v3/analyze';
  
  try {
    // Start analysis
    const startResponse = await fetch(`${apiUrl}?host=${encodeURIComponent(hostname)}&startNew=on&all=done`, {
      headers: {
        'User-Agent': 'BeePulse/1.0',
      },
    });

    if (!startResponse.ok) {
      return {
        success: false,
        error: `SSL Labs API error: ${startResponse.status} ${startResponse.statusText}`,
      };
    }

    let data = await startResponse.json();
    
    // Poll for results
    let attempts = 0;
    while (data.status === 'IN_PROGRESS' && attempts < MAX_POLL_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      
      const pollResponse = await fetch(`${apiUrl}?host=${encodeURIComponent(hostname)}`, {
        headers: {
          'User-Agent': 'BeePulse/1.0',
        },
      });

      if (!pollResponse.ok) {
        return {
          success: false,
          error: `SSL Labs API polling error: ${pollResponse.status} ${pollResponse.statusText}`,
        };
      }

      data = await pollResponse.json();
      attempts++;
    }

    if (data.status === 'IN_PROGRESS') {
      return {
        success: false,
        error: 'SSL Labs analysis timeout',
      };
    }

    if (data.status === 'ERROR') {
      return {
        success: false,
        error: `SSL Labs analysis error: ${data.statusMessage || 'Unknown error'}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `SSL Labs API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown SSL Labs API error',
    };
  }
}