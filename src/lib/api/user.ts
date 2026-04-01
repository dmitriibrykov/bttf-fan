import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

export async function updateUser(data: FormData): Promise<
  | ResponseFailed
  | (ResponseSuccessfulBase & {
      updatedUser: {
        modifiedCount: number;
      };
      imgSrc: string;
    })
> {
  const res = await fetch("/api/user", {
    method: "PATCH",
    body: data,
  });

  return await res.json();
}

export async function deleteImage(): Promise<
  ResponseFailed | ResponseSuccessfulBase
> {
  const res = await fetch("/api/user", {
    method: "DELETE",
  });

  return await res.json();
}
