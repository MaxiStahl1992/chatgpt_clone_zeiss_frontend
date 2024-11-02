import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import ChatWindow from './components/ChatWindow'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTemperature, setSelectedTemperature] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/check-authentication/", {
          withCredentials: true, 
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    fetch("http://localhost:8000/api/set-csrf-token/", {
      credentials: "include",
    });

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = "http://localhost:8000/login/";  // Redirect to backend login
    return null;
  }

  return (
    <div className='flex h-screen w-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow max-h-full'>
        <Topbar 
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
          setSelectedModel={setSelectedModel}
          setSelectedTemperature={setSelectedTemperature}
        />
        <ChatWindow 
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
        />
      </div>
    </div>
  )
}

export default App
