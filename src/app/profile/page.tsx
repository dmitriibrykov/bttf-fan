"use client";

import { useSession } from "next-auth/react";
import CharactersLoading from "../loading";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "./_components";
import { Spinner } from "@/components/ui/spinner";

export default function Profile() {
  const { data, update, status } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

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

    setIsSaving(false);
  };

  if (status === "loading" && !data) return <CharactersLoading />;

  return (
    <div className="w-screen h-auto flex flex-col items-center gap-4">
      <h1 className="text-center">Profile Settings</h1>
      <UserAvatar imgSrc={imgSrc} setImgSrc={setImgSrc} />
      <div className="flex flex-col justify-end gap-2">
        <p className="font-bold">Name</p>
        <input
          id="name"
          type="text"
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          className="border-1 border-[#eb7010] rounded-sm p-2"
        />
      </div>
      <div className="flex-col md:flex-row flex gap-4 mt-4 md:mt-16">
        <Button
          onClick={handleSave}
          className="w-[200px] h-[50px]"
          variant="default"
          disabled={isButtonDisabled}
        >
          {isSaving && (
            <>
              <Spinner />
              <span>Saving...</span>
            </>
          )}
          {!isSaving && <span>Save</span>}
        </Button>
        <Button
          onClick={handleCancel}
          className="w-[200px] h-[50px]"
          variant="outline"
          disabled={isButtonDisabled}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
