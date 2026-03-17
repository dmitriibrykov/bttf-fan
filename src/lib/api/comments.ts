import { Comment } from "@/models/Comment";

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
