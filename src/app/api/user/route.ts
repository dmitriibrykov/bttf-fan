import dbConnect from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { getUserFromServerSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { STATUS } from "@/types";

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const user = await getUserFromServerSession();

    if (!user?.email) {
      return Response.json(
        { status: STATUS.FAILED, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const email = user.email;

    if (!file) {
      const dbUpdateRes = await UserModel.updateOne({ email }, { name });

      return Response.json({
        status: STATUS.SUCCESSFUL,
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

    const dbUpdateRes = await UserModel.updateOne(
      { email },
      { image: newImgUrl },
    );

    return Response.json({
      status: STATUS.SUCCESSFUL,
      updatedUser: dbUpdateRes,
      imgSrc: newImgUrl,
    });
  } catch (e) {
    return Response.json(
      { status: STATUS.FAILED, error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await dbConnect();

    const user = await getUserFromServerSession();

    if (!user?.email) {
      return Response.json(
        { status: STATUS.FAILED, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const cloudinaryRes: { result: string } = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader.destroy(
          `avatars/${user.email}`,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
      },
    );

    if (cloudinaryRes.result === "ok") {
      await UserModel.updateOne(
        { email: user.email },
        { $set: { image: null } },
      );

      return Response.json({
        status: STATUS.SUCCESSFUL,
      });
    } else {
      return Response.json(
        {
          status: STATUS.FAILED,
          error:
            cloudinaryRes.result === "not found"
              ? "There is no profile image"
              : "Image was not deleted",
          res: cloudinaryRes,
        },
        { status: 500 },
      );
    }
  } catch (e) {
    return Response.json(
      {
        status: STATUS.FAILED,
        error: (e as Error).message,
      },
      { status: 500 },
    );
  }
}
