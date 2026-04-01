import { useState } from "react";
import { useSession } from "next-auth/react";
import { updateUser } from "@/lib/api";
import { STATUS } from "@/types";

type Payload = {
  status: STATUS;
  updateUserField(update: Blob | string): ReturnType<typeof updateUser>;
};

export function useUserUpdate(): Payload {
  const { update } = useSession();
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);

  const updateUserField = async (field: Blob | string) => {
    setStatus(STATUS.LOADING);

    const formData = new FormData();

    if (typeof field === "string") {
      formData.append("name", field);
    } else {
      formData.append("file", field, "avatar.jpg");
    }

    const res = await updateUser(formData);

    setStatus(res.status);

    if (res.status === STATUS.SUCCESSFUL) {
      await update();
      setTimeout(() => {
        setStatus(STATUS.IDLE);
      }, 3000);
    }

    return res;
  };

  return { status, updateUserField };
}
