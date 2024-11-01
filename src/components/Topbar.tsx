
import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import Dropdown from "./Dropdown";

const availableModels = ["GPT-4o", "GPT-4o-mini"];

const Topbar: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");

    return (
      <div className="flex justify-between items-center px-4 py-2">
        <Dropdown 
          options={availableModels}
          selected={`Current Model: ${selectedModel}`}
          onSelect={setSelectedModel}
        />

        <button 
            className="bg-transparent outline-none hover:outline hover:outline-primary focus:outline focus:outline-2 focus:outline-primary border-none active:scale-95 trainsition-transform duration-75" 
            onMouseUp={(e) => e.currentTarget.blur()}
        >
          <MessageSquarePlus size={32} color="#141E8C" />
        </button>
      </div>
    );
};
  
export default Topbar;