import { CommentLike } from "@/models/CommentLike";
import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

export async function likeOrRemoveLike(
  commentId: string,
): Promise<ResponseFailed | (ResponseSuccessfulBase & { like?: CommentLike })> {
  const res = await fetch("/api/comments/likes", {
    method: "POST",
    body: JSON.stringify({
      commentId,
    }),
  });

  const response = await res.json();

  return response;
}

export async function getCommentLikes(
  commentId: string,
): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { likes: CommentLike[] })
> {
  const res = (
    await fetch(`/api/comments/likes?commentId=${commentId}`)
  ).json();

  return res;
}
