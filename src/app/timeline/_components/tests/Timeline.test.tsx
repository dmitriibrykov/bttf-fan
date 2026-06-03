import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Timeline from "../Timeline";
import { server } from "@/lib/tests/server";
import { delay, http, HttpResponse } from "msw";
import { STATUS } from "@/types";

test("timeline renders with error when fetch returns empty array", async () => {
  server.use(
    http.get("http://localhost:3000/api/timelines", async () => {
      await delay(100);

      return HttpResponse.json({
        status: STATUS.SUCCESSFUL,
        timelineEvents: [],
      });
    }),
  );

  render(<Timeline />);

  const errorHeading = await screen.findByRole("heading", {
    name: /timelines were found/i,
  });
  expect(errorHeading).toBeInTheDocument();
});

test("timeline renders", async () => {
  render(<Timeline />);

  const timelineGs = await screen.findByRole("img", { name: /timeline/i });

  expect(timelineGs).toBeInTheDocument();
});
