import { useEffect } from 'react';

/**
 * Custom hook to redirect users to the login page if they are not authenticated.
 * 
 * - `isAuthenticated`: A boolean or null indicating if the user is authenticated.
 * 
 * useEffect:
 * - Redirects to the login page if `isAuthenticated` is `false`.
 */
export const useAuthRedirect = (isAuthenticated: boolean | null) => {
  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = 'http://localhost:8000/login/';
    }
  }, [isAuthenticated]);
};
