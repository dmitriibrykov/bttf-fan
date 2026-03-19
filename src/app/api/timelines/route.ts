import dbConnect from "@/lib/mongodb";
import { TimelineModel } from "@/models/Timeline";
import { STATUS } from "@/types";

export async function GET() {
  try {
    await dbConnect();

    const timelineEvents = await TimelineModel.find().lean();

    return Response.json({ timelineEvents, status: STATUS.SUCCESSFUL });
  } catch (e) {
    return Response.json({
      error: (e as Error).message,
      status: STATUS.FAILED,
    });
  }
}
