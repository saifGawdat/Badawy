import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Interceptor to unwrap response envelope { success: true, data: [...] }
api.interceptors.response.use((response) => {
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
    return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export default api;
