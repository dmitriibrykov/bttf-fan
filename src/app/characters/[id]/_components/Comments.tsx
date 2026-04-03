"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SingleComment } from "./SingleComment";
import { AddNewComment } from "./AddNewComment";
import { STATUS } from "@/types";
import Error from "@/components/Error";
import CommentSkeleton from "./CommentSkeleton";
import { useCommentContext } from "./context";
import LoadMore from "./LoadMore";

export function Comments() {
  const { error, comments, status, fetchMore } = useCommentContext();

  if (status === STATUS.FAILED) return <Error message={error!} />;

  return (
    <div className="flex flex-col w-full mr-auto">
      <h2 className="mb-6">Comments</h2>
      {status === STATUS.LOADING &&
        !comments &&
        Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
      {comments && comments.length > 0 && (
        <div className="flex flex-col gap-2 w-full md:w-[800px]">
          {comments.map((comment, i) => (
            <React.Fragment key={comment._id}>
              <SingleComment comment={comment} refetch={fetchMore} />
              {i < comments.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      )}
      <LoadMore />
      <AddNewComment />
    </div>
  );
}
