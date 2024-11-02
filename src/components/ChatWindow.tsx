import React, { useRef, useState, useEffect } from 'react';
import WeatherCard from './cards/WeatherCard';
import StockCard from './cards//StockCard';
import PromptCard, { PromptCardProps } from './cards/PromptCard';
import LoadingDots from './utils/LoadingDots';
import { ClipboardIcon, Send, Sparkles } from 'lucide-react';
import { getCsrfToken } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const examplePrompts: PromptCardProps[] = [
  {
    title: 'Why should we hire Max?',
    description:
      'Max is a skilled software engineer with experience in full-stack development. He is passionate about building products that make a positive impact on the world.',
  },
  {
    title: "What are Max's strengths?",
    description:
      'Max is a quick learner, a great communicator, and a team player. He likes AI and programming in Python and Javascript.',
  },
  {
    title: 'Tell me something interesting about Max',
    description:
      'Max is a huge fan of Lord of the Rings and watches every movie at least once a year.',
  },
];

type Message = {
  sender: 'user' | 'ai';
  content: string;
  chatId?: string;
};

type ChatWindowProps = {
  selectedModel: string;
  selectedTemperature: string;
  selectedChatId: string;
  handleNewChat: () => void;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedModel,
  selectedTemperature,
  selectedChatId,
  handleNewChat,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatId) {
      console.log(selectedChatId);
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/chat-history/${selectedChatId}/`,
            { withCredentials: true }
          );
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      fetchChatHistory();
    }
  }, [selectedChatId]);

  const scrollToBottom = () => {
    messageStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
      });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Add user's message to state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: newMessage },
    ]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const csrfToken = getCsrfToken();

      const response = await axios.post(
        'http://localhost:8000/api/generate-response/',
        {
          chat_id: selectedChatId,
          message: newMessage,
          model: selectedModel,
          temperature: selectedTemperature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.data;

      // Append AI's response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', content: data.content},
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'ai',
          content:
            "I'm sorry, something went wrong while fetching the response.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Render messages if any exist
  return (
    <div className="flex-grow flex flex-col p-4 h-full">
      <div className="flex-grow overflow-y-scroll mb-4 max-h-[calc(100vh-190px)]">
        {messages.length === 0 && !isLoading && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <WeatherCard />
              <StockCard />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {examplePrompts.map((examplePrompt, index) => (
                <PromptCard
                  key={index}
                  title={examplePrompt.title}
                  description={examplePrompt.description}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length != 0 &&
          selectedChatId &&
          messages.map((message, index) => {
            const isAi = message.sender === 'ai';
            return (
              <div
                ref={messageStartRef}
                key={index}
                className={`mb-4 w-full flex ${
                  isAi ? 'justify-start' : 'justify-end'
                }`}>
                {isAi ? (
                  <div className="max-w-[80%] p-4">
                    <div className="pb-1 flex items-center">
                      <Sparkles
                        size={28}
                        className="flex-shrink-0 pr-2"
                        color="#141E8C"
                      />
                      <p className="text-card-foreground">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </p>
                    </div>
                    <div className='flex justify-end'>
                      <ClipboardIcon
                        size={12}
                        className=" text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => copyToClipboard(message.content)}
                      />
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
        {isLoading && <LoadingDots />}
      </div>

      <div className="relative mt-auto">
        {selectedChatId && (
          <>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && sendMessage()
              }
              className="w-full bg-background shadow-lg rounded-3xl max-h-[20vh] overflow-y-auto resize-none border p-4 pr-[65px] outline-none"
              style={{
                height: 'auto',
                minHeight: '2rem',
                maxHeight: '20vh',
                overflowWrap: 'break-word',
              }}
              placeholder="Ask me something..."
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`absolute right-3 bottom-4 p-2 rounded-full outline-none active:scale-95 active:outline-none transition-transform duration-75 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed active:scale-100'
                  : 'bg-primary text-white'
              }`}>
              <Send
                size={24}
                className="pr-1"
              />
            </button>
          </>
        )}
        {!selectedChatId && (
          <div className="flex justify-center w-full">
            <button
              className="bg-primary text-primary-foreground outline-none focus:outline-none active:scale-95 trainsition-transform duration-75"
              onClick={handleNewChat}>
              Start new chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
