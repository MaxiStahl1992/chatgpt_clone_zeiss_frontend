import React, { useRef, useState, useEffect } from 'react';
import WeatherCard from './cards/WeatherCard';
import StockCard from './cards//StockCard';
import PromptCard, { PromptCardProps } from './cards/PromptCard';
import LoadingDots from './utils/LoadingDots';
import { Send, Sparkles } from 'lucide-react';
import { getCsrfToken } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
  text: string;
};

type ChatWindowProps = {
  selectedModel: string;
  selectedTemperature: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedModel,
  selectedTemperature,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageStartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Add user's message to state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: newMessage },
    ]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const csrfToken = getCsrfToken();

      const response = await fetch(
        'http://localhost:8000/api/generate-response/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          },
          credentials: 'include',
          body: JSON.stringify({
            message: newMessage,
            model: selectedModel,
            temperature: selectedTemperature,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Append AI's response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'ai',
          text: "I'm sorry, something went wrong while fetching the response.",
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
                  <div className="max-w-[80%] rounded-3xl p-4 flex items-center">
                    <Sparkles
                      size={28}
                      className="flex-shrink-0 pr-2"
                      color="#141E8C"
                    />
                    <p className="text-card-foreground">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-popover rounded-2xl p-4 shadow-lg">
                    <p className="text-card-foreground">{message.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        {isLoading && <LoadingDots/>}
      </div>

      <div className="relative mt-auto">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onInput={handleInput}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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
      </div>
    </div>
  );
};

export default ChatWindow;
