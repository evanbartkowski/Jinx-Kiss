import React, { useId } from 'react';

const CURRENTS = [
  { name: 'upper', path: 'M -180 340 C 100 460 240 100 560 240 S 1030 420 1280 190 S 1610 180 1810 260' },
  { name: 'lower', path: 'M -180 790 C 180 580 310 940 650 730 S 1110 560 1360 800 S 1660 850 1810 660' },
  { name: 'middle', path: 'M -180 590 C 140 740 360 430 720 520 S 1170 740 1450 470 S 1670 400 1810 460' },
];

export function AmbientCurrents({ online }: { online: boolean }) {
  const gradientId = useId();
  return (
    <svg className="ambient-currents" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="500" x2="1600" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={online ? '#38BDF8' : '#FF4DA6'} stopOpacity="0" />
          <stop offset="0.2" stopColor={online ? '#06B6D4' : '#FF4DA6'} />
          <stop offset="0.52" stopColor={online ? '#3B82F6' : '#A855F7'} />
          <stop offset="0.8" stopColor={online ? '#A78BFA' : '#22D3EE'} />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      {CURRENTS.map(({ name, path }) => (
        <g key={name} className={`ambient-current ambient-current--${name}`} stroke={`url(#${gradientId})`}>
          <path d={path} strokeWidth="58" opacity="0.035" />
          {[-30, -15, 0, 15, 30].map((offset) => (
            <path
              key={offset}
              d={path}
              transform={`translate(0 ${offset})`}
              strokeWidth={offset === 0 ? 1.5 : 0.8}
              opacity={offset === 0 ? 0.6 : 0.24}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path className="ambient-current-trace" d={path} strokeWidth="2" opacity="0.45" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}
