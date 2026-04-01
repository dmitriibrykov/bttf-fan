"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AvatarCropper } from "./AvatarCropper";
import UserAvatar from "@/components/UserAvatar";
import { useUserUpdate } from "@/hooks/useUserUpdate";
import { STATUS } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { CircleX } from "lucide-react";
import { deleteImage } from "@/lib/api";
import { toast } from "sonner";

export function ProfilePicture() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | undefined>();

  const { data, update } = useSession();
  const { status, updateUserField } = useUserUpdate();

  function closeDialog() {
    setIsOpen(false);
    if (rawPhotoSrc) URL.revokeObjectURL(rawPhotoSrc);
    setRawPhotoSrc(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deletePhoto() {
    setIsDeleting(true);

    const res = await deleteImage();

    if (res.status === STATUS.SUCCESSFUL) {
      await update({ image: null });
    } else {
      toast.error(res.error);
    }

    setIsDeleting(false);
  }

  async function savePhoto(img: string) {
    setIsOpen(false);
    if (rawPhotoSrc) URL.revokeObjectURL(rawPhotoSrc);
    setRawPhotoSrc(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const response = await fetch(img);
    const blob = await response.blob();
    await updateUserField(blob);
  }

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (rawPhotoSrc) URL.revokeObjectURL(rawPhotoSrc);
      const fileURL = URL.createObjectURL(file);
      setRawPhotoSrc(fileURL);
      setIsOpen(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-24 w-24 group">
        <UserAvatar
          imgSrc={data?.user?.image}
          name={data?.user?.name}
          classes="h-full w-full"
        />
        {(status === STATUS.LOADING || isDeleting) && (
          <div className="absolute top-0 bottom-0 right-0 left-0 m-auto w-full h-full flex items-center justify-center bg-black/50 rounded-full">
            <Spinner className="h-12 w-12" />
          </div>
        )}
        {data?.user?.image && (
          <div
            className={`absolute -top-1 -right-1 cursor-pointer transition-opacity
      opacity-100 md:opacity-0 md:group-hover:opacity-100`}
          >
            <CircleX onClick={isDeleting ? undefined : deletePhoto} />
          </div>
        )}
      </div>
      <Button
        onClick={handleClick}
        disabled={status === STATUS.LOADING || isDeleting}
        className="h-[50px] px-[20px]"
        aria-label="gallery"
      >
        <span>Choose Photo from library</span>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Crop your photo</DialogTitle>
          <AvatarCropper
            imageSrc={rawPhotoSrc!}
            onComplete={savePhoto}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
