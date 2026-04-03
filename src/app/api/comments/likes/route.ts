import mongoose from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { CommentLikeModel } from "@/models/CommentLike";
import { STATUS } from "@/types";

export const GET = apiHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");

  const likes = await CommentLikeModel.find({ _comment_id: commentId })
    .sort({
      createdAt: 1,
    })
    .lean();

  return Response.json({ status: STATUS.SUCCESSFUL, likes });
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await getUserFromServerSession();

    if (!user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await req.json();

    const like = await CommentLikeModel.findOne({
      _comment_id: commentId,
      _user_email: user.email,
    });

    console.log(like);

    if (like) {
      await CommentLikeModel.deleteOne({ _id: like._id });

      return Response.json({ status: STATUS.SUCCESSFUL });
    } else {
      const newLike = await CommentLikeModel.create({
        _comment_id: new mongoose.Types.ObjectId(commentId),
        _user_email: user.email,
        createdAt: new Date().toISOString(),
      });

      return Response.json({ status: STATUS.SUCCESSFUL, like: newLike });
    }
  } catch (e) {
    return Response.json({
      status: STATUS.FAILED,
      error: (e as Error).message,
    });
  }
}
