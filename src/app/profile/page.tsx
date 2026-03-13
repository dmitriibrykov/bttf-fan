"use client";

import { useSession } from "next-auth/react";
import CharactersLoading from "../loading";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "./_components";

export default function Profile() {
  const { data, update, status } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState("");

  const isButtonDisabled = useMemo(
    () => name === data?.user?.name && imgSrc.length === 0,
    [data?.user?.name, imgSrc, name],
  );

  useEffect(() => {
    if (data?.user) {
      if (!name && data.user.name) setName(data.user.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleCancel = () => {
    setName(data?.user?.name ?? null);
    setImgSrc("");
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (name !== data?.user?.name) formData.append("name", name ?? "");
    if (!!imgSrc) {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      formData.append("file", blob, "avatar.jpg");
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      body: formData,
    });

    const resData = await res.json();

    if (resData.updatedUser.modifiedCount > 0) {
      if (resData.imgSrc) {
        await update({ name, image: resData.imgSrc });
      } else {
        await update({ name });
      }
      toast.success("Profile updated!");
    }
  };

  if (status === "loading" && !data) return <CharactersLoading />;

  return (
    <div className="w-screen h-auto grid justify-center">
      <h1 className="mb-16 text-center">Profile Settings</h1>
      <div className="grid gap-32 grid-cols-2">
        <div className="flex flex-col justify-end gap-2">
          <p>Name</p>
          <input
            id="name"
            type="text"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            className="border-1 border-[#eb7010] rounded-sm p-2"
          />
        </div>
        <UserAvatar imgSrc={imgSrc} setImgSrc={setImgSrc} />
      </div>
      <div className="mt-8 flex gap-16 w-full justify-center">
        <Button
          onClick={handleSave}
          className="w-[200px] h-[50px]"
          variant="secondary"
          disabled={isButtonDisabled}
        >
          Save
        </Button>
        <Button
          onClick={handleCancel}
          className="w-[200px] h-[50px]"
          variant="destructive"
          disabled={isButtonDisabled}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
