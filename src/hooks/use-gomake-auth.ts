import { canAccessState } from "@/store/access";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCustomer } from "./use-customer";

const useGomakeAuth = () => {
  const { user, validate } = useCustomer();
  const [, setCanAccessvalue] = useRecoilState(canAccessState);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const check = useCallback(async () => {
    const canAccess = await validate();
    setCanAccessvalue(canAccess);
    setIsAuth(canAccess);
  }, [setIsAuth]);

  useEffect(() => {
    check();
  }, []);

  return { user, isAuth };
};

export { useGomakeAuth };
