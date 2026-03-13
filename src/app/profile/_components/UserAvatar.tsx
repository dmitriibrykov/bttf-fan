"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { AvatarCropper } from "./AvatarCropper";
import { useSession } from "next-auth/react";

type Props = {
  imgSrc: string;
  setImgSrc: (imgSrc: string) => void;
};

export function UserAvatar({ imgSrc, setImgSrc }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | undefined>();

  const { data } = useSession();

  function closeDialog() {
    setIsOpen(false);
    setRawPhotoSrc(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function savePhoto(img: string) {
    setImgSrc(img);
    setRawPhotoSrc(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsOpen(false);
  }

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setRawPhotoSrc(fileURL);
      setIsOpen(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {(imgSrc || data?.user?.image) && (
        <img
          src={imgSrc || data!.user!.image!}
          alt="avatar"
          className="h-24 w-24 rounded-full border-2 border-primary object-cover"
        />
      )}
      <Button
        onClick={handleClick}
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
        <DialogContent>
          <DialogTitle>Crop your photo</DialogTitle>
          <DialogDescription></DialogDescription>
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
