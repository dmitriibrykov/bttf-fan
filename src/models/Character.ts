import { Appearance } from "@/types/enums";
import mongoose from "mongoose";

type Base = {
  _id: string;
  name: string;
  imgSrc: string;
  actor: string;
  appearance: Appearance[];
};

export type Character = Base & {
  commentsCount: number;
};

const characterSchema = new mongoose.Schema<Base>({
  name: String,
  imgSrc: String,
  actor: String,
  appearance: [{ type: String, enum: Appearance }],
});

export const CharacterModel =
  mongoose.models.Character || mongoose.model("Character", characterSchema);
