import { PollTotalResult } from "@/app/api/poll/route";
import { PollResult } from "@/models/PollResult";
import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

type Payload =
  | ResponseFailed
  | (ResponseSuccessfulBase & {
      meParticipated: PollResult | null;
      results: PollTotalResult[];
    });

export const getPollResult = async (): Promise<Payload> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poll`);

  const data = await res.json();

  return data;
};

export const savePoll = async (
  answers: number[],
): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { poll: PollResult })
> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poll`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();

  return data;
};
