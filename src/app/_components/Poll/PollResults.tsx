"use client";

import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { getPollResult } from "@/lib/api";
import PollToggler from "./PollToggler";
import { STATUS } from "@/types";
import Error from "@/components/Error";
import { PollTotalResult } from "@/app/api/poll/route";
import { pollData } from "@/constants/poll";
import { Button } from "@/components/ui/button";
import { PollResult } from "@/models/PollResult";

import "swiper/css";

export function PollResults() {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PollTotalResult[]>([]);
  const [myPoll, setMyPoll] = useState<PollResult | null>(null);

  const getResults = useCallback(async () => {
    const res = await getPollResult();
    if (res.status === STATUS.FAILED) {
      setError(res.error);
    } else {
      setResults(res.results);
      setMyPoll(res.meParticipated);
    }
    setStatus(res.status);
  }, []);

  useEffect(() => {
    getResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === STATUS.FAILED) return <Error message={error!} />;

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
      <PollToggler
        meParticipated={status === STATUS.IDLE ? true : !!myPoll}
        refetch={getResults}
      />
      {results.length > 0 && (
        <div className="grow flex flex-col gap-4 overflow-hidden">
          <Swiper
            onSwiper={setSwiper}
            allowTouchMove={true}
            initialSlide={activeIndex}
            onActiveIndexChange={(s) => setActiveIndex(s.activeIndex)}
            slidesPerView={1}
            className="w-[100%] border rounded-xl border-primary"
          >
            {results.map((res) => {
              const currQuestion = pollData.questions[res.questionIndex];
              return (
                <SwiperSlide key={currQuestion.question} className="p-4 md:p-8">
                  <h2 className="mb-4">{currQuestion.question}</h2>
                  <div className="flex flex-col gap-2">
                    {res.options.map((option) => {
                      const isSelected =
                        option.answerIndex ===
                        myPoll?.answers[res.questionIndex];
                      return (
                        <div
                          key={option.answerIndex}
                          className="w-full flex flex-col"
                        >
                          <div
                            className={`flex gap-2 ${isSelected ? "text-primary" : "text-foreground"}`}
                          >
                            <p>{currQuestion.options[option.answerIndex]}</p>
                            <span>({option.percentage}%)</span>
                          </div>
                          <div
                            style={{
                              width:
                                option.percentage === 0
                                  ? "1px"
                                  : `${option.percentage}%`,
                            }}
                            className={`${
                              isSelected ? "bg-primary" : "bg-foreground"
                            } h-[10px] rounded-md`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex gap-8 w-full overflow-hidden justify-end">
            {activeIndex > 0 && (
              <Button
                onClick={() => swiper?.slidePrev()}
                className="max-w-[200px] grow h-[50px] rounded-md mr-auto"
                variant="secondary"
              >
                Previous Question
              </Button>
            )}
            {activeIndex < results.length - 1 && (
              <Button
                onClick={() => swiper?.slideNext()}
                className="max-w-[200px] grow h-[50px] rounded-md ml-auto"
                variant="secondary"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
