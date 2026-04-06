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
  deleteComment(comment: Comment): void;
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
      const comment = res.updatedComment;
      if (comment._parent_id) {
        const parentComment = (comments ?? []).find(
          (c) => c._id === comment._parent_id,
        );

        if (parentComment) {
          const updatedParent = {
            ...parentComment,
            replies: parentComment.replies.map((r) =>
              r._id === comment._id
                ? { ...r, body, updatedAt: comment.updatedAt }
                : r,
            ),
          };

          setComments((comments) =>
            comments!.map((c) => {
              if (c._id === parentComment._id) return updatedParent;
              return c;
            }),
          );
        }
      } else {
        setComments((comments) =>
          (comments ?? []).map((c) =>
            c._id === commentId
              ? { ...c, body, updatedAt: res.updatedComment.updatedAt }
              : c,
          ),
        );
      }
    }
  };

  const addNewComment = (comment: Comment) => {
    if (comment._parent_id) {
      const parentComment = (comments ?? []).find(
        (c) => c._id === comment._parent_id,
      );

      if (parentComment) {
        const newParent = {
          ...parentComment,
          replies: [...parentComment.replies, comment],
        };
        const updatedComments = comments!.map((c) => {
          if (c._id === newParent._id) return newParent;
          return c;
        });
        setComments(updatedComments);
      }
    } else {
      setComments((comments) => [comment].concat(comments ?? []));
    }
  };

  const deleteComment = async (comment: Comment) => {
    if (comment._parent_id) {
      const parentComm = comments!.find((c) => c._id === comment._parent_id);
      if (parentComm) {
        const clearedReplies = Array.from(
          parentComm.replies.filter((reply) => reply._id !== comment._id),
        );
        const updatedParent = { ...parentComm, replies: clearedReplies };
        setComments((comments) =>
          comments!.map((c) => (c._id === parentComm._id ? updatedParent : c)),
        );
      }
    } else {
      setComments((comments) =>
        (comments ?? []).filter((c) => c._id !== comment._id),
      );
    }
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
