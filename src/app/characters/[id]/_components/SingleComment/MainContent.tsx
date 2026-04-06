import { useState } from "react";
import CommentActions from "./CommentActions";
import { useCommentContext } from "../context";
import { Comment } from "@/models/Comment";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AddNewComment } from "../AddNewComment";

type Props = {
  comment: Comment;
};

export default function MainContent({ comment }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [body, setBody] = useState(comment.body);
  const { editComment } = useCommentContext();

  const cancelEdit = () => {
    setIsEditing(false);
    setBody(comment.body);
  };

  const edit = async () => {
    setIsUpdating(true);
    await editComment(comment._id, body);
    setIsUpdating(false);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-2 grow">
          <p className="font-bold">{comment.user.name ?? "???"}</p>
          {isEditing ? (
            <>
              <textarea
                id={`comment-${comment._id}`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border-1 border-primary rounded-md mb-4 p-2 w-full min-h-[150px]"
              />
              <div className="flex gap-4">
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  className="w-[150px] h-[50px]"
                >
                  Cancel editing
                </Button>
                <Button
                  onClick={edit}
                  disabled={body.length === 0}
                  className="w-[150px] h-[50px]"
                >
                  {isUpdating && (
                    <>
                      <Spinner />
                      <span>Sending...</span>
                    </>
                  )}
                  {!isUpdating && <span>Update</span>}
                </Button>
              </div>
            </>
          ) : (
            <p>{comment.body}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-fit">
          <p className="text-muted-foreground text-sm">
            <span>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="opacity-75"> (Edited)</span>
            )}
          </p>
          {!isEditing && (
            <CommentActions
              comment={comment}
              startEditing={() => setIsEditing(true)}
              startReplying={() => setIsReplying(true)}
            />
          )}
        </div>
      </div>
      {isReplying && (
        <AddNewComment
          parentId={comment._id}
          hide={() => setIsReplying(false)}
        />
      )}
    </>
  );
}
