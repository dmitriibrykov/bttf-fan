"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/models/Timeline";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.g
      key={event.year}
      onClick={() => selectEvent(event)}
      style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px` }}
    >
      <motion.circle
        cx={x}
        cy={y}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ r: isSelected || isHovered ? 16 : 10 }}
        transition={{ duration: 0.2 }}
        fill="var(--primary)"
      />
      <motion.text
        x={x}
        y={isSelected || isHovered ? y - 30 : y - 20}
        textAnchor="middle"
        fill="var(--foreground)"
        fontWeight="bold"
        animate={{
          fontSize: isSelected || isHovered ? "18" : "14",
          fill: isSelected ? "var(--primary)" : "var(--foreground)",
        }}
        transition={{ duration: 0.2 }}
      >
        {event.year}
      </motion.text>
    </motion.g>
  );
}
