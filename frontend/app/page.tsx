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
    title: "Welcome",
    messages: [
      { id: "m-1", role: "assistant", text: "Hi there! What would you like to talk about today?" },
    ],
  },
  {
    id: "chat-2",
    title: "Ideas",
    messages: [
      { id: "m-2", role: "assistant", text: "I can help with brainstorming, writing, or answering questions." },
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
        { id: `${nextId}-m-1`, role: "assistant", text: "This is a new chat. Ask me anything." },
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

  const handleSendMessage = async (message: string) => {
    // Optimistic user message
    const userMessage = { id: `${activeChat.id}-m-${activeChat.messages.length + 1}`, role: 'user', text: message };
    let updatedChat = { ...activeChat, messages: [...activeChat.messages, userMessage] } as any;
    // mark loading
    updatedChat.__isLoading = true;
    updatedChat.__error = null;
    updateChat(updatedChat);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Model request failed');
      }
      const data = await res.json();
      const assistant = data?.message || data?.assistant || null;
      const assistantText = assistant?.content || assistant?.text || (typeof assistant === 'string' ? assistant : null);
      const assistantMessage = { id: `${activeChat.id}-m-${updatedChat.messages.length + 1}`, role: 'assistant', text: assistantText ?? 'No response' };

      updatedChat = { ...updatedChat, messages: [...updatedChat.messages, assistantMessage] };
      updatedChat.__isLoading = false;
      updatedChat.__error = null;
      updateChat(updatedChat as Chat);
    } catch (error: any) {
      updatedChat.__isLoading = false;
      updatedChat.__error = error?.message || 'Failed to get response';
      // Optionally append an assistant error message
      const errMessage = { id: `${activeChat.id}-m-${updatedChat.messages.length + 1}`, role: 'assistant', text: `Error: ${updatedChat.__error}` };
      updatedChat.messages = [...updatedChat.messages, errMessage];
      updateChat(updatedChat as Chat);
    }
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
