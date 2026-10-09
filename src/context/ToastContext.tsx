import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium flex items-center gap-3 animate-fade-in ${
              toast.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500/40 shadow-neon-red/30'
                : toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-neon-green/30'
                : 'bg-zinc-900/90 text-zinc-100 border-white/10 shadow-black/60'
            }`}
          >
            <span className="text-base">
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✨' : '💬'}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

