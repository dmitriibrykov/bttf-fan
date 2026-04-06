"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getComments, updateComment } from "@/lib/api";
import { Comment } from "@/models/Comment";
import { STATUS } from "@/types";

type CommentContextType = {
  comments: Comment[] | null;
  status: STATUS;
  error: string | null;
  isMore: boolean;
  fetchMore(skip?: number): Promise<void>;
  addNewComment(comment: Comment): void;
  editComment(commentId: string, body: string): Promise<void>;
  deleteComment(commentId: string): void;
};

export const CommentContext = createContext<CommentContextType | null>(null);

type Props = {
  characterId: string;
  children: ReactNode;
};

export function CommentContextProvider({ characterId, children }: Props) {
  const hasFetched = useRef(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isMore, setIsMore] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

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

  const editComment = async (commentId: string, body: string) => {
    const res = await updateComment(commentId, body);

    if (res.status === STATUS.SUCCESSFUL) {
      setComments((comments) => {
        const comm = (comments ?? []).find(
          (comment) => comment._id === commentId,
        );
        if (comm) {
          comm.body = body;
        }
        return comments;
      });
    }
  };

  const addNewComment = (comment: Comment) => {
    setComments((comments) => [comment].concat(comments ?? []));
  };

  const deleteComment = async (commentId: string) => {
    setComments((comments ?? []).filter((c) => c._id !== commentId));
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
        editComment,
        deleteComment,
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
