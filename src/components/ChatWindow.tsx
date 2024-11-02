import React, { useEffect, useState } from "react";
import WeatherCard from "./cards/WeatherCard";
import StockCard from "./cards//StockCard";
import PromptCard, { PromptCardProps } from "./cards/PromptCard";
import { Sparkles } from "lucide-react";

const examplePrompts: PromptCardProps[] = [
  { title: "Why should we hire Max?", description: "Max is a skilled software engineer with experience in full-stack development. He is passionate about building products that make a positive impact on the world."},
  { title: "What are Max's strengths?", description: "Max is a quick learner, a great communicator, and a team player. He likes AI and programming in Python and Javascript." },
  { title: "Tell me something interesting about Max", description: "Max is a huge fan of Lord of the Rings and has watched every movie at least once a year." },
];

const exampleMessages = [
  // { sender: "ai", text: "Hello! How can I assist you today?" },
  // { sender: "user", text: "Can you tell me the weather?" },
  // { sender: "ai", text: "Sure! The weather today is sunny with a high of 75°F." },
  // { sender: "user", text: "Great, thank you!" },
  // { sender: "ai", text: "You're welcome! Anything else I can help with?" }
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  // Add example messages to state
  const addExampleMessages = () => {
    setMessages(exampleMessages.map(message => `${message.sender}: ${message.text}`));
  };

  useEffect(() => {
    addExampleMessages();
  }, []);

  // Only show the card layout if there are no messages
  if (messages.length === 0) {
    return (
      <div className="flex-grow p-4 overflow-y-scroll grid gap-4">
        <div className="max-h-[70%]">
          {/* Top Row: Weather and Stock Overview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <WeatherCard />
            <StockCard />
          </div>

          {/* Bottom Row: Example Prompts */}
          <div className="grid grid-cols-3 gap-4">
            {examplePrompts.map((examplePrompt, index) => (
              <PromptCard key={index} title={examplePrompt.title} description={examplePrompt.description}  />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render messages if any exist
  return (
    <div className="flex-grow p-4 overflow-y-scroll">
      {messages.map((message, index) => {
      const isAi = message.startsWith("ai:");
      const text = message.replace(/^(ai|user):\s*/, "");

      return (
        <div key={index} className={`mb-4 ${isAi ? "flex flex-row max-w-[80%]" : "rounded-3xl ml-auto max-w-[80%]"}`}>
        {isAi ? (
          <>
          <Sparkles size={28} className="flex-shrink-0 pr-2" color="#141E8C" />
          <p className="text-card-foreground">{text}</p>
          </>
        ) : (
          <p className="bg-card shadow-lg inline-block p-4 rounded-2xl text-card-foreground">{text}</p>
        )}
        </div>
      );
      })}
    </div>
  );
};
  
export default ChatWindow;