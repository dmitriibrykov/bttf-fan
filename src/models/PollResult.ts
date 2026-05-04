import mongoose from "mongoose";

export type PollResult = {
  _id: string;
  _user_email: string;
  answers: number[];
  createdAt: string;
  updatedAt: string;
};

const pollResultSchema = new mongoose.Schema<PollResult>(
  {
    _user_email: String,
    answers: [Number],
    createdAt: mongoose.SchemaTypes.Date,
    updatedAt: mongoose.SchemaTypes.Date,
  },
  {
    timestamps: true,
  },
);

export const PollResultModel =
  mongoose.models.PollResult || mongoose.model("PollResult", pollResultSchema);
