import { useState, useEffect } from 'react';
import { checkAuthentication } from '../services/authService';
import { fetchChats, Chat } from '../services/chatService';

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