// src/hooks/useFetchOptions.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

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