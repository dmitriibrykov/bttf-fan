import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/UserAvatar";
import { Comment } from "@/models/Comment";
import CommentActions from "./CommentActions";

type Props = {
  comment: Comment;
  refetch(): void;
};

export function SingleComment({ comment, refetch }: Props) {
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
          <CommentActions comment={comment} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}
