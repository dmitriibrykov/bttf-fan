import mongoose from "mongoose";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { CommentModel } from "@/models/Comment";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get("characterId");

    const comments = await CommentModel.aggregate()
      .match({ _character_id: new mongoose.Types.ObjectId(characterId ?? "") })
      .lookup({
        from: "users",
        localField: "_user_email",
        foreignField: "email",
        as: "user",
      })
      .unwind({
        path: "$user",
        preserveNullAndEmptyArrays: true,
      })
      .project({
        "user.password": 0,
        "user.email": 0,
        "user._id": 0,
        "user.emailVerified": 0,
      })
      .sort({ createdAt: -1 });

    return Response.json({ comments });
  } catch (e) {
    return Response.json({ message: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { characterId, body } = await req.json();

  const res = await CommentModel.create({
    _character_id: new mongoose.Types.ObjectId(characterId),
    body,
    _user_email: user.email,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ res });
}
