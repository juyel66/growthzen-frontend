const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * Reads the Access Token from sessionStorage safely (SSR-friendly)
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read access token from sessionStorage:', error);
    return null;
  }
};

/**
 * Saves the Access Token to sessionStorage safely
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to save access token to sessionStorage:', error);
  }
};

/**
 * Removes the Access Token from sessionStorage safely
 */
export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove access token from sessionStorage:', error);
  }
};
