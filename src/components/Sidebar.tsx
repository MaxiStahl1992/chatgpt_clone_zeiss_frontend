import React from 'react';
import { Chat } from '../App';
import { TrashIcon } from 'lucide-react';

type SidebarProps = {
  chats: Chat[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  selectedChatId,
  setSelectedChatId,
  deleteChat
}: SidebarProps) => {
  return (
    <div className="bg-primary text-primary-foreground w-[250px] h-full p-4">
      <h2 className="text-2xl font-bold mb-6">ZEISS GPT</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.chatId}
            className={`mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded grid grid-cols-[1fr_auto] ${
              selectedChatId === chat.chatId ? 'bg-blue-800' : ''
            }`}
            onClick={() => setSelectedChatId(chat.chatId)}>
            <span>{chat.chatTitle}</span>
            <TrashIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.chatId);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
