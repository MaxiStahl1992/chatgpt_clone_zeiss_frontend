// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react';

export const useAuthRedirect = (isAuthenticated: boolean | null) => {
  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = 'http://localhost:8000/login/';
    }
  }, [isAuthenticated]);
};
