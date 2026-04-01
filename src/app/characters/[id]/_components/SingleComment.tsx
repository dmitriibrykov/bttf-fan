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
import UserAvatar from "@/components/UserAvatar";
import { deleteComment } from "@/lib/api";
import { Comment } from "@/models/Comment";
import { STATUS } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Props = {
  comment: Comment;
  refetch(): void;
};

export function SingleComment({ comment, refetch }: Props) {
  const { data: session } = useSession();

  const removeComment = async () => {
    const res = await deleteComment(comment._id);
    if (res.status === STATUS.SUCCESSFUL) {
      refetch();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex gap-4 max-w-[800px]">
      <UserAvatar
        imgSrc={comment.user.image}
        name={comment.user.name}
        classes="h-[30px] w-[30px]"
      />
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-2 grow">
          <p className="font-bold">{comment.user.name ?? "???"}</p>
          <p>{comment.body}</p>
        </div>
        <div className="flex flex-col items-end gap-4 min-w-fit">
          <span className="text-muted-foreground text-sm">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
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
                  <AlertDialogCancel variant="secondary">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={removeComment}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
