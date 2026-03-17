"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getComments, sendComment } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Comment } from "@/models/Comment";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";

type Props = {
  characterId: string;
};

export function Comments({ characterId }: Props) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const fetchComments = useCallback(async () => {
    await getComments(characterId).then(setComments);
  }, [characterId]);

  console.log(comments);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const send = async () => {
    setIsSending(true);
    const res = await sendComment(characterId, comment);
    if (!res !== null) {
      await fetchComments();
    } else {
      toast.error(
        "Something wrong happened while sending your comment. Please, try later!",
      );
    }

    setComment("");
    setIsSending(false);
  };

  return (
    <div className="flex flex-col w-full mr-auto">
      <h2 className="mb-2">Comments Section</h2>
      {comments && comments.length > 0 && (
        <div className="flex flex-col gap-2 w-full md:min-w-[600px] md:w-fit">
          {comments.map((comment, i) => (
            <React.Fragment key={comment._id}>
              <div className="flex gap-4">
                <UserAvatar
                  imgSrc={comment.user.image}
                  name={comment.user.name}
                />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between w-full">
                    <p className="font-bold">{comment.user.name ?? "???"}</p>
                    <span className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p>{comment.body}</p>
                </div>
              </div>
              {i < comments.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex flex-col max-w-[500px] w-full">
        <p className="mt-4">Leave your comment:</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border-1 border-primary rounded-md mb-4 p-2 w-full min-h-[150px]"
        />
        <Button
          onClick={send}
          disabled={comment.length === 0}
          className="w-[300px] h-[50px] ml-auto"
        >
          {isSending && (
            <>
              <Spinner />
              <span>Sending...</span>
            </>
          )}
          {!isSending && <span>Send Comment</span>}
        </Button>
      </div>
    </div>
  );
}
