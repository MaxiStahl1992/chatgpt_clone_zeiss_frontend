import axios from 'axios';
import { getCsrfToken } from '@/lib/utils';

export type Chat = {
  chatId: string;
  chatTitle: string;
};

export type Message = {
  sender: 'user' | 'ai';
  content: string;
  chatId?: string;
};

// Fetch all chats
export const fetchChats = async (): Promise<Chat[]> => {
  const response = await axios.get('http://localhost:8000/api/chats/', {
    withCredentials: true,
  });
  return response.data.chats.map((chat: any) => ({
    chatId: chat.chatId,
    chatTitle: chat.chatTitle,
  }));
};

// Create a new chat
export const createChat = async (): Promise<string> => {
  const csrfToken = getCsrfToken();
  const response = await axios.post(
    'http://localhost:8000/api/create-chat/',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      },
      withCredentials: true,
    }
  );
  return response.data.chat_id;
};

export const sendMessage = async (
  chatId: string,
  message: string,
  model: string,
  temperature: string
): Promise<string> => {
  const csrfToken = getCsrfToken();
  const response = await axios.post(
    'http://localhost:8000/api/generate-response/',
    {
      chat_id: chatId,
      message,
      model,
      temperature,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      },
      withCredentials: true,
    }
  );
  return response.data.content;
};

// Fetch chat history by chat ID
export const fetchChatHistory = async (chatId: string): Promise<Message[]> => {
  const response = await axios.get(
    `http://localhost:8000/api/chat-history/${chatId}/`,
    { withCredentials: true }
  );
  return response.data.messages;
};

// Delete a chat by ID
export const deleteChat = async (chatId: string): Promise<void> => {
  const csrfToken = getCsrfToken();
  await axios.post(
    `http://localhost:8000/api/delete-chat/${chatId}/`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      },
      withCredentials: true,
    }
  );
};