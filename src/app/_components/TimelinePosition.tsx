"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Timeline } from "@/models/Timeline";
import { useMediaQuery } from "@/hooks";

type Props = {
  event: Timeline;
  x: number;
  y: number;
  isSelected: boolean;
  selectEvent(event: Timeline): void;
};

export default function TimelinePosition({
  event,
  x,
  y,
  isSelected,
  selectEvent,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isHovered, setIsHovered] = useState(false);

  const baseY = isMobile ? y - 40 : y - 20;
  const baseR = isMobile ? 30 : 10;
  const baseFontSize = isMobile ? "42" : "14";

  return (
    <motion.g
      key={event.year}
      onClick={() => selectEvent(event)}
      style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px` }}
    >
      <motion.circle
        cx={x}
        cy={y}
        initial={{ r: 10 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ r: isSelected || isHovered ? baseR * 1.25 : baseR }}
        transition={{ duration: 0.2 }}
        fill="var(--primary)"
      />
      <motion.text
        x={x}
        y={isSelected || isHovered ? baseY - 10 : baseY}
        textAnchor="middle"
        fill="var(--foreground)"
        fontWeight="bold"
        animate={{
          fontSize:
            isSelected || isHovered
              ? (Number(baseFontSize) * 1.25).toString()
              : baseFontSize,
          fill: isSelected ? "var(--primary)" : "var(--foreground)",
        }}
        transition={{ duration: 0.2 }}
      >
        {event.year}
      </motion.text>
    </motion.g>
  );
}
