import { getTimelineEvents } from "@/lib/api";
import { Timeline } from "@/models/Timeline";
import { STATUS } from "@/types";
import { useCallback, useEffect, useState } from "react";

type Payload = {
  status: STATUS;
  events: Timeline[];
};

export const useTimelines = (): Payload => {
  const [events, setEvents] = useState<Timeline[]>([]);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);

  const fetchTimelines = useCallback(async () => {
    if (events.length > 0) return;

    setStatus(STATUS.LOADING);
    const res = await getTimelineEvents();

    if (res.status === STATUS.SUCCESSFUL) {
      setEvents(res.timelineEvents);
      setStatus(STATUS.SUCCESSFUL);
    }
    if (res.status === STATUS.FAILED) setStatus(STATUS.FAILED);
  }, [events.length]);

  useEffect(() => {
    fetchTimelines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    events,
    status,
  };
};
