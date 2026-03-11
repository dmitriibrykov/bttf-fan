import { Appearance } from "@/types/enums";
import mongoose from "mongoose";

export type Character = {
  _id: string;
  name: string;
  imgSrc: string;
  appearance: Appearance[];
};

const characterSchema = new mongoose.Schema<Character>({
  name: String,
  imgSrc: String,
  appearance: [{ type: String, enum: Appearance }],
});

export const CharacterModel =
  mongoose.models.Character || mongoose.model("Character", characterSchema);
