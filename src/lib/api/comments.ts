import { Comment } from "@/models/Comment";
import { STATUS } from "@/types";

export const getComments = async (characterId: string): Promise<Comment[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?characterId=${characterId}`,
  );

  const { comments } = await res.json();

  return comments;
};

export const sendComment = async (
  characterId: string,
  comment: string,
): Promise<Comment | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        characterId,
        body: comment,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data;
  } catch {
    return null;
  }
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

  console.log(res);

  if (!res.ok) return { status: STATUS.FAILED, error: response.error };

  return { status: STATUS.SUCCESSFUL };
};
