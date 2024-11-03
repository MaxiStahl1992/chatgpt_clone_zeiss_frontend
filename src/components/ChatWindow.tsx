import React, { useRef, useState, useEffect } from 'react';
import WeatherCard from './cards/WeatherCard';
import StockCard from './cards//StockCard';
import PromptCard, { PromptCardProps } from './cards/PromptCard';
import LoadingDots from './utils/LoadingDots';
import { ClipboardIcon, RefreshCcw, Send, Sparkles } from 'lucide-react';
import { getCsrfToken } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { fetchChatHistory, Message, sendMessage } from '@/services/chatService';

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

type ChatWindowProps = {
  selectedModel: string;
  selectedTemperature: string;
  selectedChatId: string;
  handleNewChat: (initialMessage?: string) => Promise<string | undefined>;
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
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatId) {
      const loadChatHistory = async () => {
        const chatHistory = await fetchChatHistory(selectedChatId);
        setMessages(chatHistory);
      };
      loadChatHistory();
    }
  }, [selectedChatId]);

  const scrollToBottom = () => {
    messageStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptClick = async (description: string) => {
    if (selectedChatId) {
      // Add prompt to the chat and send it
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', content: description }]);
      const aiResponse = await sendMessage(selectedChatId, description, selectedModel, selectedTemperature);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', content: aiResponse }]);
    } else {
      // Create new chat if no chat session exists
      const newChatId = await handleNewChat(description);
      if (newChatId) {
        setMessages([{ sender: 'user', content: description }]);
        const aiResponse = await sendMessage(newChatId, description, selectedModel, selectedTemperature);
        setMessages((prevMessages) => [...prevMessages, { sender: 'ai', content: aiResponse }]);
      }
    }
  };

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

  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await sendMessage(
        selectedChatId as string,
        userMessage,
        selectedModel,
        selectedTemperature
      );
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'ai',
          content: "I'm sorry, something went wrong while fetching the response.",
        },
      ]);
      setError("There was an error generating the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageHandler = async (lastUserMessage?: string) => {
    if (!newMessage.trim() && !lastUserMessage || isLoading) return;

    let userMessage = newMessage;
    if(lastUserMessage) {
      userMessage = lastUserMessage;
    } 

    console.log('Messages:', messages);

    setMessages((prevMessages) => [...prevMessages, { sender: 'user', content: userMessage }]);
    setNewMessage('');
    await fetchAIResponse(userMessage);
  };

  const regenerateResponse = async () => {
    console.log('Regenerating response...');

    const lastUserMessage = messages.reverse().find((msg) => msg.sender === 'user');
    console.log('Last message:', lastUserMessage);

    try {
      console.log('Sending last user message:', lastUserMessage?.content);
      setIsLoading(true);
      sendMessageHandler(lastUserMessage?.content);
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

  return (
    <div className="flex-grow flex flex-col p-4 h-full">
      <div className="flex-grow overflow-y-scroll mb-4 max-h-[calc(100vh-190px)]">
        {messages.length === 0 && !isLoading && selectedChatId && (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <WeatherCard />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {examplePrompts.map((examplePrompt, index) => (
                <PromptCard
                  key={index}
                  title={examplePrompt.title}
                  description={examplePrompt.description}
                  onClick={() => handlePromptClick(examplePrompt.description)}
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
                  <div className="max-w-[80%] p-4 text-wrap">
                    <div className="pb-1 flex items-center">
                      <Sparkles
                        size={28}
                        className="flex-shrink-0 pr-2"
                        color="#141E8C"
                      />
                      <div className="text-card-foreground">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                    <div className='flex justify-end'>
                      <ClipboardIcon
                        size={12}
                        className=" text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => copyToClipboard(message.content)}
                      />
                        {index === messages.length - 1 && (
                        <RefreshCcw 
                          size={12}
                          className=" text-gray-500 hover:text-blue-500 cursor-pointer"
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
                e.key === 'Enter' && !e.shiftKey && sendMessageHandler()
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
              onClick={() => sendMessageHandler()}
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
              onClick={() => handleNewChat('')}>
              Start new chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
