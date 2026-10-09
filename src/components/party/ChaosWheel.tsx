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

  // Draw wheel on canvas
  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, size);

    // Save initial state
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    // Draw slices
    segments.forEach((seg, i) => {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternating gradient or segment color
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Slice inner border
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text inside segment
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, radius - 20, 4);
      ctx.restore();
    });

    // Outer neon glow border
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FF4DA6';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#FF4DA6';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.restore();
  }, [segments, arcSize]);

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

    // Random total spins between 4 and 7 full rotations plus offset
    const randomExtraSpins = 4 + Math.random() * 3;
    const targetSegmentIndex = Math.floor(Math.random() * numSegments);
    // Indicator is pointing at 270 degrees (top: 3 * Math.PI / 2)
    // To land on target segment at top:
    const targetAngle = (3 * Math.PI) / 2 - (targetSegmentIndex * arcSize + arcSize / 2);
    const totalRotation = randomExtraSpins * 2 * Math.PI + targetAngle;

    const startRotation = currentRotationRef.current % (2 * Math.PI);
    const endRotation = startRotation + totalRotation;
    const duration = 4500; // 4.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out deceleration
      const ease = 1 - Math.pow(1 - progress, 3.5);
      const currentAngle = startRotation + (endRotation - startRotation) * ease;

      // Play tick on passing segments
      const segmentProgress = Math.floor((currentAngle / arcSize));
      if (segmentProgress !== lastTickAngleRef.current) {
        lastTickAngleRef.current = segmentProgress;
        soundEffects.playTick();
      }

      currentRotationRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const landedSeg = segments[targetSegmentIndex];
        setSelectedResult(landedSeg);
        setShowResultModal(true);
        soundEffects.playSuccess();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF4DA6', '#A855F7', '#06B6D4', '#F59E0B'],
        });

        if (onResultSelected) {
          onResultSelected(landedSeg);
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
    <div className="flex flex-col items-center relative w-full max-w-lg mx-auto">
      {/* Top Indicator Peg */}
      <div className="relative z-10 -mb-4 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-white drop-shadow-[0_0_12px_#FF4DA6]" />
      </div>

      {/* Canvas Wheel */}
      <div className="relative p-2 rounded-full glass-panel border border-white/10 shadow-[0_0_50px_rgba(255,77,166,0.25)]">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] select-none touch-none"
        />

        {/* Center Spin Button Overlay */}
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-xs uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 ${
            isSpinning
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-tr from-brand-pink to-brand-violet hover:scale-105 shadow-neon-pink cursor-pointer animate-pulse-slow'
          }`}
        >
          {isSpinning ? (
            <RotateCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Disc3 className="w-4 h-4 mb-0.5" />
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
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSpinning ? 'Wheel Spinning...' : 'Spin Chaos Wheel!'}</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white font-semibold text-xs"
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
            {/* Close button */}
            <button
              onClick={() => setShowResultModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon */}
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white border shadow-lg"
              style={{
                backgroundColor: `${selectedResult.color}30`,
                borderColor: `${selectedResult.color}80`,
                boxShadow: `0 0 25px ${selectedResult.color}50`,
              }}
            >
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-1">
              Chaos Wheel Decided:
            </span>

            <h3
              className="text-2xl sm:text-3xl font-black uppercase tracking-wide mb-3"
              style={{ color: selectedResult.color }}
            >
              {selectedResult.label}
            </h3>

            <p className="text-sm text-zinc-200 leading-relaxed mb-6 font-medium">
              {selectedResult.description}
            </p>

            <button
              onClick={() => {
                setShowResultModal(false);
                if (onClose && isModal) onClose();
              }}
              className="w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              style={{
                backgroundColor: selectedResult.color,
                boxShadow: `0 0 25px ${selectedResult.color}60`,
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
