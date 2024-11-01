const Sidebar: React.FC = () => {
    return (
      <div className="bg-primary text-white w-64 h-full p-4">
        <h2 className="text-2xl font-bold mb-6">Chats</h2>
        <ul>
          <li className="mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded">
            Chat 1
          </li>
          <li className="mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded">
            Chat 2
          </li>
          {/* More chat items... */}
        </ul>
      </div>
    );
  };
  
export default Sidebar;