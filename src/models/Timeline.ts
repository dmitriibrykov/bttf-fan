import mongoose from "mongoose";

export type Timeline = {
  year: 1885 | 1955 | 1985 | 2015;
  title: string;
  description: string;
  branch: "main" | "alternate";
  imgSrc: string;
  mainText: string;
};

const timelineSchema = new mongoose.Schema<Timeline>({
  year: { type: Number, enum: [1885, 1955, 1985, 2015] },
  branch: { type: String, enum: ["main", "alternate"] },
  title: String,
  description: String,
  imgSrc: String,
  mainText: String,
});

export const TimelineModel =
  mongoose.models.Timeline || mongoose.model("Timeline", timelineSchema);
