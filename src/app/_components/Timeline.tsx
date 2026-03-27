"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loading from "../loading";
import { type Timeline } from "@/models/Timeline";
import { useMediaQuery, useTimelines } from "@/hooks";
import { STATUS } from "@/types";
import Error from "@/components/Error";
import TimelineContent from "./TimelineContent";
import TimelinePosition from "./TimelinePosition";

export default function Timeline() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedEvent, setSelectedEvent] = useState<Timeline | null>(null);

  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = isMobile ? 280 : 200;
  const PADDING = isMobile ? 60 : 20;
  const MAIN_Y = 60;
  const ALT_Y = isMobile ? 220 : 150;

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
    <div className="w-full px-2 md:px-8 mt-8">
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
            <TimelinePosition
              key={event.year}
              event={event}
              x={x}
              y={y}
              isSelected={isSelected}
              selectEvent={selectEvent}
            />
          );
        })}

        {altPositions.map(({ x, y, event }) => {
          const isSelected =
            selectedEvent?.year === event.year &&
            selectedEvent?.branch === event.branch;

          return (
            <TimelinePosition
              key={event.year}
              event={event}
              x={x}
              y={y}
              isSelected={isSelected}
              selectEvent={selectEvent}
            />
          );
        })}
      </svg>

      <AnimatePresence mode="wait">
        {selectedEvent && <TimelineContent selectedEvent={selectedEvent} />}
      </AnimatePresence>
    </div>
  );
}
