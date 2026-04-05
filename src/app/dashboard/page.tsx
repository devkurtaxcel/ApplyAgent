"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Loader2, Send, FileText, CheckCircle2, History, Shield, Zap, Info, Linkedin, Mail, ExternalLink, RefreshCw, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Demo Mode Configuration ---
const DEMO_MODE = false;
const DEMO_USER = {
  name: "Kurt",
  email: "kurt@example.com",
  picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kurt",
};

export default function DashboardPage() {
  const { user: authUser, error, isLoading } = useUser();
  const user = DEMO_MODE ? DEMO_USER : authUser;
  
  // State
  const [jobDescription, setJobDescription] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-redirect if not logged in
  if (!isLoading && !user && !DEMO_MODE) {
    redirect("/api/auth/login");
  }

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeUrl) return;
    
    setIsAnalyzing(true);
    setExecutionLogs(["Initializing Analysis Engine...", "Fetching resume data...", "Parsing job requirements..."]);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        matchScore: 92,
        keySkills: ["React", "TypeScript", "Next.js", "AI Integration"],
        gapAnalysis: "Missing deep experience with Kubernetes; strongly emphasize Auth0 Token Vault expertise.",
        recommendation: "Proceed with highly tailored outreach prioritizing technical depth in identity systems."
      });
      setIsAnalyzing(false);
      setExecutionLogs(prev => [...prev, "Analysis complete. Match score: 92%"]);
    }, 2000);
  };

  const handleApply = async () => {
    setIsExecuting(true);
    setExecutionLogs(prev => [...prev, "Starting Autonomous Application Sequence..."]);
    
    // Simulate multi-step agent flow
    const steps = [
      "Generating tailored cover letter using Gemini 2.0 Flash...",
      "Connecting to Auth0 Token Vault for secure LinkedIn access...",
      "Authenticating with target ATS system...",
      "Submitting application data...",
      "Sending follow-up email via Gmail API (Authorized to Act)...",
      "Application Successful. Tracking ID: AGENT-9912"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExecutionLogs(prev => [...prev, steps[i]]);
    }

    setIsExecuting(false);
    setShowConfetti(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900 dark:text-white" />
        <p className="mt-4 text-zinc-500 font-medium">Securing access...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <Zap className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">ApplyAgent</span>
          <div className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Authorized to Act
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold">{user?.name}</span>
            <span className="text-[10px] text-zinc-500">{user?.email}</span>
          </div>
          <img 
            src={user?.picture || ""} 
            alt="Profile" 
            className="w-10 h-10 rounded-xl ring-2 ring-zinc-200 dark:ring-zinc-800"
          />
          <a 
            href="/api/auth/logout"
            className="p-2 transition-colors hover:text-zinc-500"
            title="Logout"
          >
            <Shield className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" />
                Target Opportunity
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-2">Job Description (URL or Text)</label>
                  <textarea 
                    className="w-full h-32 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-2">Resume URL (PDF/DOCX)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                      placeholder="https://drive.google.com/..."
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                    />
                    <FileText className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jobDescription || !resumeUrl}
                  className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analyze Fit
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Logs Window */}
            <section className="bg-zinc-900 rounded-3xl p-6 shadow-xl border border-zinc-800 font-mono text-sm h-64 flex flex-col">
              <div className="flex items-center justify-between mb-4 text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Agent Status: {isExecuting ? "Executing" : (isAnalyzing ? "Analyzing" : "Idle")}
                </span>
                <span className="text-[10px] uppercase">Session: 0xFF-INIT</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
                {executionLogs.length === 0 && (
                  <span className="text-zinc-600 block">Waiting for user input...</span>
                )}
                {executionLogs.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-zinc-700">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={cn(
                      "flex-1",
                      log.includes("Successful") ? "text-green-400" : (log.includes("Failed") ? "text-red-400" : "text-zinc-400")
                    )}>{log}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Results & Action */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Analysis Result
                      </h2>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-black dark:text-white">{analysisResult.matchScore}</span>
                        <span className="text-sm font-bold text-zinc-500">% FIT</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                        {analysisResult.keySkills.map((skill: string) => (
                          <div key={skill} className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            {skill}
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                        <h3 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          Strategy Insight
                        </h3>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {analysisResult.recommendation}
                        </p>
                      </div>

                      <button 
                        onClick={handleApply}
                        disabled={isExecuting}
                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-zinc-900 to-black dark:from-white dark:to-zinc-100 text-white dark:text-black font-bold text-lg transition-all hover:shadow-xl hover:shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-3"
                      >
                        {isExecuting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Autonomous Application
                          </>
                        )}
                      </button>
                    </div>
                  </section>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2 text-center">
                      <Shield className="w-6 h-6 text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Vault Secure</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2 text-center">
                      <Linkedin className="w-6 h-6 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">OAuth Verified</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2 text-center">
                      <Mail className="w-6 h-6 text-zinc-400 " />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Gmail Linked</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-100/50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ready to Secure the Role?</h3>
                  <p className="text-zinc-500 max-w-sm">Provide a job description and your resume to activate the Agentic Application flow.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
