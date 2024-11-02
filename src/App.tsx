import './App.css'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'


function App() {
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
