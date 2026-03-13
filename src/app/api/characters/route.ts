import dbConnect from "@/lib/mongodb";
import { CharacterModel } from "@/models/Character";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const characters = await CharacterModel.find(
    search ? { name: { $regex: search, $options: "i" } } : {},
  ).lean();

  return Response.json({ characters });
}
