import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoadingDots from './components/utils/LoadingDots';
import { getCsrfToken } from './lib/utils';

export type Chat = {
  chatId: string;
  chatTitle: string;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedTemperature, setSelectedTemperature] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/check-authentication/',
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      }
    };

    axios.get('http://localhost:8000/api/set-csrf-token/', {
      withCredentials: true,
    });

    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/chats/', {
          withCredentials: true,
        });
        setChats(response.data.chats);
        if (response.data.chats.length > 0) {
          setSelectedChatId(response.data.chats[0].chat_id);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, []);

  const handleNewChat = async () => {
    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post(
        'http://localhost:8000/api/create-chat/',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          },
          withCredentials: true,
        }
      );
      const newChatId = response.data.chat_id;
      setChats((prev) => [...prev, newChatId]);
      setSelectedChatId(newChatId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const csrfToken = getCsrfToken();
      await axios.post(
        `http://localhost:8000/api/delete-chat/${chatId}/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          },
          withCredentials: true,
        }
      );

      setChats((prev) => prev.filter((chat) => chat.chatId !== chatId));

      if (selectedChatId === chatId) {
        const newSelectedChat = chats.find((chat) => chat.chatId !== chatId);
        setSelectedChatId(newSelectedChat ? newSelectedChat.chatId : '');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (isAuthenticated === null) {
    return <LoadingDots />;
  }

  if (!isAuthenticated) {
    window.location.href = 'http://localhost:8000/login/';
    return null;
  }

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        deleteChat={deleteChat}
      />
      <div className="flex flex-col flex-grow max-h-full">
        <Topbar
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
          setSelectedModel={setSelectedModel}
          setSelectedTemperature={setSelectedTemperature}
          handleNewChat={handleNewChat}
        />
        <ChatWindow
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
          selectedChatId={selectedChatId}
          handleNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}

export default App;
