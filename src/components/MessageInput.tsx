import { Send } from 'lucide-react';
import React , { useRef }from 'react';

const MessageInput: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto to allow shrinking
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    }
  };

  return (
    <div className="relative w-auto my-4 mx-4">
      <textarea
      ref={textareaRef}
      onInput={handleInput}
      className="w-full bg-background shadow-lg rounded-3xl max-h-[20vh] overflow-y-auto resize-none border p-4 pr-[65px] outline-none"
      style={{
        height: "auto",
        minHeight: "2rem",
        maxHeight: "20vh",
        overflowWrap: "break-word",
      }}
      placeholder="Type your text here..."
    />
      <button className="absolute right-3 bottom-4 bg-primary text-white p-2 rounded-full outline-none active:scale-95 trainsition-transform duration-75">
        <Send size={24} className='pr-1'/>
      </button>
    </div>
  );
};

export default MessageInput;
