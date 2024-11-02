import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:8000/check-authentication/", {
          withCredentials: true, 
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = "http://localhost:8000/login/";
    return null;
  }

  return (
    <div className='flex h-screen w-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow max-h-full'>
      <Topbar />
      <ChatWindow />
      <MessageInput />
      </div>
    </div>
  )
}

export default App
