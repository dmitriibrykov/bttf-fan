import { CommentLike } from "@/models/CommentLike";
import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

export async function likeOrRemoveLike(
  commentId: string,
): Promise<ResponseFailed | (ResponseSuccessfulBase & { like?: CommentLike })> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments/likes`,
    {
      method: "POST",
      body: JSON.stringify({
        commentId,
      }),
    },
  );

  const response = await res.json();

  return response;
}
