import React, { useRef, useEffect } from 'react';
import { ClipboardIcon, RefreshCcw, Sparkles } from 'lucide-react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Message } from '@/services/chatService';
import CodeBlock from './utils/CodeBlock';
import axios from 'axios';
import { getCsrfToken } from '@/lib/utils';

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChatId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

/**
 * MessageList component for displaying a list of chat messages between the user and AI.
 * Supports regenerating the AI response and copying message content to clipboard.
 * 
 * Props:
 * - `messages`: Array of chat messages to display.
 * - `isLoading`: Boolean indicating if an AI response is being generated.
 * - `setIsLoading`: Function to update loading state.
 * - `selectedChatId`: ID of the current chat session.
 * - `setMessages`: Function to update the messages in the chat session.
 * 
 * State:
 * - Uses a `useRef` (messageEndRef) to keep the view scrolled to the latest message.
 * 
 * Methods:
 * - `regenerateResponse`: Regenerates the last AI message for the current chat.
 * - `copyToClipboard`: Copies a message’s content to the clipboard.
 * 
 * useEffect:
 * - Scrolls to the latest message whenever `messages` or `isLoading` changes.
 */
const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  setIsLoading,
  selectedChatId,
  setMessages,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const regenerateResponse = async () => {
    if (!selectedChatId || messages.length === 0) return;

    // Find the last user message
    const lastUserMessageIndex = [...messages]
      .reverse()
      .findIndex((msg) => msg.sender === 'user');

    if (lastUserMessageIndex === -1) return;

    // Remove the last AI message
    const updatedMessages = messages.slice(0, messages.length - 1);
    setMessages(updatedMessages);

    setIsLoading(true);

    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post(
        `http://localhost:8000/api/regenerate-message/${selectedChatId}/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.content) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', content: response.data.content },
        ]);
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      console.error('Error regenerating message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch((err) => console.error('Failed to copy text:', err));
  };

  const components: Components = {
    code: CodeBlock,
  };

  return (
    <>
      {messages.map((message, index) => {
        const isAi = message.sender === 'ai';
        return (
          <div
            key={index}
            className={`mb-4 w-full flex ${isAi ? 'justify-start' : 'justify-end'}`}
          >
            {isAi ? (
              <div className="max-w-[80%] p-4 text-wrap">
                <div className="pb-1 flex">
                  <Sparkles size={28} className="flex-shrink-0 pr-2" color="#141E8C" />
                  <div className="text-card-foreground">
                    <ReactMarkdown components={components}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ClipboardIcon
                    size={12}
                    className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    onClick={() => copyToClipboard(message.content)}
                  />
                  {index === messages.length - 1 && (
                    <RefreshCcw
                      size={12}
                      className="text-gray-500 hover:text-blue-500 cursor-pointer"
                      onClick={regenerateResponse}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-[80%] bg-popover rounded-2xl p-4 shadow-lg">
                <p className="text-card-foreground">{message.content}</p>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </>
  );
};

export default MessageList;