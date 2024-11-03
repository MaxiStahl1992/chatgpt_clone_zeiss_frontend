import axios from "axios";
import { getCsrfToken } from "@/lib/utils";

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