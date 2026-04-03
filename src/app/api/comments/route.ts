import mongoose from "mongoose";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { type Comment, CommentModel } from "@/models/Comment";
import { STATUS } from "@/types";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");

  const user = await getUserFromServerSession();
  const email = user?.email;

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
    .lookup({
      from: "commentlikes",
      localField: "_id",
      foreignField: "_comment_id",
      as: "likes",
    })
    .addFields({
      likesCount: {
        $size: "$likes",
      },
      likedByMe: {
        $in: [email, "$likes._user_email"],
      },
    })
    .project({
      "user.password": 0,
      "user.email": 0,
      "user._id": 0,
      "user.emailVerified": 0,
      likes: 0,
    })
    .sort({ createdAt: -1 });

  return Response.json({ status: STATUS.SUCCESSFUL, comments });
});

export const POST = apiHandler(async (req) => {
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

  return Response.json({ status: STATUS.SUCCESSFUL, comment: res });
});

export const DELETE = apiHandler(async (req) => {
  await dbConnect();

  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await req.json();

  const comment = await CommentModel.findById<Comment>(commentId);

  if (!comment || comment._user_email !== user.email) {
    return Response.json(
      {
        status: STATUS.FAILED,
        error: "Comment could be deleted only by its creator",
      },
      { status: 403 },
    );
  }

  await CommentModel.deleteOne({ _id: commentId });

  return Response.json({ status: STATUS.SUCCESSFUL });
});
