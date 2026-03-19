"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../loading";
import { type Timeline } from "@/models/Timeline";
import { useTimelines } from "@/hooks";
import { STATUS } from "@/types";
import Error from "@/components/Error";

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 200;
const PADDING = 20;
const MAIN_Y = 60;
const ALT_Y = 150;

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<Timeline | null>(null);

  const { events, status } = useTimelines();

  const mainEvents = useMemo(
    () => events.filter((e) => e.branch === "main"),
    [events],
  );
  const altEvents = useMemo(
    () => events.filter((e) => e.branch === "alternate"),
    [events],
  );

  const mainPositions = mainEvents.map((e, i) => ({
    x: PADDING + (i * (SVG_WIDTH - PADDING * 2)) / (mainEvents.length - 1),
    y: MAIN_Y,
    event: e,
  }));

  const point1955 = mainPositions.find((p) => p.event.year === 1955)!;
  const point1985 = mainPositions.find((p) => p.event.year === 1985)!;

  const altPositions = altEvents.map((e, i) => ({
    x:
      point1985.x +
      (i * (SVG_WIDTH - PADDING - point1985.x)) /
        Math.max(altEvents.length - 1, 1),
    y: ALT_Y,
    event: e,
  }));

  function selectEvent(event: Timeline) {
    if (
      selectedEvent?.year === event.year &&
      selectedEvent?.branch === event.branch
    ) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(event);
    }
  }

  if (status === STATUS.FAILED) return <Error />;

  if (status === STATUS.LOADING || !point1955 || !point1985) return <Loading />;

  return (
    <div className="w-full px-8 mt-8">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ overflow: "visible" }}
      >
        <line
          x1={0}
          y1={MAIN_Y}
          x2={SVG_WIDTH}
          y2={MAIN_Y}
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <line
          x1={point1955.x}
          y1={MAIN_Y}
          x2={point1955.x + 80}
          y2={ALT_Y}
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {altPositions.length > 0 && (
          <line
            x1={point1955.x + 80}
            y1={ALT_Y}
            x2={SVG_WIDTH - PADDING}
            y2={ALT_Y}
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}

        {mainPositions.map(({ x, y, event }) => {
          const isSelected =
            selectedEvent?.year === event.year &&
            selectedEvent?.branch === event.branch;

          return (
            <motion.g
              key={event.year}
              onClick={() => selectEvent(event)}
              whileHover={{ scale: isSelected ? 1 : 1.3 }}
              style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px` }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r={0}
                animate={{ r: isSelected ? 16 : 10 }}
                transition={{ duration: 0.2 }}
                fill="var(--primary)"
              />
              <motion.text
                x={x}
                y={isSelected ? y - 30 : y - 20}
                textAnchor="middle"
                fill="currentColor"
                fontWeight="bold"
                animate={{
                  fontSize: isSelected ? "18" : "14",
                  fill: isSelected ? "var(--primary)" : "currentColor",
                }}
                transition={{ duration: 0.2 }}
              >
                {event.year}
              </motion.text>
            </motion.g>
          );
        })}

        {altPositions.map(({ x, y, event }) => {
          const isSelected =
            selectedEvent?.year === event.year &&
            selectedEvent?.branch === event.branch;

          return (
            <motion.g
              key={event.year}
              onClick={() => selectEvent(event)}
              whileHover={{ scale: isSelected ? 1 : 1.3 }}
              style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px` }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r={0}
                animate={{ r: isSelected ? 16 : 10 }}
                transition={{ duration: 0.2 }}
                fill="var(--primary)"
              />
              <motion.text
                x={x}
                y={isSelected ? y - 30 : y - 20}
                textAnchor="middle"
                fill="currentColor"
                fontWeight="bold"
                animate={{
                  fontSize: isSelected ? "18" : "14",
                  fill: isSelected ? "var(--primary)" : "currentColor",
                }}
                transition={{ duration: 0.2 }}
              >
                {event.year}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>

      <AnimatePresence mode="wait">
        {selectedEvent && (
          <motion.div
            key={`${selectedEvent.year}-${selectedEvent.branch}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <div className="flex flex-col md:block">
              <img
                src={selectedEvent.imgSrc}
                alt="bttf-photo"
                className="float-left mb-8 md:mb-0 md:mr-8 max-w-[400px] h-auto w-full object-fill"
              />
              <h1>{selectedEvent.title}</h1>
              <p className="text-muted-foreground">
                {selectedEvent.description}
              </p>
              <p>{selectedEvent.mainText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
