import React from 'react';

export function RemovedPrompt({ onNext }: { onNext: () => void }) {
  return (
    <div role="status" className="p-8 rounded-3xl glass-panel text-center space-y-4">
      <p className="text-zinc-300">This card was removed or moved to another category.</p>
      <button onClick={onNext} className="px-5 py-3 rounded-xl bg-brand-pink text-white font-bold">
        Next card
      </button>
    </div>
  );
}
