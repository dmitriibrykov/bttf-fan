import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash-es";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useUserUpdate } from "@/hooks/useUserUpdate";
import { STATUS } from "@/types";

export function NameInput() {
  const [name, setName] = useState<string>("");
  const { data } = useSession();
  const { status, updateUserField } = useUserUpdate();

  useEffect(() => {
    if (data?.user) {
      if (!name && data.user.name) setName(data.user.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateName = useCallback(
    async (name: string) => {
      const res = await updateUserField(name);
      if (res.status === STATUS.FAILED) {
        toast.error(res.error);
      }
    },
    [updateUserField],
  );

  const updateNameRef = useRef(updateName);

  useEffect(() => {
    updateNameRef.current = updateName;
  }, [updateName]);

  const debouncedUpdate = useMemo(
    () => debounce((value: string) => updateNameRef.current(value), 2000),
    [],
  );

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!val.trim()) return;
    await debouncedUpdate(val);
  };

  return (
    <div className="flex flex-col justify-end gap-2">
      <p className="font-bold">Name</p>
      <input
        id="name"
        type="text"
        value={name ?? ""}
        onChange={handleNameChange}
        className="border-1 border-[#eb7010] rounded-sm p-2"
      />
      {status === STATUS.LOADING && (
        <div className="flex gap-2">
          <Spinner />
          <span className="text-foreground/70">Updating...</span>
        </div>
      )}
      {status === STATUS.SUCCESSFUL && (
        <span className="text-foreground/70">Name is updated!</span>
      )}
    </div>
  );
}
