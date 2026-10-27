import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect, useRef } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { Disc3, RotateCcw, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DareRouletteGameProps {
  prompts: PromptItem[];
  players: string[];
  onOpenPlayerModal?: () => void;
}

const DEFAULT_DARE_SECTORS = [
  'Physical Dare',
  'Wild Dare',
  'Spicy Dare',
  'Phone Dare',
  'Social Media',
  'Secret Dare',
  'Double Trouble',
  'Mystery Dare',
];

const ONLINE_DARE_SECTORS = [
  'Webcam Dare',
  'Wild Dare',
  'Spicy Dare',
  'Phone Dare',
  'Social Media',
  'Secret Dare',
  'Discord Dare',
  'Mystery Dare',
];

export const DareRouletteGame: React.FC<DareRouletteGameProps> = ({
  prompts,
  players,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isOnline = prompts[0]?.playMode === 'online';
  const defaultSectors = isOnline ? ONLINE_DARE_SECTORS : DEFAULT_DARE_SECTORS;
  const isPlayerMode = players.length >= 2;
  const [activeSegments, setActiveSegments] = useState<string[]>(
    isPlayerMode ? players : defaultSectors
  );
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [currentDare, setCurrentDare] = useLivePromptState<PromptItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  // Sync when parent players change
  useEffect(() => {
    if (players.length >= 2) {
      setActiveSegments(players);
    } else {
      setActiveSegments(DEFAULT_DARE_SECTORS);
    }
  }, [players]);

  const wheelGradients = [
    { start: '#DC2626', end: '#991B1B' }, // Red
    { start: '#EC4899', end: '#BE185D' }, // Pink
    { start: '#8B5CF6', end: '#6D28D9' }, // Purple
    { start: '#06B6D4', end: '#0E7490' }, // Cyan
    { start: '#F59E0B', end: '#B45309' }, // Amber
    { start: '#10B981', end: '#047857' }, // Emerald
    { start: '#3B82F6', end: '#1D4ED8' }, // Blue
    { start: '#F43F5E', end: '#BE123C' }, // Rose
  ];

  const rotationAngleRef = useRef(0);

  // Draw the roulette wheel on canvas with premium casino neon aesthetics
  const drawWheel = React.useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 30; // Leave room for outer metallic rim and perimeter pegs
    const count = activeSegments.length;
    const arc = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw outer glowing casing
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 24, 0, Math.PI * 2);
    ctx.fillStyle = '#0A0A0E';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    // 2. Draw rotating wheel body
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);
    ctx.translate(-center, -center);

    // Draw wheel segments with radial gradients
    activeSegments.forEach((segment, i) => {
      const segAngle = i * arc;
      const gradConfig = wheelGradients[i % wheelGradients.length];

      ctx.beginPath();
      const grad = ctx.createRadialGradient(center, center, 35, center, center, radius);
      grad.addColorStop(0, '#151520');
      grad.addColorStop(0.2, gradConfig.end);
      grad.addColorStop(1, gradConfig.start);

      ctx.fillStyle = grad;
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, segAngle, segAngle + arc);
      ctx.lineTo(center, center);
      ctx.fill();

      // Sharp dark divider line between segments
      ctx.strokeStyle = '#050507';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner subtle edge highlight
      ctx.beginPath();
      ctx.arc(center, center, radius - 2, segAngle, segAngle + arc);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Segment text with drop shadow
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(segAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 14px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      const maxTextWidth = radius - 70;
      const displayText = segment.length > 16 ? segment.substring(0, 14) + '...' : segment;
      ctx.fillText(displayText.toUpperCase(), radius - 20, 5, maxTextWidth);
      ctx.restore();
    });

    // Outer wheel border line
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Center multi-tiered glowing hub
    // Hub tier 1 (outer dark chrome)
    ctx.beginPath();
    ctx.arc(center, center, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#0F0F14';
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Hub tier 2 (inner metallic disc)
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, Math.PI * 2);
    const hubGrad = ctx.createLinearGradient(center - 28, center - 28, center + 28, center + 28);
    hubGrad.addColorStop(0, '#EF4444');
    hubGrad.addColorStop(0.5, '#BE185D');
    hubGrad.addColorStop(1, '#6D28D9');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hub tier 3 (center jewel)
    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.restore();

    // 4. Perimeter Casino LED Pegs (fixed relative to canvas rim)
    const numPegs = Math.max(16, count * 2);
    for (let p = 0; p < numPegs; p++) {
      const pegAngle = (p * Math.PI * 2) / numPegs;
      const pegX = center + (radius + 12) * Math.cos(pegAngle);
      const pegY = center + (radius + 12) * Math.sin(pegAngle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = p % 2 === 0 ? '#FBBF24' : '#F43F5E';
      ctx.shadowColor = p % 2 === 0 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(244, 63, 94, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }, [activeSegments]);

  useEffect(() => {
    drawWheel(rotationAngle);
  }, [drawWheel, rotationAngle]);

  const spinWheel = () => {
    if (isSpinning || activeSegments.length < 2) return;
    setIsSpinning(true);
    setSpinCount((prev) => prev + 1);
    setSelectedWinner(null);
    setCurrentDare(null);

    soundEffects.playWheelTick();

    // Pick winning index fairly
    const winnerIndex = Math.floor(Math.random() * activeSegments.length);
    const count = activeSegments.length;
    const arc = (Math.PI * 2) / count;

    // Pointer is at the top (angle = 3*PI/2)
    const targetSectorAngle = (3 * Math.PI) / 2 - (winnerIndex * arc + arc / 2);
    const fullSpins = (6 + Math.floor(Math.random() * 4)) * (Math.PI * 2);
    const totalRotation =
      rotationAngleRef.current +
      fullSpins +
      (((targetSectorAngle - (rotationAngleRef.current % (Math.PI * 2))) + Math.PI * 4) % (Math.PI * 2));

    const duration = 4200;
    const startTime = performance.now();
    const initialAngle = rotationAngleRef.current;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Realistic cubic ease-out deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const currentAngle = initialAngle + (totalRotation - initialAngle) * easeOut;
      rotationAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setRotationAngle(currentAngle);
        setIsSpinning(false);
        const winner = activeSegments[winnerIndex];
        setSelectedWinner(winner);

        // Pick a dare from prompts with legendary roll
        let randomDare =
          prompts[Math.floor(Math.random() * prompts.length)] || {
            id: 'default_dare',
            gameId: 'dare-roulette',
            category: 'medium',
            playMode: isOnline ? 'online' : 'in-person',
            text: isOnline
              ? 'Deliver a dramatic 15-second infomercial selling whatever item is on your desk right now!'
              : 'Do your best celebration dance for 30 seconds!',
          };
        randomDare = rollForLegendaryCard(randomDare, randomDare.category || 'medium', 'dare-roulette', 0.02, randomDare.playMode);
        setCurrentDare(randomDare);

        if (isPromptLegendary(randomDare)) {
          triggerLegendaryCardEffects(randomDare);
        } else {
          soundEffects.playSuccess();
          confetti({
            particleCount: 50,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#FF4DA6', '#F59E0B', '#10B981'],
          });
        }
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const isLegendary = isPromptLegendary(currentDare);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Active turn or Winner Banner */}
      {selectedWinner ? (
        <div className="text-center animate-scale-in">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-red-400 bg-red-950/70 border border-red-500/50 px-5 py-2 rounded-full shadow-neon-red">
            {isPlayerMode ? '🎯 Chosen by Fate' : '🔥 Selected Challenge Category'}
          </span>
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-3 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            {selectedWinner}!
          </h3>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-red-950/40 border border-red-500/30 text-red-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isPlayerMode ? `${activeSegments.length} Players on Wheel` : 'Dare Roulette Wheel'}</span>
          </div>
          {spinCount === 0 && (
            <p className="text-sm sm:text-base text-zinc-300 font-medium">
              {isPlayerMode ? 'Spin to select who faces the next dare' : 'Spin the neon roulette to determine your challenge'}
            </p>
          )}
        </div>
      )}

      {/* High-Resolution Roulette Wheel Container */}
      <div className="relative flex items-center justify-center my-3">
        {/* Ambient Neon Backlight Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/30 via-pink-600/20 to-purple-600/30 blur-3xl pointer-events-none scale-110" />

        {/* Top Pointer Needle (Crisp Metallic Triangular Indicator) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.9)]">
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[34px] border-t-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-white -mt-1 shadow-[0_0_8px_#FFFFFF]" />
        </div>

        {/* Canvas Display */}
        <div className="relative p-2.5 rounded-full border-2 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.35)] bg-black/80 backdrop-blur-md">
          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            className="rounded-full w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] max-w-[82vw] max-h-[82vw] aspect-square cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            onClick={spinWheel}
          />
        </div>
      </div>

      {/* Dare Card for Selected Player or Dare Type (Significantly Bigger, Screen-Fitting & Legendary-Aware) */}
      {currentDare && selectedWinner && (
        <div className={`w-full max-w-4xl p-8 sm:p-14 md:p-16 rounded-3xl sm:rounded-4xl glass-panel border text-center animate-scale-in transition-all duration-500 ${
          isLegendary
            ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
            : 'border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.35)]'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            {isLegendary ? (
              <LegendaryCardBadge title={currentDare.legendaryTitle || '★ LEGENDARY SPINNER ★'} size="lg" />
            ) : (
              <>
                <Flame className="w-6 h-6 text-red-400" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-500/40 px-4 py-1.5 rounded-full">
                  {isPlayerMode ? `Dare for ${selectedWinner}` : `Challenge: ${selectedWinner}`}
                </span>
              </>
            )}
          </div>

          <p className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-snug max-w-3xl mx-auto my-8 ${
            isLegendary
              ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
              : 'text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]'
          }`}>
            "{currentDare.text}"
          </p>

          <div className="w-full max-w-md mx-auto pt-2">
            <CardRatingBar prompt={currentDare} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2">
        <button
          onClick={spinWheel}
          disabled={isSpinning || activeSegments.length < 2}
          className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-base sm:text-lg shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Disc3 className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning the Wheel...' : selectedWinner ? 'Spin Again' : 'Spin the Wheel!'}</span>
        </button>

        {selectedWinner && (
          <button
            onClick={() => {
              let nextDare = prompts[Math.floor(Math.random() * prompts.length)];
              nextDare = rollForLegendaryCard(nextDare, nextDare.category || 'medium', 'dare-roulette', 0.02, nextDare.playMode);
              setCurrentDare(nextDare);
              if (isPromptLegendary(nextDare)) {
                triggerLegendaryCardEffects(nextDare);
              } else {
                soundEffects.playCardFlip();
              }
            }}
            className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-black text-base sm:text-lg flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Next Dare</span>
          </button>
        )}
      </div>
    </div>
  );
};
