import React from 'react';
import { TrashIcon } from 'lucide-react';
import { Chat } from '@/services/chatService';

type SidebarProps = {
  chats: Chat[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
};

/**
 * Sidebar component for navigating between chat sessions.
 * Displays a list of chats and allows selection or deletion of a chat.
 * 
 * Props:
 * - `chats`: Array of chat objects containing chat ID and title.
 * - `selectedChatId`: ID of the currently selected chat.
 * - `setSelectedChatId`: Callback to update the selected chat.
 * - `deleteChat`: Callback to delete a specific chat.
 * 
 * Methods:
 * - Renders each chat with a clickable title and a delete icon (TrashIcon).
 * - Calls `deleteChat` when the delete icon is clicked.
 */
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
            className="w-4 h-4 ml-2 mt-1 cursor-pointer"
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
