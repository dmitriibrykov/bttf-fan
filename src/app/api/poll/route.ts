import { apiHandler } from "@/lib/apiHandler";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { PollResult, PollResultModel } from "@/models/PollResult";
import { STATUS } from "@/types";
import { aggregatePollResults } from "./aggregatePollResults";

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

  const results = aggregatePollResults(pollRes);

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
