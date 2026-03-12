import dbConnect from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { getUserFromServerSession } from "@/lib/auth";

export async function PATCH(request: Request) {
  await dbConnect();

  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, imgSrc, email } = await request.json();

  const res = await UserModel.updateOne({ email }, { name, image: imgSrc });

  return Response.json({ updatedUser: res });
}
