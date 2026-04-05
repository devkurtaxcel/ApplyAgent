"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

interface LogEntry {
  id: string;
  title: string;
  subtitle: string;
  status: 'done' | 'pending' | 'active';
}

interface ActivityLogProps {
  logs: LogEntry[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Live Agent Activity</h3>
      <div className="space-y-4">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`flex gap-4 items-start pb-4 border-b border-slate-800/50 last:border-0 last:pb-0 ${log.status === 'pending' ? 'opacity-30 grayscale' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              log.status === 'done' ? 'bg-emerald-500/10' : 
              log.status === 'active' ? 'bg-indigo-500/10' : 'bg-slate-800'
            }`}>
              {log.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {log.status === 'active' && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
              {log.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>}
            </div>
            <div>
              <p className={`text-sm font-medium ${log.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{log.title}</p>
              <p className="text-xs text-slate-500 mt-1">{log.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
