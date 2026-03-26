export default function CommentSkeleton() {
  return (
    <div className="flex gap-4 max-w-[800px] animate-pulse">
      {/* Аватарка */}
      <div className="h-[40px] w-[40px] min-w-[40px] rounded-full bg-muted" />
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-2 grow">
          {/* Имя */}
          <div className="h-4 w-24 rounded bg-muted" />
          {/* Текст комментария */}
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
        {/* Время */}
        <div className="h-3 w-16 rounded bg-muted min-w-fit" />
      </div>
    </div>
  );
}
