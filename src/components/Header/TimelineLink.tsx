"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";

type IconProps = {
  isHovered: boolean;
  isActive: boolean;
};

function FluxCapacitorIcon({ isHovered, isActive }: IconProps) {
  const glowOpacity = useMotionValue(0.5);
  const speedRef = useRef(2.5);

  useEffect(() => {
    speedRef.current = isHovered || isActive ? 10 : 2.5;
  }, [isHovered, isActive]);

  useEffect(() => {
    let frame: number;

    const animate = (time: number) => {
      const t = time / 1000;
      const s = speedRef.current;
      const val =
        0.55 +
        0.28 * Math.sin(t * s) +
        0.12 * Math.sin(t * s * 2.7 + 0.8) +
        0.05 * Math.sin(t * s * 7.1 + 1.5);
      glowOpacity.set(Math.max(0.1, Math.min(1, val)));
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [glowOpacity]);

  const boxStroke =
    isHovered || isActive ? "text-primary" : "text-muted-foreground";

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
    >
      <defs>
        <filter id="fc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
        className={boxStroke}
      />

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-muted-foreground"
        opacity={0.35}
      />

      <circle
        cx="4.2"
        cy="4.2"
        r="0.55"
        fill="currentColor"
        className="text-muted-foreground"
        opacity={0.45}
      />
      <circle
        cx="19.8"
        cy="4.2"
        r="0.55"
        fill="currentColor"
        className="text-muted-foreground"
        opacity={0.45}
      />
      <circle
        cx="4.2"
        cy="19.8"
        r="0.55"
        fill="currentColor"
        className="text-muted-foreground"
        opacity={0.45}
      />
      <circle
        cx="19.8"
        cy="19.8"
        r="0.55"
        fill="currentColor"
        className="text-muted-foreground"
        opacity={0.45}
      />

      <line
        x1="12"
        y1="13.5"
        x2="12"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.3"
        className="text-muted-foreground"
      />
      <line
        x1="12"
        y1="13.5"
        x2="6.5"
        y2="19.5"
        stroke="currentColor"
        strokeWidth="1.3"
        className="text-muted-foreground"
      />
      <line
        x1="12"
        y1="13.5"
        x2="17.5"
        y2="19.5"
        stroke="currentColor"
        strokeWidth="1.3"
        className="text-muted-foreground"
      />

      <motion.g style={{ opacity: glowOpacity }} filter="url(#fc-glow)">
        <line
          x1="12"
          y1="13.5"
          x2="12"
          y2="6"
          stroke="#60a5fa"
          strokeWidth="1.6"
        />
        <line
          x1="12"
          y1="13.5"
          x2="6.5"
          y2="19.5"
          stroke="#60a5fa"
          strokeWidth="1.6"
        />
        <line
          x1="12"
          y1="13.5"
          x2="17.5"
          y2="19.5"
          stroke="#60a5fa"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="6" r="1.5" fill="#93c5fd" />
        <circle cx="6.5" cy="19.5" r="1.5" fill="#93c5fd" />
        <circle cx="17.5" cy="19.5" r="1.5" fill="#93c5fd" />
        <circle cx="12" cy="13.5" r="1.9" fill="#bfdbfe" />
      </motion.g>
    </svg>
  );
}

type Props = {
  isActive: boolean;
  href: string;
  label: string;
  handleToggleSheet(): void;
};

export default function TimelineLink({
  isActive,
  href,
  label,
  handleToggleSheet,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const content = isActive ? (
    <span className="text-primary text-4xl border-b-1 border-primary">
      {label}
    </span>
  ) : (
    <Link href={href} onClick={handleToggleSheet} className="text-2xl">
      {label}
    </Link>
  );

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
      <FluxCapacitorIcon isHovered={isHovered} isActive={isActive} />
    </div>
  );
}
