import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Heart, Pencil, Reply, Trash2 } from "lucide-react";
import { Comment } from "@/models/Comment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteComment, likeOrRemoveLike } from "@/lib/api";
import { STATUS } from "@/types";
import { useCommentContext } from "../context";
import { useIsUserLoggedIn } from "@/hooks";

const ICON_SIZE = 16;

type Props = {
  comment: Comment;
  startEditing(): void;
  startReplying(): void;
};

export default function CommentActions({
  comment,
  startEditing,
  startReplying,
}: Props) {
  const { data: session } = useSession();
  const [isSending, setIsSending] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [likedByMe, setLikedByMe] = useState(comment.likedByMe);
  const { deleteComment: removeCommentFromCtx } = useCommentContext();
  const isLoggedIn = useIsUserLoggedIn();

  const formatter = new Intl.NumberFormat("en", { notation: "compact" });

  const removeComment = async () => {
    const res = await deleteComment(comment._id);
    if (res.status === STATUS.SUCCESSFUL) {
      removeCommentFromCtx(comment);
    } else {
      toast.error(res.error);
    }
  };

  const reactToComment = async () => {
    if (isSending) return;
    setIsSending(true);

    const res = await likeOrRemoveLike(comment._id);

    if (res.status === STATUS.SUCCESSFUL) {
      if (res.like) {
        setLikesCount((count) => count + 1);
        setLikedByMe(true);
      } else {
        setLikesCount((count) => count - 1);
        setLikedByMe(false);
      }
    } else {
      toast.error(res.error);
    }

    setIsSending(false);
  };

  return isLoggedIn ? (
    <div className="flex gap-2 justify-center items-center">
      <div className="flex items-center gap-1">
        <Heart
          className="cursor-pointer hover:opacity-80"
          size={ICON_SIZE}
          fill={likedByMe ? "red" : "none"}
          color={likedByMe ? "red" : "white"}
          onClick={reactToComment}
        />
        <p className="text-foreground/80">{formatter.format(likesCount)}</p>
      </div>
      {isLoggedIn && !comment._parent_id && (
        <Reply
          onClick={startReplying}
          className="cursor-pointer hover:opacity-75"
          size={ICON_SIZE}
        />
      )}
      {comment._user_email === session?.user?.email && (
        <>
          <Pencil
            onClick={startEditing}
            size={ICON_SIZE}
            className="cursor-pointer hover:opacity-75"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash2
                size={ICON_SIZE}
                className="cursor-pointer hover:opacity-75"
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this comment?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irrevertible
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={removeComment}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  ) : null;
}
