import { AppConfig } from './config';

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${AppConfig.API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add Authorization tokens here later if needed
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      // You can trigger a global toast/notification system here
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Call Failed] ${endpoint}:`, error);
    throw error;
  }
}