import React, { useRef, useState } from 'react';
import WeatherCard from './cards/WeatherCard';
import StockCard from './cards//StockCard';
import PromptCard, { PromptCardProps } from './cards/PromptCard';
import { Send, Sparkles } from 'lucide-react';
import { getCsrfToken } from '@/lib/utils';

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
      'Max is a huge fan of Lord of the Rings and has watched every movie at least once a year.',
  },
];

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user's message to state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: newMessage },
    ]);

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
            model: 'gpt-4o',
            temperature: 0.7,
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

  // Render messages if any exist
  return (
    <div className="flex-grow flex flex-col p-4 h-full">
    {/* Message List */}
    <div className="flex-grow overflow-y-scroll mb-4 max-h-[calc(100vh-190px)]">
      {messages.length === 0 ? (
        <div className="grid gap-4">
          {/* Top Row: Weather and Stock Overview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <WeatherCard />
            <StockCard />
          </div>
          {/* Bottom Row: Example Prompts */}
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
      ) : (
        messages.map((message, index) => {
          const isAi = message.sender === 'ai';
          return (
            <div
              key={index}
              className={`mb-4 w-full flex ${
                isAi ? 'justify-start' : 'justify-end'
              }`}>
              {isAi ? (
                <div className="max-w-[80%] rounded-3xl p-4 flex items-center bg-red-300">
                  <Sparkles
                    size={28}
                    className="flex-shrink-0 pr-2"
                    color="#141E8C"
                  />
                  <p className="text-card-foreground">{message.text}</p>
                </div>
              ) : (
                <div className="max-w-[80%] bg-blue-300 rounded-2xl p-4 shadow-lg">
                  <p className="text-card-foreground">{message.text}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>

    {/* Message Input Area */}
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
        placeholder="Type your text here..."
      />
      <button
        onClick={sendMessage}
        className="absolute right-3 bottom-4 bg-primary text-white p-2 rounded-full outline-none active:scale-95 transition-transform duration-75">
        <Send size={24} className="pr-1" />
      </button>
    </div>
  </div>
  );
};

export default ChatWindow;
