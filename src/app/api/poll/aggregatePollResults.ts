import { PollResult } from "@/models/PollResult";
import { PollTotalResult } from "./route";
import { pollData } from "@/constants/poll";

export function aggregatePollResults(pollRes: PollResult[]): PollTotalResult[] {
  const answers: Record<number, Record<number, number>> = {};

  pollData.questions.forEach((question, qIndex) => {
    question.options.forEach((_, optionIdx) => {
      if (!answers[qIndex]) answers[qIndex] = {};
      answers[qIndex][optionIdx] = 0;
    });
  });

  for (const poll of pollRes) {
    poll.answers.forEach((option, qIdx) => {
      if (answers[qIdx]?.[option] !== undefined) {
        answers[qIdx][option] += 1;
      }
    });
  }

  const total = pollRes.length;

  const results: PollTotalResult[] = [];

  Object.keys(answers).forEach((questionIdx) => {
    const qIndex = +questionIdx;
    results.push({
      questionIndex: +questionIdx,
      options: Object.keys(answers[qIndex]).map((option) => {
        const optionIdx = +option;
        const rawPercentage = (answers[qIndex][optionIdx] / total) * 100;
        return {
          answerIndex: optionIdx,
          count: answers[qIndex][optionIdx],
          percentage: Number.isNaN(rawPercentage)
            ? 0
            : Math.round(rawPercentage),
        };
      }),
    });
  });

  return results;
}
