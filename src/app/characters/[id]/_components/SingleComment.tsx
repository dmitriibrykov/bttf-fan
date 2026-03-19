import UserAvatar from "@/components/UserAvatar";
import { Comment } from "@/models/Comment";
import { formatDistanceToNow } from "date-fns";

type Props = {
  comment: Comment;
};

export function SingleComment({ comment }: Props) {
  return (
    <div className="flex gap-4">
      <UserAvatar imgSrc={comment.user.image} name={comment.user.name} />
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
  );
}
