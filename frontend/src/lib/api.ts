import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to unwrap response envelope { success: true, data: [...] }
api.interceptors.response.use((response) => {
  // Check if response.data follows the standard our refactored backend uses
  if (
    response.data &&
    typeof response.data === 'object' &&
    response.data.success === true &&
    response.data.data !== undefined
  ) {
    return { ...response, data: response.data.data };
  }
  return response;
});

/**
 * Extracts a user-friendly error message from an Axios error response.
 */
export const getErrorMessage = (error: unknown, fallback: string = 'An unexpected error occurred'): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export default api;
