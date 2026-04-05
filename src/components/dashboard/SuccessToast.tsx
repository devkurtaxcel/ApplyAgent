"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export function SuccessToast({ show, onClose }: SuccessToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md"
        >
          <div className="bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 shadow-2xl shadow-emerald-500/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-300">Application Successfully Dispatched!</p>
                <p className="text-xs text-emerald-400/70 mt-1">Your job application to Acme Corp has been sent via Gmail and your LinkedIn profile has been updated.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-emerald-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-emerald-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
