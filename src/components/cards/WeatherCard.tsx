import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherCard: React.FC = () => {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch location from the browser
    const fetchLocationAndWeather = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lon = position.coords.longitude.toString();
          setLatitude(lat);
          setLongitude(lon);
          fetchWeather(lat, lon);
        },
        () => {
          setError('Unable to retrieve location');
          setLoading(false);
        }
      );
    };

    const fetchWeather = async (lat: string, lon: string) => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-weather/', {
          params: { latitude: lat, longitude: lon },
          withCredentials: true,
        });
        setWeatherData(response.data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Unable to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold mb-4">Weather Information</h3>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weatherData && !loading && (
        <div className="mt-4">
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Wind Speed: {weatherData.windspeed} m/s</p>
          <p>Wind Direction: {weatherData.winddirection}°</p>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
