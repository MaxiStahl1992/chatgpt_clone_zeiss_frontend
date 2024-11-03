import { useState, useEffect } from 'react';
import { checkAuthentication } from '../services/authService';
import { fetchChats, Chat } from '../services/chatService';

/**
 * Custom hook to initialize the app by checking authentication and fetching chat sessions.
 * Sets the initial application state for authentication, chats, and default chat selection.
 * 
 * State:
 * - `isAuthenticated`: Tracks if the user is logged in (boolean or null).
 * - `chats`: Array of available chat sessions.
 * - `selectedChatId`: ID of the initially selected chat session.
 * - `selectedModel`: The AI model selected by default.
 * - `selectedTemperature`: The temperature setting selected by default.
 * 
 * useEffect:
 * - Calls an initialization function to check authentication and fetch chats when the app loads.
 */
export const useInitializeApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedTemperature, setSelectedTemperature] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const fetchedChats = await fetchChats();
        setChats(fetchedChats);
        if (fetchedChats.length > 0) {
          setSelectedChatId(fetchedChats[0].chatId);
        }
      }
    };

    initialize();
  }, []);

  return {
    isAuthenticated,
    chats,
    setChats,
    selectedChatId,
    setSelectedChatId,
    selectedModel,
    setSelectedModel,
    selectedTemperature,
    setSelectedTemperature,
  };
};