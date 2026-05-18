"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: string;
  text: string;
};

type ChatProps = {
  chat: {
    id: string;
    title: string;
    messages: Message[];
  };
  onSendMessage: (message: string) => void;
};

export default function Chat({ chat, onSendMessage }: ChatProps) {
  const [draft, setDraft] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [chat.messages]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft("");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] overflow-hidden px-4 pb-6 pt-4 sm:px-6 lg:px-0">
      <main className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-3xl border p-5 shadow-sm ${
                message.role === "user"
                  ? "border-blue-200 bg-blue-50 text-slate-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-slate-100"
                  : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              <p className="text-sm font-semibold capitalize">
                {message.role === "assistant" ? "Assistant" : message.role === "user" ? "You" : message.role}
              </p>
              <p className="mt-3 text-sm leading-7">{message.text}</p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900 flex-none">
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <input
              id="chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              type="text"
              placeholder="Type your message here..."
              className="flex-1 min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
