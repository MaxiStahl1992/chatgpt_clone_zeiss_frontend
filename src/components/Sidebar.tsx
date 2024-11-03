import React from 'react';
import { TrashIcon } from 'lucide-react';
import { Chat } from '@/services/chatService';

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
  deleteChat,
}: SidebarProps) => {
  return (
    <div className="bg-primary text-primary-foreground w-[250px] h-full p-4">
      <h2 className="text-2xl font-bold mb-6">ZEISS GPT</h2>
      <ul>
        {chats.map((chat, index) => (
          <li
          key={chat.chatId || `chat-${index}`} // Use chatId, or a fallback with the index for uniqueness
          className={`mb-2 cursor-pointer hover:bg-blue-800 p-2 rounded grid grid-cols-[1fr_auto] w-[200px] overflow-clip ${
            selectedChatId === chat.chatId ? 'bg-blue-800' : ''
          }`}
          onClick={() => setSelectedChatId(chat.chatId)}
        >
          <span>{chat.chatTitle || 'Untitled Chat'}</span>
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
