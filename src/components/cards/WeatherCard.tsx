import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRightCircle, Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { format } from 'date-fns';

const WeatherCard: React.FC = () => {
  const [latitude, setLatitude] = useState<string>('48.1351');
  const [longitude, setLongitude] = useState<string>('11.5820');
  const [locationName, setLocationName] = useState<string>('Munich');
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
          setLocationName('Your Location');
          reverseGeocode(lat, lon);
          fetchWeather(lat, lon);
        },
        () => {
          setError('Unable to retrieve location');
          setLoading(false);
          fetchWeather(latitude, longitude); // Fall back to Munich
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

    const reverseGeocode = async (lat: string, lon: string) => {
      try {
        console.log(lat, lon)
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat,
            lon,
            format: 'json',
          },
        });
        console.log(response)
        setLocationName(response.data.address?.town || 'Your Location');
      } catch (err) {
        console.error('Error fetching location name:', err);
      }
    };

    fetchLocationAndWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    console.log(code)
    if ([0].includes(code)) return <Sun size={40} color="#fbbf24" />; // Clear sky
    if ([1, 2, 3].includes(code)) return <Cloud size={40} color="#9ca3af" />; // Partly cloudy
    if ([45, 48].includes(code)) return <Cloud size={40} color="#6b7280" />; // Fog
    if ([51, 53, 55].includes(code)) return <CloudRain size={40} color="#3b82f6" />; // Drizzle
    if ([61, 63, 65].includes(code)) return <CloudRain size={40} color="#3b82f6" />; // Rain
    if ([71, 73, 75, 77].includes(code)) return <CloudRain size={40} color="#3b82f6" />; // Snow
    if ([80, 81, 82].includes(code)) return <CloudRain size={40} color="#1d4ed8" />; // Rain showers
    if ([95, 96, 99].includes(code)) return <CloudRain size={40} color="#6d28d9" />; // Thunderstorm
    return <Sun size={40} color="#9ca3af" />;
  };

  const getWindDirection = (degrees: number) => {
    if (degrees >= 337.5 || degrees < 22.5) return 'N';
    if (degrees >= 22.5 && degrees < 67.5) return 'NE';
    if (degrees >= 67.5 && degrees < 112.5) return 'E';
    if (degrees >= 112.5 && degrees < 157.5) return 'SE';
    if (degrees >= 157.5 && degrees < 202.5) return 'S';
    if (degrees >= 202.5 && degrees < 247.5) return 'SW';
    if (degrees >= 247.5 && degrees < 292.5) return 'W';
    if (degrees >= 292.5 && degrees < 337.5) return 'NW';
    return ''; // fallback if degrees are invalid
  };

  const today = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold mb-4">Weather Information for {locationName} on {today}</h3>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weatherData && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            {getWeatherIcon(weatherData.weathercode)}
            <p className="ml-2 text-2xl font-bold">{weatherData.temperature}°C</p>
          </div>
          <div className="flex items-center justify-between space-x-4 text-lg">
            <div className="flex items-center space-x-2">
              <Wind size={24} color='#141E8C'/>
              <span>Wind Speed: {weatherData.windspeed} m/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRightCircle
                size={24}
                color='#141E8C'
                style={{ transform: `rotate(${weatherData.winddirection}deg)` }}
              />
              <span>Direction: {getWindDirection(weatherData.winddirection)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
