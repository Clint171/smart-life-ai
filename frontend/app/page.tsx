"use client";

import { useState } from "react";
import Chat from "@/components/chat";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

type Message = {
  id: string;
  role: string;
  text: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

const initialChats: Chat[] = [
  {
    id: "chat-1",
    title: "Morning routine",
    messages: [
      { id: "m-1", role: "assistant", text: "Hi there! What would you like to plan for your morning routine today?" },
    ],
  },
  {
    id: "chat-2",
    title: "Home energy tips",
    messages: [
      { id: "m-2", role: "assistant", text: "I can help you reduce energy usage with smart thermostats and lighting schedules." },
    ],
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? initialChats[0];

  const updateChat = (updatedChat: Chat) => {
    setChats((current) => current.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
  };

  const handleNewChat = () => {
    const nextId = `chat-${chats.length + 1}`;
    const newChat = {
      id: nextId,
      title: `New chat ${chats.length + 1}`,
      messages: [
        { id: `${nextId}-m-1`, role: "assistant", text: "This is a new chat. Ask me anything about your smart home." },
      ],
    };
    setChats((current) => [newChat, ...current]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
  };

  const handleSendMessage = (message: string) => {
    const newMessage = { id: `${activeChat.id}-m-${activeChat.messages.length + 1}`, role: "user", text: message };
    const replyMessage = {
      id: `${activeChat.id}-m-${activeChat.messages.length + 2}`,
      role: "assistant",
      text: `Great question! Here is a quick mock response to: "${message}"`,
    };
    const updated = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage, replyMessage],
    };
    updateChat(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} chats={chats} activeChatId={activeChatId} onSelectChat={handleChatSelect} onNewChat={handleNewChat} />
        <Chat chat={activeChat} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
