import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch available models and temperature options from the API.
 * Sets the initial model and temperature for the chat settings.
 * 
 * Parameters:
 * - `setSelectedModel`: Callback to set the initially selected model.
 * - `setSelectedTemperature`: Callback to set the initially selected temperature.
 * 
 * State:
 * - `availableModels`: Array of available AI models.
 * - `availableTemperatures`: Array of temperature options.
 * - `isLoading`: Boolean indicating if the options are being loaded.
 * 
 * useEffect:
 * - Fetches model and temperature options when the component mounts.
 */
export const useFetchOptions = (
  setSelectedModel: (model: string) => void,
  setSelectedTemperature: (temperature: string) => void
) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableTemperatures, setAvailableTemperatures] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/get-options/',
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        setAvailableModels(data.models);
        setAvailableTemperatures(data.temperatures);

        if (data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
        if (data.temperatures.length > 0) {
          setSelectedTemperature(data.temperatures[1]);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [setSelectedModel, setSelectedTemperature]);

  return { availableModels, availableTemperatures, isLoading };
};