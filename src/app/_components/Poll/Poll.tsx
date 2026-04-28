"use client";

import { useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pollData } from "@/constants/poll";
import { Button } from "@/components/ui/button";

import "swiper/css";

type Props = {
  closePoll(): void;
};

export default function Poll({ closePoll }: Props) {
  const [isAlert, setIsAlert] = useState(false);
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionIndex: number]: number }>(
    {},
  );

  const totalQuestions = pollData.questions.length;

  const selectAnswer = (qIdx: number, aIdx: number) => {
    setAnswers((answers) => ({
      ...answers,
      [qIdx]: aIdx,
    }));
  };

  return (
    <>
      <div className="fixed z-2 inset-0 m-auto bg-white max-w-[500px] w-fit h-fit text-muted px-8 py-4 rounded-md">
        <Swiper
          onSwiper={setSwiper}
          allowTouchMove={false}
          initialSlide={activeIndex}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          slidesPerView={1}
          className="w-[100%]"
        >
          {pollData.questions.map((question, questionIdx) => (
            <SwiperSlide key={question.question} className="w-fit">
              <h2 className="mb-4">{question.question}</h2>
              <div className="flex flex-col gap-1">
                {question.options.map((option, optionIdx) => (
                  <div key={option} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      onChange={() => selectAnswer(questionIdx, optionIdx)}
                      checked={answers[questionIdx] === optionIdx}
                      className="cursor-pointer"
                    />
                    <span className="text-md font-bold">{option}</span>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center items-center">
          <p className="font-bold">
            Question {activeIndex + 1} / {pollData.questions.length}
          </p>
        </div>
        <div className="w-full flex gap-4 justify-center mt-8">
          {activeIndex > 0 && (
            <Button
              onClick={() => swiper?.slidePrev()}
              className="w-[200px] h-[50px] rounded-md mr-auto"
              variant="secondary"
            >
              Previous Question
            </Button>
          )}
          {activeIndex < totalQuestions - 1 && (
            <Button
              onClick={() => swiper?.slideNext()}
              className="w-[200px] h-[50px] rounded-md ml-auto"
              variant="secondary"
            >
              Next Question
            </Button>
          )}
          {activeIndex === totalQuestions - 1 && (
            <Button className="w-[200px] h-[50px] rounded-md ml-auto">
              Submit
            </Button>
          )}
        </div>
      </div>
      <div
        className="fixed z-1 w-[100vw] h-[100vh] left-0 top-0 bg-black/70"
        onClick={() => setIsAlert(true)}
      />
      <AlertDialog open={isAlert} onOpenChange={(isOpen) => setIsAlert(isOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to close the poll?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Results will not be saved!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Continue</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={closePoll}>
              Close Poll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
