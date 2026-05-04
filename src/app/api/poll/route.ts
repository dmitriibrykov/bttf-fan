import { pollData } from "@/constants/poll";
import { apiHandler } from "@/lib/apiHandler";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { PollResult, PollResultModel } from "@/models/PollResult";
import { STATUS } from "@/types";

export type PollTotalResult = {
  questionIndex: number;
  options: {
    answerIndex: number;
    count: number;
    percentage: number;
  }[];
};

export const GET = apiHandler(async () => {
  await dbConnect();
  const user = await getUserFromServerSession();

  const [pollRes, myPoll] = (await Promise.all([
    PollResultModel.find({}).lean(),
    PollResultModel.findOne({ _user_email: user?.email }).lean(),
  ])) as [PollResult[], PollResult | null];

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

  return Response.json({
    status: STATUS.SUCCESSFUL,
    meParticipated: myPoll,
    results,
  });
});

export const POST = apiHandler(async (req) => {
  await dbConnect();
  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers } = await req.json();

  const res = await PollResultModel.create({
    _user_email: user.email,
    answers,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ status: STATUS.SUCCESSFUL, poll: res });
});
