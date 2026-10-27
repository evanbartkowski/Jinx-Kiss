import React, { useId } from 'react';

const CURRENTS = [
  { name: 'upper', path: 'M -180 275 C 140 30 350 420 710 270 S 1200 30 1440 210 S 1690 390 1810 220' },
  { name: 'lower', path: 'M -180 855 C 140 1070 390 565 730 740 S 1190 1000 1430 765 S 1670 580 1810 740' },
  { name: 'middle', path: 'M -180 560 C 160 800 410 350 790 505 S 1220 720 1510 420 S 1710 440 1810 460' },
];

export function AmbientCurrents({ online }: { online: boolean }) {
  const gradientId = useId();
  const glowId = `${gradientId}-glow`;
  const lightId = `${gradientId}-light`;
  const fadeId = `${gradientId}-fade`;
  return (
    <svg className="ambient-currents" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="500" x2="1600" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={online ? '#38BDF8' : '#FF4DA6'} stopOpacity="0" />
          <stop offset="0.2" stopColor={online ? '#06B6D4' : '#FF4DA6'} />
          <stop offset="0.42" stopColor={online ? '#60A5FA' : '#C084FC'} />
          <stop offset="0.6" stopColor={online ? '#818CF8' : '#A855F7'} />
          <stop offset="0.8" stopColor={online ? '#A78BFA' : '#22D3EE'} />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lightId} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.27" stopColor={online ? '#CFFAFE' : '#FBCFE8'} stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="0.78" stopColor="#CFFAFE" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-100%" width="140%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <radialGradient id={fadeId} cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFFFFF" />
        </radialGradient>
        <mask id={`${fadeId}-mask`}>
          <rect width="1600" height="1000" fill={`url(#${fadeId})`} />
        </mask>
      </defs>
      <g mask={`url(#${fadeId}-mask)`}>
        {CURRENTS.map(({ name, path }) => (
          <g key={name} className={`ambient-current ambient-current--${name}`} stroke={`url(#${gradientId})`}>
            <path
              className="ambient-current-halo"
              d={path}
              strokeWidth="24"
              opacity="0.45"
              filter={`url(#${glowId})`}
            />
            <path d={path} strokeWidth="48" opacity="0.045" />
            <path d={path} strokeWidth="9" opacity="0.1" />
            {[-18, -7, 9, 22].map((offset) => (
              <path
                key={offset}
                d={path}
                transform={`translate(0 ${offset})`}
                strokeWidth={offset === -7 ? 1 : 0.6}
                opacity={offset === -7 ? 0.4 : 0.18}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={path} strokeWidth="2" opacity="0.8" vectorEffect="non-scaling-stroke" />
            <path
              d={path}
              stroke={`url(#${lightId})`}
              strokeWidth="0.8"
              opacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="ambient-current-trace"
              d={path}
              pathLength="1800"
              stroke={`url(#${lightId})`}
              strokeLinecap="round"
              strokeWidth="2.5"
              opacity="0.9"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
