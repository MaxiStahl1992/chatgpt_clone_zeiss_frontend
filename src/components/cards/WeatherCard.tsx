import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to backend
    const fetchWeather = async () => {
      try {
        // const response = await axios.get("/api/weather");
        // setWeather(`${response.data.temperature}°C, ${response.data.condition}`);
        const response = {
          data: { temperature: "22", condition: "Sunny" }
        };
        setWeather(`${response.data.temperature}°C, ${response.data.condition}`);
      } catch (error) {
        setWeather("Unable to fetch weather data");
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-primary font-bold mb-2">Current Weather</h3>
      <p>{weather || "Loading..."}</p>
    </div>
  );
};

export default WeatherCard;