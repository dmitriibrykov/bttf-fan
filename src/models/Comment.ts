import mongoose from "mongoose";

type Base = {
  _id: string;
  _character_id: string;
  _user_email: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = Base & {
  user: {
    name: string;
    image: string;
  };
};

const commentSchema = new mongoose.Schema<Base>(
  {
    _character_id: String,
    _user_email: String,
    body: String,
    createdAt: Date,
  },
  {
    timestamps: true,
  },
);

export const CommentModel =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
