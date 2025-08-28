import { PSIResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 12000;

export async function getPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<APIResponse<PSIResponse>> {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Google API key not configured',
    };
  }

  const apiUrl = new URL('https://www.googleapis.com/pagespeed/v5/runPagespeed');
  apiUrl.searchParams.set('url', url);
  apiUrl.searchParams.set('key', apiKey);
  apiUrl.searchParams.set('strategy', strategy);
  apiUrl.searchParams.set('category', 'performance');
  apiUrl.searchParams.set('category', 'seo');
  apiUrl.searchParams.set('category', 'accessibility');
  apiUrl.searchParams.set('category', 'best-practices');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(apiUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'BeePulse/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `PageSpeed API error: ${response.status} ${response.statusText}`,
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
          error: 'PageSpeed API timeout',
        };
      }
      return {
        success: false,
        error: `PageSpeed API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown PageSpeed API error',
    };
  }
}