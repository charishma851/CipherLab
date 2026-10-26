import React from 'react';
import { motion } from 'framer-motion';

export default function CipherWheel({
  shift = 3,
  activeChar = 'A',
  activeOutput = 'D'
}) {
  const size = 300;
  const center = size / 2;
  const outerR = 120;
  const innerR = 85;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Angle in degrees for each letter (0 to 360)
  const angleStep = 360 / 26;
  const safeShift = typeof shift === 'number' && Number.isFinite(shift)
    ? ((shift % 26) + 26) % 26
    : 0;
  const rotationAngle = safeShift * angleStep;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="select-none overflow-visible">
          <defs>
            <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.9" />
            </radialGradient>
          </defs>

          {/* Outer circle background (Plaintext) */}
          <circle cx={center} cy={center} r={outerR + 18} fill="#0d1424" stroke="#1f2b45" strokeWidth="2" />
          <circle cx={center} cy={center} r={outerR - 12} fill="none" stroke="#2a3a5e" strokeWidth="1" strokeDasharray="3 3" />

          {/* Outer Ring Letters: Plaintext */}
          {alphabet.map((letter, i) => {
            const angleDeg = i * angleStep - 90;
            const rad = (angleDeg * Math.PI) / 180;
            const x = center + outerR * Math.cos(rad);
            const y = center + outerR * Math.sin(rad);
            const isActive = letter === activeChar;

            return (
              <text
                key={`outer-${letter}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12.5"
                fontWeight={isActive ? 'bold' : 'normal'}
                fill={isActive ? '#22d3ee' : '#94a3b8'}
                className="font-mono transition-colors"
              >
                {letter}
              </text>
            );
          })}

          {/* Rotating Inner Ring Group (Ciphertext) */}
          <motion.g
            animate={{ rotate: -rotationAngle }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            {/* Inner circle body */}
            <circle cx={center} cy={center} r={innerR + 10} fill="url(#wheelCenter)" stroke="#3b4261" strokeWidth="1.5" />
            <circle cx={center} cy={center} r={innerR - 14} fill="#090d16" stroke="#1f2b45" strokeWidth="1" />

            {/* Inner Ring Letters */}
            {alphabet.map((letter, i) => {
              const angleDeg = i * angleStep - 90;
              const rad = (angleDeg * Math.PI) / 180;
              const x = center + innerR * Math.cos(rad);
              const y = center + innerR * Math.sin(rad);

              return (
                <text
                  key={`inner-${letter}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="600"
                  fill="#a855f7"
                  className="font-mono"
                  transform={`rotate(${angleDeg + 90}, ${x}, ${y})`}
                >
                  {letter}
                </text>
              );
            })}
          </motion.g>

          {/* Alignment indicator at 12 o'clock (top) */}
          <line
            x1={center}
            y1={center - outerR - 16}
            x2={center}
            y2={center - innerR + 15}
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="3 2"
          />
          <polygon
            points={`${center - 5},${center - outerR - 16} ${center + 5},${center - outerR - 16} ${center},${center - outerR - 8}`}
            fill="#10b981"
          />
        </svg>
      </div>

      <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Outer = Plaintext
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400"></span> Inner = Ciphertext (shift {safeShift})
        </span>
      </div>
    </div>
  );
}
