"use client";

import { useState } from "react";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden"
        >
          <span className="text-xl leading-none">☰</span>
          <span className="sr-only">Open sidebar</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm shadow-blue-500/20">
            AI
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Smart Life</p>
            <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-50">AI Chat</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          <>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
              Sign Up
            </button>
            <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Login
            </button>
          </>
        ) : (
          <button className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
