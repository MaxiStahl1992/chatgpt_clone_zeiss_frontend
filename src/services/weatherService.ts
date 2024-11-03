import axios from "axios";

/**
 * Weather Service
 * 
 * - `fetchWeather`: Retrieves weather data based on latitude and longitude.
 *   Returns weather information or `null` if the request fails.
 */
export const fetchWeather = async (lat: string, lon: string) => {
    try {
        const response = await axios.get("http://localhost:8000/api/get-weather/", {
        params: { latitude: lat, longitude: lon },
        withCredentials: true,
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching weather data:", err);
        return null;
    }
    }