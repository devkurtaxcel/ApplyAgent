"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

// Components
import { Navbar } from "@/components/layout/Navbar";
import { AnalysisInput } from "@/components/dashboard/AnalysisInput";
import { InsightEngine } from "@/components/dashboard/InsightEngine";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { ConsentCenter } from "@/components/dashboard/ConsentCenter";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { SuccessToast } from "@/components/dashboard/SuccessToast";

// ═══════════════════════════════════════════════════════
// DEMO MODE — Toggle this to true for demo/video recording
// ═══════════════════════════════════════════════════════
const DEMO_MODE = true;

const DEMO_USER = {
  name: "Kurt Axcel Peñano",
  email: "auth0@devposthackaton.com",
  picture: "https://ui-avatars.com/api/?name=Kurt+Axcel&background=6366f1&color=fff&size=128&bold=true&font-size=0.4",
  sub: "auth0|demo_64f8a2b1c3d4e5f6",
  nickname: "kurtaxcel",
};

export default function DashboardPage() {
  const { user: authUser, error, isLoading } = useUser();
  const user = DEMO_MODE ? DEMO_USER : authUser;
  
  // State
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ company: string; steps: any[] } | null>(null);
  
  const [logs, setLogs] = useState<{ id: string; title: string; subtitle: string; status: 'done' | 'pending' | 'active' }[]>([
    { id: '1', title: 'Identity Provider Connected', subtitle: 'Authorized via Auth0 (JP-1)', status: 'done' },
    { id: '2', title: 'Session Initialized', subtitle: 'Secure context established', status: 'done' },
    { id: '3', title: 'Waiting for Analysis...', subtitle: 'Ready to process your job description.', status: 'pending' }
  ]);

  // Handlers
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Analysis service unavailable" }));
        setAnalysisResult(`❌ Error: ${errorData.error || "Failed to start analysis"}`);
        setLogs(prev => [
          ...prev.slice(0, 2),
          { id: '3', title: 'Analysis Failed', subtitle: errorData.error || 'Check API connectivity.', status: 'done' as const }
        ]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";
      
      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const matches = chunk.matchAll(/0:"((?:[^"\\]|\\.)*)"/g);
          for (const match of matches) {
            text += match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            setAnalysisResult(text);
          }
        }
      }

      setLogs([
        { id: '1', title: 'Identity Provider Connected', subtitle: 'Authorized via Auth0 (JP-1)', status: 'done' },
        { id: '2', title: 'Session Initialized', subtitle: 'Secure context established', status: 'done' },
        { id: '3', title: 'Analysis Started', subtitle: 'Using Google Gemini 2.5 Flash', status: 'done' },
        { id: '4', title: 'Analysis Complete', subtitle: 'Strategic requirements extracted.', status: 'done' },
        { id: '5', title: 'Awaiting Action', subtitle: 'Agent ready for secure application.', status: 'pending' }
      ]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStepUp = async () => {
    setIsVerifying(true);
    setLogs(prev => [
      ...prev.filter(l => l.id !== '6'),
      { id: '6', title: 'Securing Authorization', subtitle: 'Step-up verification in progress...', status: 'active' }
    ]);
    await new Promise(r => setTimeout(r, 1500));
    setIsSecureContext(true);
    setIsVerifying(false);
    setLogs(prev => prev.map(l => 
      l.id === '6' ? { ...l, title: 'Authorization Verified', subtitle: 'Secure context granted via MFA.', status: 'done' as const } : l
    ));
  };

  const handleApply = async () => {
    if (!isSecureContext) {
      setShowConfirm(true);
      return;
    }

    setIsApplying(true);
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
          ...prev.map(l => l.id === '5' 
            ? { ...l, title: 'Securing Authorization', subtitle: 'Token Vault accessed.', status: 'done' as const } 
            : l
          ),
          ...data.steps.map((s: any) => ({
            id: s.id,
            title: s.title,
            subtitle: s.detail,
            status: 'done' as const
          })),
          { id: 'success', title: 'Application Dispatched', subtitle: 'Job Application successfully sent! 🎉', status: 'done' }
        ]);

        setDispatchResult({ company: 'Acme Corp', steps: data.steps });
        setTimeout(() => {
          setShowConfirm(false);
          setShowSuccessToast(true);
        }, 2500);
        setTimeout(() => setShowSuccessToast(false), 8500);
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

  if (!user && !DEMO_MODE) {
    redirect("/api/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="orb w-[600px] h-[600px] bg-indigo-600/10 -top-48 -left-48" />
      <div className="orb w-[500px] h-[500px] bg-blue-600/10 top-1/2 -right-48" />
      <div className="orb w-[400px] h-[400px] bg-purple-600/10 -bottom-24 left-1/4" />

      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Results */}
          <div className="lg:col-span-8 space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-white tracking-tight">Agent Dashboard</h1>
              <p className="text-slate-400 mt-2">Paste a job description below to begin the smart analysis and automated application flow.</p>
            </header>

            <AnalysisInput 
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              isAnalyzing={isAnalyzing}
              isApplying={isApplying}
              analysisResult={analysisResult}
              onAnalyze={handleAnalyze}
              onApply={() => setShowConfirm(true)}
            />

            <InsightEngine 
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
            />

            <ActivityLog logs={logs} />
          </div>

          {/* Right Column: Status & Token Vault */}
          <div className="lg:col-span-4">
            <ConsentCenter />
          </div>
        </div>
      </main>

      <SuccessToast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} />
      
      <ConfirmModal 
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        isSecureContext={isSecureContext}
        isVerifying={isVerifying}
        isApplying={isApplying}
        onStepUp={handleStepUp}
        onConfirm={handleApply}
        userName={user?.name}
        dispatchResult={dispatchResult}
      />

      <footer className="mt-auto border-t border-slate-800/50 py-6 text-center">
        <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">
          Powered by Auth0 Token Vault & Google Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
}
