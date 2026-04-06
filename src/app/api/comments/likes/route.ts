import mongoose from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { CommentLikeModel } from "@/models/CommentLike";
import { STATUS } from "@/types";

export const POST = apiHandler(async (req) => {
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
});
