import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface AgeConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AgeConfirmationModal: React.FC<AgeConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl shadow-purple-950/50 text-center animate-scale-in">
        
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-neon-violet">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          18+ Age Verification Required
        </h3>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          This category contains explicit, mature, and uncensored adult prompts meant strictly for players aged 18 and older. Are you at least 18 years of age?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition-all"
          >
            Go Back
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-neon-violet transition-all active:scale-95"
          >
            I am 18+
          </button>
        </div>

      </div>
    </div>
  );
};

