"use client";

import { History, Zap, Play, Loader2 } from "lucide-react";

interface AnalysisInputProps {
  jobDescription: string;
  setJobDescription: (v: string) => void;
  isAnalyzing: boolean;
  isApplying: boolean;
  analysisResult: string;
  onAnalyze: () => void;
  onApply: () => void;
}

export function AnalysisInput({
  jobDescription,
  setJobDescription,
  isAnalyzing,
  isApplying,
  analysisResult,
  onAnalyze,
  onApply
}: AnalysisInputProps) {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 500;

  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${isOverLimit ? 'from-red-500/30 to-rose-500/30' : 'from-indigo-500/20 to-blue-500/20'} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>
      <div className={`relative bg-slate-900 border ${isOverLimit ? 'border-red-500/50 shadow-red-500/20' : 'border-slate-800'} rounded-2xl overflow-hidden shadow-2xl transition-all duration-300`}>
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center relative overflow-hidden">
          {/* Progress Bar Indicator */}
          <div 
            className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${isOverLimit ? 'bg-red-500 w-full' : 'bg-indigo-500'}`} 
            style={{ width: isOverLimit ? '100%' : `${Math.min((wordCount / 500) * 100, 100)}%` }} 
          />
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Description Input</span>
          </div>
          <span className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${isOverLimit ? 'text-red-400 border-red-500/50 bg-red-500/10 animate-pulse' : 'text-slate-500 border-slate-800 bg-slate-900/50'}`}>
            {wordCount} / 500 words
          </span>
        </div>
        {isOverLimit && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-red-500/20 rounded-lg">
                <Zap className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-red-400">Security Limit Exceeded</span>
            </div>
            <span className="text-xs text-red-400/80">Payload must be under 500 words to prevent context window exhaustion.</span>
          </div>
        )}
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
              onClick={onApply}
              disabled={isApplying}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
            >
              {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
              Authorized Apply
            </button>
          )}
          <button 
            onClick={onAnalyze}
            disabled={!jobDescription || isAnalyzing || isApplying || isOverLimit}
            className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all shadow-lg active:scale-95 group ${
              isOverLimit ? 'bg-red-900/50 text-red-300 shadow-none hover:bg-red-900/50' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
            {isOverLimit ? "Limit Exceeded" : analysisResult ? "Re-Analyze" : "Analyze & Extract"}
          </button>
        </div>
      </div>
    </div>
  );
}
