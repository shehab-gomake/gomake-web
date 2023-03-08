import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import { useEffect, useState } from "react";

const useAuthLayoutHook = () => {
  const { isAuth } = useGomakeAuth();
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof isAuth === "boolean") {
      setCanAccess(isAuth);
    }
  }, [isAuth]);

  return {
    canAccess,
    navigate,
  };
};
export { useAuthLayoutHook };
