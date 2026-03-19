"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getComments } from "@/lib/api";
import { Comment } from "@/models/Comment";
import { Separator } from "@/components/ui/separator";
import { SingleComment } from "./SingleComment";
import { AddNewComment } from "./AddNewComment";

type Props = {
  characterId: string;
};

export function Comments({ characterId }: Props) {
  const [comments, setComments] = useState<Comment[] | null>(null);

  const fetchComments = useCallback(async () => {
    await getComments(characterId).then(setComments);
  }, [characterId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="flex flex-col w-full mr-auto">
      <h2 className="mb-2">Comments Section</h2>
      {comments && comments.length > 0 && (
        <div className="flex flex-col gap-2 w-full md:min-w-[600px] md:w-fit">
          {comments.map((comment, i) => (
            <React.Fragment key={comment._id}>
              <SingleComment comment={comment} />
              {i < comments.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      )}
      <AddNewComment refetch={fetchComments} />
    </div>
  );
}
