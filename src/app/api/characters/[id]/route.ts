import dbConnect from "@/lib/mongodb";
import { CharacterModel } from "@/models/Character";
import { STATUS } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const { id } = await params;

  const character = await CharacterModel.findById(id).lean();

  if (!character) {
    return Response.json(
      { status: STATUS.FAILED, error: "Character not found" },
      { status: 404 },
    );
  }

  return Response.json({ status: STATUS.SUCCESSFUL, character });
}
