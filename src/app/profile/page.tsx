"use client";

import { useSession } from "next-auth/react";
import CharactersLoading from "../loading";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { data, update, status } = useSession();
  const [name, setName] = useState<string | null>(null);

  console.log(data);

  useEffect(() => {
    console.log(data);
    if (data?.user) {
      if (!name && data.user.name) setName(data.user.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = async () => {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: data?.user?.email }),
    });

    const resData = await res.json();

    if (resData.updatedUser.modifiedCount > 0) {
      await update({ name });
      toast.success("Profile updated!");
    }
  };

  if (status === "loading" && !data) return <CharactersLoading />;

  return (
    <div className="w-screen h-auto grid justify-center">
      <h1 className="mb-8">Profile Settings</h1>
      <div>
        <p>Name</p>
        <input
          type="text"
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          className="border-1 border-[#eb7010] rounded-sm p-2"
        />
      </div>
      <Button
        onClick={handleSave}
        className="mt-8"
        variant="secondary"
        disabled={name === data?.user?.name}
      >
        Save
      </Button>
    </div>
  );
}
