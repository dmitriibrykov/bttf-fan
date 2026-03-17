import dbConnect from "@/lib/mongodb";
import { CharacterModel } from "@/models/Character";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const characters = await CharacterModel.aggregate()
    .match(search ? { name: { $regex: search, $options: "i" } } : {})
    .lookup({
      from: "comments",
      localField: "_id",
      foreignField: "_character_id",
      as: "comments",
    })
    .addFields({
      commentsCount: {
        $size: "$comments",
      },
    })
    .project({
      comments: 0,
    })
    .sort({ name: 1 })
    .exec();

  return Response.json({ characters });
}
