

const Sidebar: React.FC = () => {
    return (
      <div className="bg-primary text-primary-foreground min-w-56 h-full p-4">
        <h2 className="text-2xl font-bold mb-6">ZEISS GPT</h2>
        <ul>
          <li className="mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded">
            Chat 1 
          </li>
          <li className="mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded">
            Chat 2
          </li>
        </ul>
      </div>
    );
};
  
export default Sidebar;