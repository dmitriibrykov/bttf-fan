"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getComments } from "@/lib/api";
import { Comment } from "@/models/Comment";
import { STATUS } from "@/types";

type CommentContextType = {
  comments: Comment[] | null;
  status: STATUS;
  error: string | null;
  isMore: boolean;
  fetchMore(skip?: number): Promise<void>;
  addNewComment(comment: Comment): void;
};

export const CommentContext = createContext<CommentContextType | null>(null);

type Props = {
  characterId: string;
  children: ReactNode;
};

export function CommentContextProvider({ characterId, children }: Props) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isMore, setIsMore] = useState(true);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComments = async (skip: number = 0) => {
    setStatus(STATUS.LOADING);

    const res = await getComments(characterId, skip);

    if (res.status === STATUS.FAILED) setError(res.error);
    if (res.status === STATUS.SUCCESSFUL) {
      setComments((comments) => (comments ?? []).concat(res.comments));
      setIsMore(res.isMore);
    }

    setStatus(res.status);
  };

  const addNewComment = (comment: Comment) => {
    setComments((comments) => [comment].concat(comments ?? []));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        status,
        error,
        isMore,
        fetchMore: fetchComments,
        addNewComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => {
  const commentCtx = useContext(CommentContext);

  if (!commentCtx) throw new Error("Context is not defined");

  return commentCtx;
};
