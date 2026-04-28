import { PollTotalResult } from "@/app/api/poll/route";
import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

type Payload =
  | ResponseFailed
  | (ResponseSuccessfulBase & {
      meParticipated: boolean;
      results: PollTotalResult;
    });

export const getPollResult = async (): Promise<Payload> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poll`);

  const data = await res.json();

  return data;
};
