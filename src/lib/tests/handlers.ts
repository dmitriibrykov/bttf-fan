import { STATUS } from "@/types";
import { delay, http, HttpResponse } from "msw";
import { timelineEvents } from "./mock";

export const handlers = [
  http.get("http://localhost:3000/api/timelines", async () => {
    await delay(100);

    return HttpResponse.json({
      status: STATUS.SUCCESSFUL,
      timelineEvents: timelineEvents,
    });
  }),
];
