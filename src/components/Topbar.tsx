import React, { useState } from 'react';
import { MessageSquarePlus, ThermometerIcon } from 'lucide-react';
import Dropdown from './Dropdown';

const availableModels = ['GPT-4o', 'GPT-4o-mini'];
const availableTemperature = ['0.2', '0.7', '0.9'];

const Topbar: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [selectedTemperature, setSelectedTemperature] = useState('0.9');

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <Dropdown
        options={availableModels}
        selected={selectedModel}
        onSelect={setSelectedModel}
      />

      <div className="flex flex-row">
        <Dropdown
          options={availableTemperature}
          selected={selectedTemperature}
          onSelect={setSelectedTemperature}
          iconOnly={true}
          icon={
            <ThermometerIcon
              size={24}
              color="#141E8C"
            />
          }></Dropdown>
        <button
          className="bg-transparent outline-none hover:outline hover:outline-primary focus:outline focus:outline-2 focus:outline-primary border-none active:scale-95 trainsition-transform duration-75"
          onMouseUp={(e) => e.currentTarget.blur()}>
          <MessageSquarePlus
            size={24}
            color="#141E8C"
          />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
