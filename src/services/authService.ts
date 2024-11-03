import axios from 'axios';

/**
 * Authentication Service
 * 
 * - `checkAuthentication`: Checks if the user is authenticated by calling the backend API.
 *   Returns a boolean indicating authentication status.
 */
export const checkAuthentication = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/check-authentication/',
      { withCredentials: true }
    );
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};