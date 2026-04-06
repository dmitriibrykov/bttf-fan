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
  const skipParam = searchParams.get("skip");
  const skip = typeof skipParam === "string" ? Number(skipParam) : 0;

  const user = await getUserFromServerSession();
  const email = user?.email;

  if (!characterId)
    return Response.json({
      status: STATUS.FAILED,
      error: "No character id provided",
    });

  const allCommentsCount = await CommentModel.countDocuments({
    _character_id: new mongoose.Types.ObjectId(characterId),
    _parent_id: { $exists: false },
  });

  const comments = await CommentModel.aggregate()
    .match({
      _character_id: new mongoose.Types.ObjectId(characterId),
      _parent_id: { $exists: false },
    })
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
    .lookup({
      from: "comments",
      let: { commentId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_parent_id", "$$commentId"] } } },
        {
          $lookup: {
            from: "users",
            localField: "_user_email",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "commentlikes",
            localField: "_id",
            foreignField: "_comment_id",
            as: "likes",
          },
        },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
            likedByMe: { $in: [email, "$likes._user_email"] },
          },
        },
        {
          $project: {
            "user.password": 0,
            "user.email": 0,
            "user._id": 0,
            "user.emailVerified": 0,
            likes: 0,
          },
        },
        { $sort: { createdAt: 1 } },
      ],
      as: "replies",
    })
    .project({
      "user.password": 0,
      "user.email": 0,
      "user._id": 0,
      "user.emailVerified": 0,
      likes: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(5);

  return Response.json({
    status: STATUS.SUCCESSFUL,
    comments,
    isMore: skip + comments.length < allCommentsCount ? true : false,
  });
});

export const POST = apiHandler(async (req) => {
  await dbConnect();
  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { characterId, body, parentId } = await req.json();

  const newComment: Partial<Comment> = {
    body,
    _user_email: user.email,
    createdAt: new Date().toISOString(),
  };

  if (parentId) newComment._parent_id = parentId;

  const res = await CommentModel.create({
    _character_id: new mongoose.Types.ObjectId(characterId),
    ...newComment,
  });

  return Response.json({ status: STATUS.SUCCESSFUL, comment: res });
});

export const PATCH = apiHandler(async (req) => {
  await dbConnect();
  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId, body } = await req.json();

  await CommentModel.updateOne(
    { _id: commentId },
    { body, updatedAt: new Date().toISOString },
  );

  const updatedComment = await CommentModel.findById(commentId);

  return Response.json({ status: STATUS.SUCCESSFUL, updatedComment });
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
