import mongoose from "mongoose";
import { getUserFromServerSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { type Comment, CommentModel } from "@/models/Comment";
import { STATUS } from "@/types";

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

    return Response.json({ status: STATUS.SUCCESSFUL, comments });
  } catch (e) {
    return Response.json(
      { status: STATUS.FAILED, message: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
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
  } catch (e) {
    return Response.json({
      status: STATUS.FAILED,
      error: (e as Error).message,
    });
  }
}

export async function DELETE(req: Request) {
  try {
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
  } catch (e) {
    return Response.json(
      {
        status: STATUS.FAILED,
        error: (e as Error).message,
      },
      { status: 500 },
    );
  }
}
