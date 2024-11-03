import React, { useRef, useState, useEffect, useCallback } from 'react';
import WeatherCard from './cards/WeatherCard';
import PromptCard from './cards/PromptCard';
import { Send } from 'lucide-react';
import { fetchChatHistory, Message, sendMessage } from '@/services/chatService';
import MessageList from './MessageList';
import { examplePrompts } from '@/constants/examplePrompts';
import LoadingDots from './utils/LoadingDots';

type ChatWindowProps = {
  selectedModel: string;
  selectedTemperature: string;
  selectedChatId: string;
  handleNewChat: (initialMessage?: string) => Promise<string | undefined>;
};

/**
 * ChatWindow component that manages the main chat interface, displaying messages,
 * allowing users to send new messages, and handling interactions with predefined prompts.
 * 
 * - `handleSendMessage`: Sends a user's message and retrieves the AI response.
 * - `handlePromptClick`: Sends a predefined prompt as a message or starts a new chat session if none is selected.
 * - `handleNewMessage`: Submits the current user input as a message.
 * - `handleInput`: Adjusts the height of the text area dynamically as the user types.
 * 
 * `useEffect`:
 * - Loads chat history for the selected chat session whenever `selectedChatId` changes.
 * 
 * `useState` variables:
 * - `messages`: Stores the current list of messages in the chat.
 * - `newMessage`: Tracks the user's current input in the text area.
 * - `isLoading`: Indicates if a message is being sent or an AI response is loading.
 */
const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedModel,
  selectedTemperature,
  selectedChatId,
  handleNewChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (selectedChatId) {
        const chatHistory = await fetchChatHistory(selectedChatId);
        setMessages(chatHistory);
      }
    };
    loadChatHistory();
  }, [selectedChatId]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', content },
      ]);

      try {
        const aiResponse = await sendMessage(
          selectedChatId,
          content,
          selectedModel,
          selectedTemperature
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', content: aiResponse },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedChatId, selectedModel, selectedTemperature]
  );

  const handlePromptClick = async (description: string) => {
    if (selectedChatId) {
      await handleSendMessage(description);
    }
  };

  const handleNewMessage = () => {
    if (newMessage.trim() && !isLoading) {
      handleSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="flex-grow flex flex-col p-4 h-full overflow-hidden">
      <div className="flex-grow overflow-y-auto mb-4 max-h-[calc(100vh-190px)]">
        {messages.length === 0 && !isLoading && selectedChatId && (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <WeatherCard />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {examplePrompts.map((prompt, index) => (
                <PromptCard
                  key={index}
                  title={prompt.title}
                  description={prompt.description}
                  onClick={() => handlePromptClick(prompt.description)}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length !== 0 && selectedChatId && (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            selectedChatId={selectedChatId}
            setMessages={setMessages}
          />
        )}
        {isLoading && <LoadingDots />}
      </div>

      <div className="relative mt-auto">
        {selectedChatId ? (
          <>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleNewMessage();
                }
              }}
              className="w-full bg-background shadow-lg rounded-3xl max-h-[20vh] overflow-y-auto resize-none border p-4 pr-[65px] outline-none"
              placeholder="Ask me something..."
            />
            <button
              onClick={handleNewMessage}
              disabled={isLoading}
              className={`absolute right-3 bottom-4 p-2 rounded-full outline-none active:scale-95 transition-transform duration-75 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white'
              }`}>
              <Send size={24} />
            </button>
          </>
        ) : (
          <div className="flex justify-center w-full">
            <button
              className="bg-primary text-primary-foreground outline-none focus:outline-none active:scale-95 transition-transform duration-75"
              onClick={() => handleNewChat()}>
              Start new chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
