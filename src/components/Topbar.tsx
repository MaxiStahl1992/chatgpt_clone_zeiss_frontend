import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, ThermometerIcon } from 'lucide-react';
import Dropdown from './Dropdown';
import axios from 'axios';

type TopbarProps = {
  selectedModel: string;
  selectedTemperature: string;
  setSelectedModel: (model: string) => void;
  setSelectedTemperature: (temperature: string) => void;
  handleNewChat: () => void;
};

type Options = {
  models: string[];
  temperatures: string[];
}

const Topbar: React.FC<TopbarProps> = ({
  selectedModel,
  selectedTemperature,
  setSelectedModel,
  setSelectedTemperature,
  handleNewChat
}: TopbarProps) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableTemperatures, setAvailableTemperatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-options/', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        const data: Options = response.data;

        setAvailableModels(data.models);
        setAvailableTemperatures(data.temperatures);

        if (!selectedModel && data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
        if (!selectedTemperature && data.temperatures.length > 0) {
          setSelectedTemperature(data.temperatures[1]);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  if (isLoading) {
    return <div>Loading options...</div>;
  }

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <Dropdown
        options={availableModels}
        selected={selectedModel}
        onSelect={setSelectedModel}
      />

      <div className="flex flex-row">
        <Dropdown
          options={availableTemperatures}
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
          onClick={() => handleNewChat()}
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
