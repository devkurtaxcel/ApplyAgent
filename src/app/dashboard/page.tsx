"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Loader2, Send, FileText, CheckCircle2, History, Shield, Zap, Info, Link, Mail, ExternalLink, RefreshCw, XCircle } from "lucide-react";
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
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 500;
  
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };
  const isInvalidResumeUrl = resumeUrl.trim() !== "" && !isValidUrl(resumeUrl);
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleReset = () => {
    setJobDescription("");
    setResumeUrl("");
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setIsExecuting(false);
    setExecutionLogs([]);
    setShowConfetti(false);
    setDraftMessage("");
    setIsApproved(false);
    setIsApplied(false);
  };

  // Auto-redirect if not logged in
  if (!isLoading && !user && !DEMO_MODE) {
    redirect("/auth/login");
  }

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeUrl || isInvalidResumeUrl || isOverLimit) return;
    
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
      setDraftMessage(
        `Dear Hiring Manager,\n\nI am thrilled to apply for this role. My expertise in React, TypeScript, and identity systems (specifically Auth0) aligns perfectly with your requirements. I am confident that my background in AI integration will contribute significantly to your team.\n\nLooking forward to speaking with you.\n\nBest regards,\n${user?.name || "Candidate"}`
      );
      setIsApproved(false);
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
    setIsApplied(true);
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
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
            isApplied 
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          )}>
            {isApplied ? "Task Successful" : "Authorized to Act"}
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
            href="/auth/logout"
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
            {!isApplied && (
              <section className={cn("bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border transition-all duration-300", isOverLimit ? "border-red-500/50 shadow-red-500/10" : "border-zinc-200 dark:border-zinc-800")}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-zinc-400" />
                    Target Opportunity
                  </h2>
                  <span className={cn("text-xs font-mono px-2 py-1 rounded border transition-colors", isOverLimit ? "text-red-500 border-red-500/20 bg-red-500/10 animate-pulse" : "text-zinc-500 border-zinc-200 dark:border-zinc-800")}>
                    {wordCount} / 500 words
                  </span>
                </div>
                
                {isOverLimit && (
                  <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-top-2">
                    <Zap className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">Security Limit Exceeded</span>
                      <span className="text-xs text-red-500/80">Payload must be under 500 words to prevent context window exhaustion attacks on the Gemini API.</span>
                    </div>
                  </div>
                )}
                
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
                    <label className="block text-sm font-medium text-zinc-500 mb-2">Resume URL</label>
                    <div className="relative">
                      <input 
                        type="text"
                        className={cn("w-full h-12 pl-12 pr-4 rounded-xl border focus:ring-2 transition-all bg-zinc-50 dark:bg-zinc-950", isInvalidResumeUrl ? "border-red-500 focus:ring-red-500 text-red-500" : "border-zinc-200 dark:border-zinc-800 focus:ring-black dark:focus:ring-white")}
                        placeholder="https://drive.google.com/..."
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                      />
                      <FileText className={cn("absolute left-4 top-3.5 w-5 h-5", isInvalidResumeUrl ? "text-red-400" : "text-zinc-400")} />
                    </div>
                    {isInvalidResumeUrl && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><XCircle className="w-3 h-3" /> Please enter a valid URL</p>}
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobDescription || !resumeUrl || isOverLimit || isInvalidResumeUrl}
                    className={cn(
                      "w-full h-14 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2",
                      (isOverLimit || isInvalidResumeUrl)
                        ? "bg-red-50 dark:bg-red-500/10 text-red-400 cursor-not-allowed border border-red-100 dark:border-red-500/20"
                        : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    )}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        {isOverLimit ? "Payload Limit Exceeded" : isInvalidResumeUrl ? "Invalid Resume URL" : "Analyze Fit"}
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* Success Overlay Portal-like logic */}
            <AnimatePresence>
              {isApplied && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl"
                    onClick={handleReset}
                  />
                  
                  {/* Modal Card */}
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-emerald-500/20 border border-emerald-100 dark:border-emerald-900/40 text-center flex flex-col items-center gap-8 overflow-hidden"
                  >
                    {/* Glowing Aura Effect */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                      </div>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -right-2 -top-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-4 border-white dark:border-zinc-900 shadow-lg"
                      >
                        Authorized
                      </motion.div>
                    </div>

                    <div>
                      <h2 className="text-4xl font-black mb-3 tracking-tighter">Mission Accomplished</h2>
                      <p className="text-zinc-500 font-medium px-4">
                        Your application for this role has been successfully finalized and dispatched via your authorized tokens.
                      </p>
                    </div>

                    <div className="w-full p-4 md:p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-5">
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tracking Code</span>
                        <code className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-lg">AGENT-9912</code>
                      </div>
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Deliver Status</span>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Delivered</span>
                        </div>
                      </div>
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Auth Channel</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">Gmail + LinkedIn API</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 w-full gap-4">
                      <button 
                        onClick={handleReset}
                        className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10 dark:shadow-white/5 flex items-center justify-center gap-3"
                      >
                        <RefreshCw className="w-6 h-6" />
                        Apply for Next Role
                      </button>
                      <button className="w-full h-14 rounded-2xl bg-transparent border-2 border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
                        <History className="w-5 h-5" />
                        Execution History
                      </button>
                    </div>
                  </motion.section>
                </div>
              )}
            </AnimatePresence>

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

                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Application Draft
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400 font-medium">Human in the Loop</span>
                            <RefreshCw className="w-3 h-3 text-zinc-400 animate-spin-slow" />
                          </div>
                        </div>
                        <textarea
                          value={draftMessage}
                          onChange={(e) => setDraftMessage(e.target.value)}
                          className="w-full h-40 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none font-sans"
                          placeholder="Application draft will appear here..."
                        />
                      </div>

                      <div className="flex items-center gap-3 px-1">
                        <button
                          onClick={() => setIsApproved(!isApproved)}
                          className={cn(
                            "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                            isApproved 
                              ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black" 
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                          )}
                        >
                          {isApproved && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                          I have reviewed and <span className="text-black dark:text-white">Authorize to Act</span>
                        </span>
                      </div>

                      <button 
                        onClick={handleApply}
                        disabled={isExecuting || !isApproved}
                        className={cn(
                          "w-full h-16 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
                          isApproved 
                            ? "bg-gradient-to-r from-zinc-900 to-black dark:from-white dark:to-zinc-100 text-white dark:text-black hover:shadow-xl hover:shadow-black/20" 
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
                        )}
                      >
                        {isExecuting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className={cn("w-5 h-5", isApproved ? "text-white dark:text-black" : "text-zinc-400")} />
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
                      <Link className="w-6 h-6 text-blue-500" />
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
