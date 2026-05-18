type ChatItem = {
  id: string;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  chats: Array<{
    id: string;
    title: string;
  }>;
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
};

export default function Sidebar({ isOpen, onClose, chats, activeChatId, onSelectChat, onNewChat }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-200 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(85vw,280px)] transform overflow-y-auto border-r border-slate-200 bg-slate-50 px-5 py-6 shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-72 lg:shadow-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              History
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Recent chats
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          >
            Close
          </button>
        </div>

        <nav className="mt-6 space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left rounded-2xl border px-4 py-3 text-sm transition hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-slate-800 ${
                chat.id === activeChatId
                  ? "border-blue-500 bg-blue-50 text-slate-900 dark:border-blue-500 dark:bg-slate-800 dark:text-white"
                  : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onNewChat}
          className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          + New chat
        </button>
      </aside>
    </>
  );
}
