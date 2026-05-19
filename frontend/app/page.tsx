"use client";

import { useEffect, useState } from "react";
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

type ApiMessage = {
  role: string;
  content: string;
};

type ApiChat = {
  id: string;
  title: string;
  messages: ApiMessage[];
};

function normalizeChat(chat: ApiChat): Chat {
  return {
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map((message, index) => ({
      id: `${chat.id}-m-${index + 1}`,
      role: message.role,
      text: message.content,
    })),
  };
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  // Fetch chats on mount
  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch('/api/chats');
        if (res.ok) {
          const data = await res.json();
          const normalizedChats = (data.chats || []).map(normalizeChat);
          setChats(normalizedChats);
          if (normalizedChats.length > 0) {
            setActiveChatId(normalizedChats[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch chats', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChats();
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const updateChat = (updatedChat: Chat) => {
    setChats((current) => current.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
  };

  const handleNewChat = async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    try {
      const res = await fetch('/api/chats', { method: 'POST' });
      if (res.ok) {
        const newChat = await res.json();
        setChats((current) => [normalizeChat(newChat), ...current]);
        setActiveChatId(newChat.id);
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Failed to create chat', error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (deletingChatId) return;
    setDeletingChatId(chatId);
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
      if (res.ok) {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);
        // If deleted chat was active, switch to first remaining chat or null
        if (activeChatId === chatId) {
          setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
        }
      }
    } catch (error) {
      console.error('Failed to delete chat', error);
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeChat) return;

    // Optimistic user message
    const userMessage = { id: `${activeChat.id}-m-${activeChat.messages.length + 1}`, role: 'user', text: message };
    let updatedChat = { ...activeChat, messages: [...activeChat.messages, userMessage] } as any;
    updatedChat.__isLoading = true;
    updatedChat.__error = null;
    updateChat(updatedChat);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chatId: activeChat.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Model request failed');
      }
      const data = await res.json();
      
      // Update chat title if it was generated
      if (data.title && data.title !== activeChat.title) {
        updatedChat.title = data.title;
      }

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
      const errMessage = { id: `${activeChat.id}-m-${updatedChat.messages.length + 1}`, role: 'assistant', text: `Error: ${updatedChat.__error}` };
      updatedChat.messages = [...updatedChat.messages, errMessage];
      updateChat(updatedChat as Chat);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} chats={chats} activeChatId={activeChatId || ''} onSelectChat={handleChatSelect} onNewChat={handleNewChat} onDeleteChat={handleDeleteChat} isCreatingChat={isCreatingChat} deletingChatId={deletingChatId} />
        {activeChat ? (
          <Chat chat={activeChat} onSendMessage={handleSendMessage} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={handleNewChat}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
