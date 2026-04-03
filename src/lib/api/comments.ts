import { Comment } from "@/models/Comment";
import { ResponseFailed, ResponseSuccessfulBase, STATUS } from "@/types";

type GetCommentsResponse =
  | ResponseFailed
  | (ResponseSuccessfulBase & { comments: Comment[] });

export const getComments = async (
  characterId: string,
): Promise<GetCommentsResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?characterId=${characterId}`,
  );

  const data: GetCommentsResponse = await res.json();

  return data;
};

export const sendComment = async (
  characterId: string,
  comment: string,
): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { comment: Comment })
> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
    method: "POST",
    body: JSON.stringify({
      characterId,
      body: comment,
    }),
  });

  const data = await res.json();

  return data;
};

export const deleteComment = async (
  commentId: string,
): Promise<
  { status: STATUS.SUCCESSFUL } | { status: STATUS.FAILED; error: string }
> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
    method: "DELETE",
    body: JSON.stringify({
      commentId,
    }),
  });

  const response = await res.json();

  return response;
};
