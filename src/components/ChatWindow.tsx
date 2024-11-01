import { Sparkles } from "lucide-react";

const ChatWindow: React.FC = () => {
    return (
      <div className="flex-grow p-4 overflow-y-scroll m-4">
        {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
          <div className="rounded-3xl mb-4 ml-auto max-w-[80%]">
              <p className="bg-card shadow-lg inline-block p-4 rounded-2xl text-card-foreground">
            Hello!test test test test test test test test test test test test test test test test te test test test test test test test test test test test test test test test test tetest test test test test test test test test test test test test test test test tetest test test test test test test test test test test test test test test test tetest test test test test test test test test test test test test test test test te
              </p>
          </div>
          <div className="mb-4 flex flex-row max-w-[80%]">
              <Sparkles size={28} className="flex-shrink-0 pr-2" color="#141E8C"/>
              <p className="text-card-foreground">Hi there! test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test </p>
          </div>
            </div>
        ))}
      </div>
    );
};
  
export default ChatWindow;