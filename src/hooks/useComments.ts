import { useEffect, useState } from "react";
import { getComments } from "@/lib/api";
import { Comment } from "@/models/Comment";
import { STATUS } from "@/types";

type UseCommentPayload = {
  comments: Comment[] | null;
  status: STATUS;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useComments(characterId: string): UseCommentPayload {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComments = async () => {
    setStatus(STATUS.LOADING);

    const res = await getComments(characterId);

    if (res.status === STATUS.FAILED) setError(res.error);
    if (res.status === STATUS.SUCCESSFUL) setComments(res.comments);
    setStatus(res.status);
  };

  return {
    comments,
    status,
    error,
    refetch: fetchComments,
  };
}
