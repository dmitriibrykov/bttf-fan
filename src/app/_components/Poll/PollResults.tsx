"use client";

import { getPollResult } from "@/lib/api";
import PollToggler from "./PollToggler";
import { STATUS } from "@/types";
import Error from "@/components/Error";
import { useEffect, useState } from "react";
import { PollTotalResult } from "@/app/api/poll/route";

export function PollResults() {
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PollTotalResult | null>(null);
  const [meParticipated, setMeParticipated] = useState(false);

  console.log(results);

  useEffect(() => {
    const getResults = async () => {
      const res = await getPollResult();
      if (res.status === STATUS.FAILED) {
        setError(res.error);
      } else {
        setResults(res.results);
        setMeParticipated(!!res.meParticipated);
      }
      setStatus(res.status);
    };

    getResults();
  }, []);

  if (status === STATUS.FAILED) return <Error message={error!} />;

  return (
    <div>
      <PollToggler meParticipated={!!meParticipated} />
    </div>
  );
}
