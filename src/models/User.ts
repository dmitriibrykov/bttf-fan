import mongoose from "mongoose";

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: null | boolean;
};

const userSchema = new mongoose.Schema<User>({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
});

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
