"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { LogOut, LayoutDashboard, BrainCircuit, ShieldCheck, Mail, Linkedin, Play, History, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useChat } from "ai/react";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [logs, setLogs] = useState<{ id: string; title: string; subtitle: string; status: 'done' | 'pending' | 'active' }[]>([
    { id: '1', title: 'Identity Provider Connected', subtitle: 'Authorized via Auth0 (JP-1)', status: 'done' },
    { id: '2', title: 'Session Initialized', subtitle: 'Secure context established', status: 'done' },
    { id: '3', title: 'Waiting for Analysis...', subtitle: 'Ready to process your job description.', status: 'pending' }
  ]);

  // Handle Analysis
  const handleAnalyze = async () => {
    if (!jobDescription) return;

    setIsAnalyzing(true);
    setAnalysisResult("");
    
    // Update Logs
    setLogs(prev => [
      ...prev.slice(0, 2),
      { id: '3', title: 'Analysis Started', subtitle: 'Using Google Gemini 1.5 Flash', status: 'active' },
      { id: '4', title: 'Synthesizing Strategy', subtitle: 'Extracting key requirements...', status: 'pending' }
    ]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      let text = "";
      
      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        // Remove Vercel AI SDK markers if present
        const cleanChunk = chunk.replace(/0:\"(.*?)\"/g, '$1').replace(/\\n/g, '\n');
        text += cleanChunk;
        setAnalysisResult(text);
      }

      setLogs(prev => [
        ...prev.slice(0, 3),
        { id: '4', title: 'Analysis Complete', subtitle: 'Strategic requirements extracted.', status: 'done' },
        { id: '5', title: 'Apply Simulation Ready', subtitle: 'Authorized to Act via Token Vault.', status: 'pending' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  if (!user) {
    redirect("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Nav */}
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
                  <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                </div>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full border border-slate-700 shadow-lg" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-sm font-bold">
                    {user.name?.[0] || 'U'}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Results */}
          <div className="lg:col-span-8 space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-white tracking-tight">Agent Dashboard</h1>
              <p className="text-slate-400 mt-2">Paste a job description below to begin the smart analysis and automated application flow.</p>
            </header>

            {/* Analysis Input */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Description Input</span>
                  </div>
                </div>
                <textarea 
                  className="w-full h-48 bg-slate-950 p-6 text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here..."
                  disabled={isAnalyzing}
                />
                <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex justify-end">
                  <button 
                    onClick={handleAnalyze}
                    disabled={!jobDescription || isAnalyzing}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
                    Analyze & Extract
                  </button>
                </div>
              </div>
            </div>

            {/* Streaming Result Window */}
            {(analysisResult || isAnalyzing) && (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-4 bg-slate-900/50 border-b border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest leading-none">Smart Insight Engine</span>
                  </div>
                </div>
                <div className="p-8 prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {analysisResult || "The agent is thinking..."}
                </div>
              </div>
            )}

            {/* Action Log / Progress */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Live Agent Activity</h3>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className={`flex gap-4 items-start pb-4 border-b border-slate-800/50 last:border-0 last:pb-0 ${log.status === 'pending' ? 'opacity-30 grayscale' : ''}`}>
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
          </div>

          {/* Right Column: Status & Token Vault */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Token Vault Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">Token Vault</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">LinkedIn</p>
                      <p className="text-xs text-emerald-400 font-medium">Connected</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/50 transition-colors cursor-help">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Gmail</p>
                      <p className="text-xs text-emerald-400 font-medium">Authorized</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The agent is operating in <strong>Secure Vault Mode</strong>. All subject tokens are handled server-side and never exposed to the browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Judging Criteria Scorecard / Stats */}
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
                  <p className="text-lg font-bold text-indigo-400">4</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/50 py-6 text-center">
        <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">
          Powered by Auth0 Token Vault & Google Gemini 1.5 Flash
        </p>
      </footer>
    </div>
  );
}
