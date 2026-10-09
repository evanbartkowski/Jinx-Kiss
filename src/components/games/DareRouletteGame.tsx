import React, { useState, useEffect, useRef } from 'react';
import { PromptItem } from '../../types/game';
import { Disc3, RotateCcw, ArrowRight, UserCheck, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DareRouletteGameProps {
  prompts: PromptItem[];
  players: string[];
  onOpenPlayerModal?: () => void;
}

export const DareRouletteGame: React.FC<DareRouletteGameProps> = ({
  prompts,
  players,
  onOpenPlayerModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePlayers, setActivePlayers] = useState<string[]>(
    players.length >= 2 ? players : ['Sam', 'Alex', 'Jordan', 'Taylor']
  );
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [currentDare, setCurrentDare] = useState<PromptItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Sync when parent players change
  useEffect(() => {
    if (players.length >= 2) {
      setActivePlayers(players);
    }
  }, [players]);

  const wheelColors = [
    '#EF4444', '#FF4DA6', '#A855F7', '#06B6D4',
    '#F59E0B', '#10B981', '#3B82F6', '#EC4899'
  ];

  // Draw the roulette wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12;
    const count = activePlayers.length;
    const arc = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, size, size);

    // Save and rotate according to current angle
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotationAngle);
    ctx.translate(-center, -center);

    // Draw wheel segments
    activePlayers.forEach((player, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = wheelColors[i % wheelColors.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + arc);
      ctx.lineTo(center, center);
      ctx.fill();

      // Border between segments
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text inside segment
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(player, radius - 20, 5);
      ctx.restore();
    });

    // Center glowing hub
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#09090D';
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }, [activePlayers, rotationAngle]);

  const spinWheel = () => {
    if (isSpinning || activePlayers.length < 2) return;
    setIsSpinning(true);
    setSelectedPlayer(null);
    setCurrentDare(null);

    // Pick winning index fairly
    const winnerIndex = Math.floor(Math.random() * activePlayers.length);
    const count = activePlayers.length;
    const arc = (Math.PI * 2) / count;

    // Pointer is at the top (angle = 3*PI/2)
    // To land winner at the top, rotation must satisfy: (winnerIndex * arc + arc/2 + rotation) % 2PI = 3PI/2
    const targetSectorAngle = 3 * Math.PI / 2 - (winnerIndex * arc + arc / 2);
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * (Math.PI * 2); // 5-8 complete revolutions
    const totalRotation = rotationAngle + fullSpins + ((targetSectorAngle - (rotationAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2));

    const duration = 4000; // 4 seconds spin
    const startTime = performance.now();
    const initialAngle = rotationAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Realistic cubic ease-out deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const currentAngle = initialAngle + (totalRotation - initialAngle) * easeOut;
      setRotationAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        const winner = activePlayers[winnerIndex];
        setSelectedPlayer(winner);

        // Pick a dare from prompts
        const randomDare = prompts[Math.floor(Math.random() * prompts.length)] || {
          id: 'default_dare',
          gameId: 'dare-roulette',
          category: 'medium',
          text: 'Do your best celebration dance for 30 seconds!'
        };
        setCurrentDare(randomDare);

        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#FF4DA6', '#F59E0B'],
        });
      }
    };

    requestAnimationFrame(animateSpin);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Active turn or Winner Banner */}
      {selectedPlayer ? (
        <div className="text-center animate-scale-in">
          <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded-full shadow-neon-red">
            🎯 Chosen by Fate
          </span>
          <h3 className="text-3xl font-black text-white mt-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {selectedPlayer}!
          </h3>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            {activePlayers.length} Players on Wheel
          </span>
          <p className="text-sm text-zinc-300 mt-1">Spin to see who faces the punishment</p>
        </div>
      )}

      {/* Wheel Canvas Container */}
      <div className="relative flex items-center justify-center my-2">
        
        {/* Top Pointer Needle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] filter" />

        {/* Canvas */}
        <div className="p-2 rounded-full border-2 border-red-500/40 shadow-neon-red/40 bg-black/60">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="rounded-full max-w-[280px] sm:max-w-[340px] max-h-[280px] sm:max-h-[340px]"
          />
        </div>

      </div>

      {/* Dare Card for Selected Player */}
      {currentDare && selectedPlayer && (
        <div className="w-full p-6 sm:p-8 rounded-3xl glass-panel border border-red-500/50 shadow-neon-red/30 text-center animate-scale-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-red-400" />
            <span className="text-xs font-black uppercase tracking-widest text-red-400">
              The Dare for {selectedPlayer}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white leading-relaxed max-w-lg mx-auto">
            "{currentDare.text}"
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={spinWheel}
          disabled={isSpinning || activePlayers.length < 2}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-base shadow-neon-red flex items-center gap-2.5 transition-all active:scale-95 disabled:opacity-50"
        >
          <Disc3 className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning the Wheel...' : selectedPlayer ? 'Spin Again' : 'Spin the Wheel!'}</span>
        </button>

        {selectedPlayer && (
          <button
            onClick={() => {
              const nextDare = prompts[Math.floor(Math.random() * prompts.length)];
              setCurrentDare(nextDare);
            }}
            className="px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Next Dare</span>
          </button>
        )}
      </div>

    </div>
  );
};

