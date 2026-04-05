"use client";

import { ShieldCheck, Share2, Mail, CheckCircle2, LayoutDashboard } from "lucide-react";

export function ConsentCenter() {
  return (
    <div className="space-y-6">
      {/* Interactive Consent & Connection Center */}
      <div className="glass-card rounded-3xl p-6 shadow-xl h-fit relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-24 h-24 text-indigo-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Consent Center</h3>
          </div>
          
          <div className="space-y-4">
            {/* LinkedIn Connection */}
            <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">LinkedIn</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: linkedin</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Linked</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-[10px] font-bold bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors border border-slate-700/50">Verify Scope</button>
                <button className="px-3 py-2 text-[10px] font-bold bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors border border-slate-700/50">Details</button>
              </div>
            </div>

            {/* Gmail Connection */}
            <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Google / Gmail</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: google-oauth2</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Linked</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-[10px] font-bold bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors border border-slate-700/50">Verify Scope</button>
                <button className="px-3 py-2 text-[10px] font-bold bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors border border-slate-700/50">Details</button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Active Permissions</h4>
            <div className="space-y-3">
              {[
                { scope: "openid profile email", desc: "Identity Verification" },
                { scope: "https://www.googleapis.com/auth/gmail.send", desc: "Automated Dispatch" },
                { scope: "w_member_social", desc: "Profile Activity Sync" }
              ].map((p, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400 mt-0.5" />
                  <div>
                    <code className="text-[9px] text-indigo-300 block font-mono">{p.scope}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Stats */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <LayoutDashboard className="w-32 h-32" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Application Health</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Trust Level</p>
            <p className="text-lg font-bold text-emerald-400">98%</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Scopes Active</p>
            <p className="text-lg font-bold text-indigo-400">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
