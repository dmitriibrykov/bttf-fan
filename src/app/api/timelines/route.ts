import dbConnect from "@/lib/mongodb";
import { TimelineModel } from "@/models/Timeline";

export async function GET() {
  await dbConnect();

  const timelineEvents = await TimelineModel.find().lean();

  return Response.json({ timelineEvents });
}
