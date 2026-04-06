import UserAvatar from "@/components/UserAvatar";
import { Comment } from "@/models/Comment";
import MainContent from "./MainContent";

type Props = {
  comment: Comment;
};

export function SingleComment({ comment }: Props) {
  return (
    <div className="flex gap-4 max-w-[800px]">
      <UserAvatar
        imgSrc={comment.user.image}
        name={comment.user.name}
        classes="h-[30px] w-[30px]"
      />
      <MainContent comment={comment} />
    </div>
  );
}
