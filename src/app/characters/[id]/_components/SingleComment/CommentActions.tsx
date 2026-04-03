import { Heart, Trash2 } from "lucide-react";
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
import { useSession } from "next-auth/react";
import { deleteComment, getCommentLikes, likeOrRemoveLike } from "@/lib/api";
import { STATUS } from "@/types";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CommentLike } from "@/models/CommentLike";

type Props = {
  comment: Comment;
  refetch(): void;
};

export default function CommentActions({ comment, refetch }: Props) {
  const { data: session, status } = useSession();
  const [isSending, setIsSending] = useState(false);
  const [commentLikes, setCommentLikes] = useState<CommentLike[] | null>(null);

  const userLiked = useMemo(
    () =>
      !!commentLikes?.find((like) => like._user_email === session?.user?.email),
    [commentLikes, session],
  );

  console.log(commentLikes);

  const fetchCommentLikes = useCallback(async () => {
    const res = await getCommentLikes(comment._id);

    if (res.status === STATUS.FAILED) {
      toast.error(res.error);
    } else {
      setCommentLikes(res.likes);
    }
  }, [comment._id]);

  useEffect(() => {
    fetchCommentLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeComment = async () => {
    const res = await deleteComment(comment._id);
    if (res.status === STATUS.SUCCESSFUL) {
      refetch();
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
        setCommentLikes((likes) => (likes ?? []).concat(res.like!));
      } else {
        setCommentLikes((likes) =>
          (likes ?? []).filter(
            (like) => like._user_email !== session?.user?.email,
          ),
        );
      }
    } else {
      toast.error(res.error);
    }

    setIsSending(false);
  };

  return status === "authenticated" ? (
    <div className="flex gap-2 items-center">
      <Heart
        className="cursor-pointer hover:opacity-80"
        fill={userLiked ? "red" : "none"}
        color={userLiked ? "red" : "white"}
        onClick={reactToComment}
      />
      {comment._user_email === session?.user?.email && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 className="cursor-pointer" />
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
              <AlertDialogCancel variant="secondary">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={removeComment}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  ) : null;
}
