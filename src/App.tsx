import { useInitializeApp } from '@/hooks/useInitializeApp';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import './App.css';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoadingDots from './components/utils/LoadingDots';
import { createChat, deleteChat } from './services/chatService';
import { useCallback } from 'react';

/**
 * The main application component that sets up global state, authentication, 
 * and layout for the chat application. Initializes app settings, manages 
 * selected chat, model, and temperature, and controls chat creation and deletion.
 * 
 * - `useInitializeApp()`: Custom hook to initialize app state, including authentication, chat list, and settings.
 * - `useAuthRedirect`: Redirects to login if the user is not authenticated.
 * - `handleNewChat`: Initiates a new chat session, adds it to the chat list, and sets it as active.
 * - `handleDeleteChat`: Deletes a specified chat, updates the chat list, and reselects a new chat if necessary.
 * 
 * `useEffect`:
 * - Redirects user if they are not authenticated using `useAuthRedirect`.
 * 
 * `useState` variables managed in `useInitializeApp`:
 * - `isAuthenticated`: Tracks user authentication status.
 * - `chats`: Stores available chat sessions.
 * - `selectedChatId`: Tracks the currently selected chat session.
 * - `selectedModel`: The AI model used for responses.
 * - `selectedTemperature`: Temperature setting for the AI model responses.
 */
function App() {
  const {
    isAuthenticated,
    chats,
    selectedChatId,
    setSelectedChatId,
    setChats,
    selectedModel,
    setSelectedModel,
    selectedTemperature,
    setSelectedTemperature,
  } = useInitializeApp();

  useAuthRedirect(isAuthenticated);

  const handleNewChat = useCallback(async () => {
    try {
      const newChatId = await createChat();
      setChats((prev) => [
        ...prev,
        { chatId: newChatId, chatTitle: 'New Chat' },
      ]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }, [setChats, setSelectedChatId]);

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        await deleteChat(chatId);
        setChats((prev) => prev.filter((chat) => chat.chatId !== chatId));
        if (selectedChatId === chatId) {
          const newSelectedChat = chats.find(
            (chat) => chat.chatId !== chatId
          );
          setSelectedChatId(newSelectedChat ? newSelectedChat.chatId : '');
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    },
    [chats, selectedChatId, setChats, setSelectedChatId]
  );

  if (isAuthenticated === null) {
    return <LoadingDots />;
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
          handleNewChat={handleNewChat}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedTemperature={selectedTemperature}
          setSelectedTemperature={setSelectedTemperature}
        />
        <ChatWindow
          selectedChatId={selectedChatId}
          handleNewChat={handleNewChat}
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
        />
      </div>
    </div>
  );
}

export default App;