type Props = {
  classes?: string;
  imgSrc?: string | null;
  name?: string | null;
};

export default function UserAvatar({ classes, imgSrc, name }: Props) {
  return imgSrc ? (
    <img
      src={imgSrc}
      alt="avatar"
      className={`h-[30px] w-[30px] ${classes} rounded-full`}
    />
  ) : (
    <div
      className={`${classes} bg-muted flex items-center justify-center text-xl font-bold`}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}
