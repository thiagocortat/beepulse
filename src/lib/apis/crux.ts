import { CrUXResponse, APIResponse } from '@/types/analysis';

const TIMEOUT_MS = 6000;

export async function getCrUXData(url: string, formFactor: 'mobile' | 'desktop'): Promise<APIResponse<CrUXResponse>> {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Google API key not configured',
    };
  }

  const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
  
  const requestBody = {
    url,
    formFactor: formFactor.toUpperCase(),
    metrics: [
      'largest_contentful_paint',
      'cumulative_layout_shift',
      'interaction_to_next_paint',
      'first_contentful_paint',
      'experimental_time_to_first_byte'
    ]
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
      // CrUX API returns 404 when no data is available for the URL
      if (response.status === 404) {
        return {
          success: false,
          error: 'No CrUX data available for this URL',
        };
      }
      return {
        success: false,
        error: `CrUX API error: ${response.status} ${response.statusText}`,
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
          error: 'CrUX API timeout',
        };
      }
      return {
        success: false,
        error: `CrUX API error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Unknown CrUX API error',
    };
  }
}