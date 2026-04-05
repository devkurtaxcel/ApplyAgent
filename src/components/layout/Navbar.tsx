"use client";

import { BrainCircuit, ShieldCheck, LogOut } from "lucide-react";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  } | null | undefined;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              ApplyAgent
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Secure Context Active</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
              </div>
              {user?.picture ? (
                <img src={user.picture} alt={user?.name || 'User'} className="w-9 h-9 rounded-full border border-slate-700 shadow-lg" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-sm font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
              <a 
                href="/api/auth/logout"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
