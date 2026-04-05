"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrainCircuit, Loader2 } from "lucide-react";

interface InsightEngineProps {
  analysisResult: string;
  isAnalyzing: boolean;
}

export function InsightEngine({ analysisResult, isAnalyzing }: InsightEngineProps) {
  if (!analysisResult && !isAnalyzing) return null;

  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-4 bg-slate-900/50 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <BrainCircuit className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest leading-none">Smart Insight Engine</span>
        </div>
      </div>
      <div className="p-6 sm:p-8 max-w-none font-sans text-sm leading-relaxed">
        {analysisResult ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-indigo-300 mt-6 mb-3 pb-2 border-b border-slate-700/50 flex items-center gap-2 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-sky-300 mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 mb-3 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 mb-4 ml-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 mb-4 ml-1 list-decimal list-inside">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 mt-1.5 flex-shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              hr: () => (
                <hr className="border-slate-700/50 my-4" />
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-indigo-300 text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {analysisResult}
          </ReactMarkdown>
        ) : (
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>The agent is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}
