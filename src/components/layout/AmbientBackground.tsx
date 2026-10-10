import React, { useEffect, useRef } from 'react';
import { useGameSettings } from '../../context/GameSettingsContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playMode } = useGameSettings();
  const isOnline = playMode === 'online';

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const colors = isOnline
      ? ['#06B6D4', '#3B82F6', '#8B5CF6', '#38BDF8']
      : ['#FF4DA6', '#A855F7', '#06B6D4'];
    const isMobileDevice = width < 768;
    const maxParticles = isMobileDevice ? 12 : 40;
    const particleCount = Math.min(Math.floor((width * height) / (isMobileDevice ? 80000 : 45000)), maxParticles);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (isMobileDevice ? 1.5 : 2) + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.25 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let isVisible = !document.hidden;
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      if (nowVisible && !isVisible) {
        isVisible = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      } else {
        isVisible = nowVisible;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        if (!isMobileDevice) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050505]">
      {/* Soft blurred ambient radial gradients */}
      <div className={`absolute top-[-10%] left-[20%] w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] rounded-full blur-[60px] sm:blur-[130px] transform-gpu ambient-blob-1 transition-colors duration-700 ${
        isOnline ? 'bg-cyan-500/15' : 'bg-brand-pink/15'
      }`} />
      <div className={`absolute top-[35%] right-[-8%] w-[300px] sm:w-[650px] h-[300px] sm:h-[650px] rounded-full blur-[70px] sm:blur-[150px] transform-gpu ambient-blob-2 transition-colors duration-700 ${
        isOnline ? 'bg-blue-600/15' : 'bg-brand-violet/15'
      }`} />
      <div className="absolute bottom-[-10%] left-[-8%] w-[280px] sm:w-[600px] h-[280px] sm:h-[600px] rounded-full bg-cyan-500/15 blur-[60px] sm:blur-[140px] transform-gpu ambient-blob-3" />
      <div className={`absolute top-[65%] left-[30%] w-[220px] sm:w-[450px] h-[220px] sm:h-[450px] rounded-full blur-[60px] sm:blur-[130px] transform-gpu ambient-blob-1 transition-colors duration-700 ${
        isOnline ? 'bg-indigo-600/15' : 'bg-purple-900/10'
      }`} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
    </div>
  );
};

