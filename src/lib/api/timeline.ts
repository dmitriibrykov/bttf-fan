import { Timeline } from "@/models/Timeline";
import { ResponseFailed, ResponseSuccessfulBase, STATUS } from "@/types";

type FetchTimelineResponse =
  | ResponseFailed
  | (ResponseSuccessfulBase & {
      timelineEvents: Timeline[];
    });

type Response =
  | {
      status: STATUS.SUCCESSFUL;
      timelineEvents: Timeline[];
    }
  | {
      status: STATUS.FAILED;
      timelineEvents: null;
    };

export async function getTimelineEvents(): Promise<Response> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timelines`);

  const data: FetchTimelineResponse = await res.json();

  if (data.status === STATUS.FAILED) {
    return {
      timelineEvents: null,
      status: STATUS.FAILED,
    };
  }

  return {
    status: STATUS.SUCCESSFUL,
    timelineEvents: data.timelineEvents,
  };
}
