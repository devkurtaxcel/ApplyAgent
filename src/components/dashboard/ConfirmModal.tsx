"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, X, Mail, CheckCircle2, ExternalLink, Lock, Loader2, Zap } from "lucide-react";

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  isSecureContext: boolean;
  isVerifying: boolean;
  isApplying: boolean;
  onStepUp: () => void;
  onConfirm: () => void;
  userName?: string | null;
  dispatchResult: { company: string; steps: any[] } | null;
}

export function ConfirmModal({
  show,
  onClose,
  isSecureContext,
  isVerifying,
  isApplying,
  onStepUp,
  onConfirm,
  userName,
  dispatchResult
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isVerifying && onClose()}
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
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {isSecureContext ? "Ready to Act" : "Authorized Action Required"}
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                You are about to authorize the agent to apply to <strong className="text-white">Acme Corp</strong>. This will involve sending a personalized email via Gmail and updating your LinkedIn status.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-400/10 text-red-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Gmail Dispatch</p>
                    <p className="text-xs text-slate-500">Subject: Job Application - {userName}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">LinkedIn Sync</p>
                    <p className="text-xs text-slate-500">Status Update: Applied to Acme Corp!</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                </div>
              </div>

              {!isSecureContext ? (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-3 items-start">
                    <Lock className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-normal">
                      This is a high-stakes action. Please perform a <strong className="text-white">Secure Context Step-up</strong> to proceed.
                    </p>
                  </div>
                  <button 
                    onClick={onStepUp}
                    disabled={isVerifying}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Verify Secure Context
                  </button>
                </div>
              ) : dispatchResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-2"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-emerald-300">Application Dispatched!</h4>
                    <p className="text-xs text-slate-500 mt-1">All tools executed securely via Token Vault</p>
                  </div>
                  <div className="w-full space-y-2 mt-2">
                    {dispatchResult.steps.map((step: any) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white">{step.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={onConfirm}
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
  );
}
