import { SafeBrowsingResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 3000;

export async function getSafeBrowsingStatus(url: string): Promise<APIResponse<SafeBrowsingResponse>> {
  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Safe Browsing API key not configured',
    };
  }

  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  
  const requestBody = {
    client: {
      clientId: 'beepulse',
      clientVersion: '1.0.0'
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION'
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [
        { url }
      ]
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BeePulse/1.0',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Safe Browsing API error: ${response.status} ${response.statusText}`,
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
          error: 'Safe Browsing API timeout',
        };
      }
      return {
        success: false,
        error: `Safe Browsing API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown Safe Browsing API error',
    };
  }
}