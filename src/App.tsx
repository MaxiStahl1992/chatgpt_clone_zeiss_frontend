import { useEffect, useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoadingDots from './components/utils/LoadingDots';
import { Chat, createChat, deleteChat, fetchChats } from './services/chatService';
import { checkAuthentication } from './services/authService';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedTemperature, setSelectedTemperature] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const authenticated = await checkAuthentication();
        setIsAuthenticated(authenticated);
        const chatsData = await fetchChats();
        setChats(chatsData);
        if (chatsData.length > 0) {
          setSelectedChatId(chatsData[0].chatId);
        }
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    initialize();
  }, []);

  const handleNewChat = async () => {
    try {
      const newChatId = await createChat();
      setChats((prev) => [...prev, { chatId: newChatId, chatTitle: 'New Chat' }]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
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
        deleteChat={handleDeleteChat}
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
