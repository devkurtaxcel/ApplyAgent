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
  return (
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
            disabled={!jobDescription || isAnalyzing || isApplying}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
            {analysisResult ? "Re-Analyze" : "Analyze & Extract"}
          </button>
        </div>
      </div>
    </div>
  );
}
