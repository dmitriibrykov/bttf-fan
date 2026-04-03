import { apiHandler } from "@/lib/apiHandler";
import dbConnect from "@/lib/mongodb";
import { TimelineModel } from "@/models/Timeline";
import { STATUS } from "@/types";

export const GET = apiHandler(async () => {
  await dbConnect();

  const timelineEvents = await TimelineModel.find().lean();

  return Response.json({ timelineEvents, status: STATUS.SUCCESSFUL });
});
