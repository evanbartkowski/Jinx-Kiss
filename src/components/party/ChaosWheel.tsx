import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CHAOS_WHEEL_SEGMENTS } from '../../data/chaosWheel';
import { ChaosWheelSegment } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import { Disc3, Sparkles, X, RotateCw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChaosWheelProps {
  onResultSelected?: (result: ChaosWheelSegment) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const ChaosWheel: React.FC<ChaosWheelProps> = ({
  onResultSelected,
  onClose,
  isModal = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ChaosWheelSegment | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const currentRotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef(0);

  const segments = CHAOS_WHEEL_SEGMENTS;
  const numSegments = segments.length;
  const arcSize = (2 * Math.PI) / numSegments;

  // Draw high-resolution wheel on canvas with casino neon aesthetics
  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 28;

    ctx.clearRect(0, 0, size, size);

    // 1. Outer metallic casing with glowing stroke
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 22, 0, Math.PI * 2);
    ctx.fillStyle = '#08080C';
    ctx.fill();
    ctx.strokeStyle = '#FF4DA6';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 77, 166, 0.7)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    // 2. Rotating wheel segments
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    // Draw slices with rich radial gradients
    segments.forEach((seg, i) => {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 35, 0, 0, radius);
      grad.addColorStop(0, '#101018');
      grad.addColorStop(0.35, seg.color + 'CC');
      grad.addColorStop(1, seg.color);

      ctx.fillStyle = grad;
      ctx.fill();

      // Divider between slices
      ctx.strokeStyle = '#050508';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner subtle edge arc
      ctx.beginPath();
      ctx.arc(0, 0, radius - 2, startAngle, endAngle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text inside slice
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 13px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const maxTextWidth = radius - 60;
      ctx.fillText(seg.label.toUpperCase(), radius - 16, 5, maxTextWidth);
      ctx.restore();
    });

    // Outer wheel border line
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 3. Center multi-tier hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#0B0B10';
    ctx.fill();
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
    ctx.shadowBlur = 12;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 28, 0, Math.PI * 2);
    const hubGrad = ctx.createLinearGradient(center - 28, center - 28, center + 28, center + 28);
    hubGrad.addColorStop(0, '#FF4DA6');
    hubGrad.addColorStop(1, '#A855F7');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 4. Perimeter Casino LED Pegs
    const numPegs = numSegments * 2;
    for (let p = 0; p < numPegs; p++) {
      const pegAngle = (p * Math.PI * 2) / numPegs;
      const pegX = center + (radius + 11) * Math.cos(pegAngle);
      const pegY = center + (radius + 11) * Math.sin(pegAngle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = p % 2 === 0 ? '#38BDF8' : '#F472B6';
      ctx.shadowColor = p % 2 === 0 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(244, 114, 182, 0.9)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }, [segments, arcSize, numSegments]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [drawWheel]);

  // Spin physics engine
  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedResult(null);
    setShowResultModal(false);
    soundEffects.playClick();

    // Random total spins between 5 and 8 full rotations plus offset
    const randomExtraSpins = 5 + Math.random() * 3;
    const targetSegmentIndex = Math.floor(Math.random() * numSegments);
    const targetAngle = (3 * Math.PI) / 2 - (targetSegmentIndex * arcSize + arcSize / 2);
    const totalRotation = randomExtraSpins * 2 * Math.PI + targetAngle;

    const startRotation = currentRotationRef.current % (2 * Math.PI);
    const endRotation = startRotation + totalRotation;
    const duration = 4500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out deceleration
      const ease = 1 - Math.pow(1 - progress, 3.5);
      const currentAngle = startRotation + (endRotation - startRotation) * ease;

      currentRotationRef.current = currentAngle;
      drawWheel(currentAngle);

      // Play tick sound whenever a slice passes the top needle
      const sliceProgress = Math.floor((currentAngle % (2 * Math.PI)) / arcSize);
      if (sliceProgress !== lastTickAngleRef.current) {
        soundEffects.playWheelTick();
        lastTickAngleRef.current = sliceProgress;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const result = segments[targetSegmentIndex];
        setSelectedResult(result);
        setShowResultModal(true);

        soundEffects.playCelebration();
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: [result.color, '#FF4DA6', '#A855F7'],
        });

        if (onResultSelected) {
          onResultSelected(result);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center relative w-full max-w-xl mx-auto select-none">
      {/* Top Indicator Peg */}
      <div className="relative z-20 -mb-5 flex flex-col items-center filter drop-shadow-[0_4px_12px_rgba(255,77,166,0.9)]">
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[30px] border-t-white" />
        <div className="w-2.5 h-2.5 rounded-full bg-brand-pink -mt-1 shadow-[0_0_8px_#FF4DA6]" />
      </div>

      {/* Canvas Wheel with Ambient Halo */}
      <div className="relative p-2.5 rounded-full glass-panel border border-white/15 shadow-[0_0_60px_rgba(255,77,166,0.35)] bg-black/85 backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={520}
          height={520}
          className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] max-w-[82vw] max-h-[82vw] aspect-square select-none touch-none cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          onClick={spin}
        />

        {/* Center Spin Button Overlay */}
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center font-black text-xs uppercase tracking-wider text-white shadow-2xl transition-transform active:scale-95 ${
            isSpinning
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-tr from-brand-pink via-purple-600 to-brand-violet hover:scale-105 shadow-neon-pink cursor-pointer animate-pulse-slow'
          }`}
        >
          {isSpinning ? (
            <RotateCw className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Disc3 className="w-5 h-5 mb-0.5" />
              <span>SPIN</span>
            </>
          )}
        </button>
      </div>

      {/* Manual Spin Action Button */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="px-8 py-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSpinning ? 'Wheel Spinning...' : 'Spin Chaos Wheel!'}</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition-all"
          >
            Close
          </button>
        )}
      </div>

      {/* Result Reveal Modal */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-sm rounded-3xl glass-panel p-8 text-center relative border shadow-2xl animate-scale-in"
            style={{
              borderColor: selectedResult.color,
              boxShadow: `0 0 50px -10px ${selectedResult.color}80`,
            }}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: `${selectedResult.color}25`,
                borderColor: `${selectedResult.color}50`,
                color: selectedResult.color,
              }}
            >
              <Trophy className="w-8 h-8" />
            </div>

            <div className="mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                Chaos Wheel Decided:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1" style={{ color: selectedResult.color }}>
                {selectedResult.label}
              </h3>
            </div>

            <p className="text-sm text-zinc-300 font-medium leading-relaxed my-4">
              {selectedResult.description}
            </p>

            <button
              onClick={() => {
                setShowResultModal(false);
                if (onClose) onClose();
              }}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                backgroundColor: selectedResult.color,
              }}
            >
              <span>Accept Fate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
