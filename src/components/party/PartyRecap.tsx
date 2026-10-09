import React, { useState } from 'react';
import { PlayerScore, Achievement } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import { useToast } from '../../context/ToastContext';
import { Trophy, Medal, Sparkles, Copy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PartyRecapProps {
  totalRounds: number;
  scores: Record<string, number>;
  unlockedAchievements?: Achievement[];
  onPlayAgain: () => void;
  onHome: () => void;
}

export const PartyRecap: React.FC<PartyRecapProps> = ({
  totalRounds,
  scores,
  unlockedAchievements = [],
  onPlayAgain,
  onHome,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  // Trigger fanfare on mount
  React.useEffect(() => {
    soundEffects.playSuccess();
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FF4DA6', '#A855F7', '#06B6D4', '#F59E0B'],
    });
  }, []);

  const sortedLeaderboard = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const mvp = sortedLeaderboard[0];

  const handleCopySummary = () => {
    soundEffects.playClick();
    let text = `🎉 JINX KISS PARTY RECAP 🎉\n`;
    text += `Played ${totalRounds} rounds of unapologetic chaos!\n\n`;
    if (mvp) {
      text += `👑 Party MVP: ${mvp[0]} (${mvp[1]} pts)\n`;
    }
    text += `\n📊 Final Leaderboard:\n`;
    sortedLeaderboard.forEach(([name, score], idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '▪️';
      text += `${medal} ${name}: ${score} pts\n`;
    });
    text += `\nPlay Jinx Kiss: https://jinxkiss.web.app`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Party summary copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 p-4 animate-scale-in">
      {/* Header */}
      <div className="text-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-brand-pink/20 border border-brand-pink/50 text-pink-300 shadow-neon-pink/30 mb-3 inline-block">
          Party Complete!
        </span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2">
          Party <span className="text-brand-gradient">Recap</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Surviving {totalRounds} intense rounds together. Here are the champions:
        </p>
      </div>

      {/* MVP Highlight Banner */}
      {mvp && (
        <div className="w-full p-6 rounded-3xl glass-panel border border-brand-pink/50 shadow-neon-pink/40 flex items-center gap-4 relative overflow-hidden bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-transparent">
          <div className="w-16 h-16 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink shrink-0 shadow-neon-pink/40">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block">
              Official Party MVP
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white truncate">
              {mvp[0]}
            </h3>
            <span className="text-sm font-bold text-zinc-300">
              Total Score: <span className="text-brand-pink font-black">{mvp[1]} pts</span>
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="w-full rounded-3xl glass-panel border border-white/10 p-6 flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
          Final Scores
        </span>

        {sortedLeaderboard.map(([name, score], index) => {
          let badge = <span className="text-xs text-zinc-500 font-bold">#{index + 1}</span>;
          if (index === 0) badge = <Medal className="w-5 h-5 text-amber-400" />;
          if (index === 1) badge = <Medal className="w-5 h-5 text-slate-300" />;
          if (index === 2) badge = <Medal className="w-5 h-5 text-amber-600" />;

          return (
            <div
              key={name}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                index === 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex justify-center">{badge}</div>
                <span className="font-bold text-sm sm:text-base">{name}</span>
              </div>
              <span className="font-black text-sm sm:text-base text-zinc-100">
                {score} <span className="text-xs text-zinc-400 font-normal">pts</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="w-full rounded-3xl glass-panel border border-purple-500/30 p-6 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Unlocked Achievements
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlockedAchievements.map(ach => (
              <div
                key={ach.id}
                className="p-3.5 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">{ach.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-tight">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          onClick={handleCopySummary}
          className="px-6 py-3.5 rounded-2xl border border-white/20 hover:border-white/40 text-white font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Share Party Summary'}</span>
        </button>

        <button
          onClick={onPlayAgain}
          className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          onClick={onHome}
          className="px-6 py-3.5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white font-semibold text-sm transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
