import React from 'react';
import { MessageSquarePlus, ThermometerIcon } from 'lucide-react';
import Dropdown from './Dropdown';
import { useFetchOptions } from '@/hooks/useFetchOptions';
import LoadingDots from './utils/LoadingDots';

type TopbarProps = {
  selectedModel: string;
  selectedTemperature: string;
  setSelectedModel: (model: string) => void;
  setSelectedTemperature: (temperature: string) => void;
  handleNewChat: () => void;
};


/**
 * Topbar component for managing chat settings and creating new chat sessions.
 * Includes dropdowns for selecting AI model and temperature, and a button to start a new chat.
 * 
 * Props:
 * - `selectedModel`: Currently selected AI model.
 * - `selectedTemperature`: Currently selected temperature setting.
 * - `setSelectedModel`: Callback to update the selected model.
 * - `setSelectedTemperature`: Callback to update the selected temperature.
 * - `handleNewChat`: Callback to initiate a new chat session.
 * 
 * State:
 * - `availableModels`: Array of available AI models fetched via `useFetchOptions`.
 * - `availableTemperatures`: Array of available temperature settings.
 * - `isLoading`: Loading state for options data, displaying a loading indicator when true.
 */
const Topbar: React.FC<TopbarProps> = ({
  selectedModel,
  selectedTemperature,
  setSelectedModel,
  setSelectedTemperature,
  handleNewChat,
}) => {
  const { availableModels, availableTemperatures, isLoading } = useFetchOptions(
    setSelectedModel,
    setSelectedTemperature
  );

  if (isLoading) {
    return <LoadingDots />;
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
          iconOnly
          icon={
            <ThermometerIcon
              size={24}
              color="#141E8C"
            />
          }
        />
        <button
          className="bg-transparent outline-none hover:outline hover:outline-primary focus:outline focus:outline-2 focus:outline-primary border-none active:scale-95 transition-transform duration-75"
          onClick={handleNewChat}>
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
