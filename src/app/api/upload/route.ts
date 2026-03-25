import cloudinary from "@/lib/cloudinary";
import { STATUS } from "@/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return Response.json(
        { status: STATUS.FAILED, error: "No image was provided" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const res = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return Response.json({
      status: STATUS.SUCCESSFUL,
      url: (res as { secure_url: string }).secure_url,
    });
  } catch (e) {
    return Response.json({
      status: STATUS.FAILED,
      error: (e as Error).message,
    });
  }
}
