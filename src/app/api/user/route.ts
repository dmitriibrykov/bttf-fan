import dbConnect from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { getUserFromServerSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(request: Request) {
  await dbConnect();

  const user = await getUserFromServerSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const email = user.email;

  if (!file) {
    const dbUpdateRes = await UserModel.updateOne({ email }, { name });

    return Response.json({
      updatedUser: dbUpdateRes,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const cloudinaryRes = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: `avatars/${user.email}`, overwrite: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  const newImgUrl = (cloudinaryRes as { secure_url: string }).secure_url;

  const updates: { name?: string; image: string } = {
    image: newImgUrl,
  };

  if (name) updates.name = name;

  const dbUpdateRes = await UserModel.updateOne({ email }, updates);

  return Response.json({
    updatedUser: dbUpdateRes,
    imgSrc: newImgUrl,
  });
}
