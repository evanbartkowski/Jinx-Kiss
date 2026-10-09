import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
import { ArrowRight, Wine, Coffee, Sparkles, MessageCircleQuestion } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruthOrSipGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const TruthOrSipGame: React.FC<TruthOrSipGameProps> = ({ prompts, players }) => {
  const { isNonAlcoholic, selectedCategory } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [choice, setChoice] = useState<'answer' | 'sip' | null>(null);

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;
  const currentPrompt = prompts[currentIndex] || prompts[0];

  const isKids = selectedCategory === 'kids';
  const penaltyLabel = isKids ? 'Do the Forfeit 🍪' : isNonAlcoholic ? 'Take a Sip of Soda/Tea ☕' : 'Take a Sip 🍹';

  const handleChoice = (selected: 'answer' | 'sip') => {
    setChoice(selected);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: selected === 'answer' ? ['#F59E0B', '#D97706'] : ['#EC4899', '#A855F7'],
    });
  };

  const nextCard = () => {
    setChoice(null);
    setCurrentIndex(prev => (prev + 1) % prompts.length);
    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Turn indicator */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Active Confessor</span>
          <h3 className="text-2xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            {activePlayer}
          </h3>
        </div>
      )}

      {/* Main Golden Amber Card */}
      <div className="w-full min-h-[300px] p-8 sm:p-12 rounded-3xl glass-panel border border-amber-500/40 shadow-neon-amber/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
        
        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-950/60 border border-amber-500/50 text-amber-300 shadow-neon-amber/20">
            {isKids ? 'Truth or Snack' : 'Truth or Sip'}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            Card #{currentIndex + 1}
          </span>
        </div>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Choice indicator */}
        {choice && (
          <div className="animate-fade-in text-sm font-bold">
            {choice === 'answer' ? (
              <span className="text-amber-300 bg-amber-950/80 border border-amber-500/50 px-4 py-1.5 rounded-full shadow-neon-amber">
                🗣️ Chose to Confess the Truth!
              </span>
            ) : (
              <span className="text-pink-300 bg-pink-950/80 border border-pink-500/50 px-4 py-1.5 rounded-full shadow-neon-pink">
                🍹 Took the Sip & Kept the Secret!
              </span>
            )}
          </div>
        )}

        <div className="text-xs text-zinc-400 font-medium">
          Answer 100% truthfully or take the sip penalty.
        </div>

      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button
          onClick={() => handleChoice('answer')}
          disabled={!!choice}
          className={`flex-1 min-w-[140px] max-w-[200px] py-4 rounded-2xl border font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            choice === 'answer'
              ? 'bg-amber-600 border-amber-400 text-white shadow-neon-amber scale-105'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500 hover:shadow-neon-amber'
          }`}
        >
          <MessageCircleQuestion className="w-5 h-5" />
          <span>I'll Answer</span>
        </button>

        <button
          onClick={() => handleChoice('sip')}
          disabled={!!choice}
          className={`flex-1 min-w-[140px] max-w-[220px] py-4 rounded-2xl border font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            choice === 'sip'
              ? 'bg-pink-600 border-pink-400 text-white shadow-neon-pink scale-105'
              : 'bg-pink-950/40 border-pink-500/40 text-pink-300 hover:bg-pink-900/60 hover:border-pink-500 hover:shadow-neon-pink'
          }`}
        >
          {isNonAlcoholic ? <Coffee className="w-5 h-5" /> : <Wine className="w-5 h-5" />}
          <span>{penaltyLabel}</span>
        </button>

        {choice && (
          <button
            onClick={nextCard}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-sm shadow-neon-amber flex items-center gap-2 transition-all active:scale-95 animate-scale-in"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};

