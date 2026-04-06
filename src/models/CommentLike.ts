import mongoose from "mongoose";

export type CommentLike = {
  _id: string;
  _comment_id: string;
  _user_email: string;
  createdAt: string;
  updatedAt: string;
};

const commentLikeSchema = new mongoose.Schema<CommentLike>(
  {
    _comment_id: mongoose.SchemaTypes.ObjectId,
    _user_email: String,
    createdAt: mongoose.SchemaTypes.Date,
  },
  {
    timestamps: true,
  },
);

commentLikeSchema.index({ _comment_id: 1, _user_email: 1 }, { unique: true });

export const CommentLikeModel =
  mongoose.models.commentLike ||
  mongoose.model("commentLike", commentLikeSchema);
