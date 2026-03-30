"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { LogOut, LayoutDashboard, BrainCircuit, ShieldCheck, Mail, Share2, Play, History, CheckCircle2, AlertCircle, Loader2, Zap, ShieldAlert, X, Lock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
    
    setLogs(prev => [
      ...prev.slice(0, 2),
      { id: '3', title: 'Analysis Started', subtitle: 'Using Google Gemini 2.5 Flash', status: 'active' },
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
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // Handle both raw text and DataStream format (backup)
          const cleanChunk = chunk.replace(/0:\"(.*?)\"/g, '$1').replace(/\\n/g, '\n');
          text += cleanChunk;
          setAnalysisResult(text);
        }
      }

      setLogs(prev => [
        ...prev.slice(0, 3),
        { id: '4', title: 'Analysis Complete', subtitle: 'Strategic requirements extracted.', status: 'done' },
        { id: '5', title: 'Awaiting Action', subtitle: 'Agent ready for secure application.', status: 'pending' }
      ]);
    } catch (err: any) {
      console.error(err);
      const isQuotaError = err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("exhausted");
      
      setLogs(prev => [
        ...prev.slice(0, 2),
        { 
          id: '3', 
          title: isQuotaError ? 'Quota Exceeded' : 'Analysis Failed', 
          subtitle: isQuotaError ? 'Daily limit reached. Please wait 30 seconds.' : 'System error. Please try again.', 
          status: 'active' 
        },
        { id: '4', title: 'Stream Interrupted', subtitle: 'Review usage limits.', status: 'pending' }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Secure Step-up Simulation
  const handleStepUp = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSecureContext(true);
    setIsVerifying(false);
  };

  // Handle Apply
  const handleApply = async () => {
    if (!isSecureContext) {
      setShowConfirm(true);
      return;
    }

    setIsApplying(true);
    setShowConfirm(false);
    
    setLogs(prev => [
      ...prev.slice(0, 4),
      { id: '5', title: 'Securing Authorization', subtitle: 'Invoking Token Vault...', status: 'active' }
    ]);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          company: "Acme Corp", 
          jobId: "123",
          isSecure: true 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLogs(prev => [
          ...prev.slice(0, 5),
          ...data.steps.map((s: any) => ({
            id: s.id,
            title: s.title,
            subtitle: s.detail,
            status: s.status
          })),
          { id: 'success', title: 'Success', subtitle: 'Job Application Dispatched!', status: 'done' }
        ]);
      } else {
        setLogs(prev => [
          ...prev.slice(0, 5),
          { id: 'error', title: 'Authorization Failed', subtitle: data.message || 'Check Token Vault configuration.', status: 'active' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="orb w-[600px] h-[600px] bg-indigo-600/10 -top-48 -left-48" />
      <div className="orb w-[500px] h-[500px] bg-blue-600/10 top-1/2 -right-48" />
      <div className="orb w-[400px] h-[400px] bg-purple-600/10 -bottom-24 left-1/4" />


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
                  disabled={isAnalyzing || isApplying}
                />
                <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex justify-end gap-3">
                  {analysisResult && (
                    <button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
                      Authorized Apply
                    </button>
                  )}
                  <button 
                    onClick={handleAnalyze}
                    disabled={!jobDescription || isAnalyzing || isApplying}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
                    {analysisResult ? "Re-Analyze" : "Analyze & Extract"}
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
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isVerifying && setShowConfirm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSecureContext ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {isSecureContext ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {isSecureContext ? "Ready to Act" : "Authorized Action Required"}
                </h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  You are about to authorize the agent to **Apply to Acme Corp**. This will involve sending a personalized email via Gmail and updating your LinkedIn status.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-400/10 text-red-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Gmail Dispatch</p>
                      <p className="text-xs text-slate-500">Subject: Job Application - {user.name}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">LinkedIn Sync</p>
                      <p className="text-xs text-slate-500">Status Update: Applied to Acme Corp!</p>
                    </div>
                  </div>
                </div>

                {!isSecureContext ? (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-3 items-start">
                      <Lock className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <p className="text-xs text-slate-400 leading-normal">
                        This is a high-stakes action. Please perform a **Secure Context Step-up** to proceed.
                      </p>
                    </div>
                    <button 
                      onClick={handleStepUp}
                      disabled={isVerifying}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                      Verify Secure Context
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    Confirm & Execute
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/50 py-6 text-center">
        <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">
          Powered by Auth0 Token Vault & Google Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
}
