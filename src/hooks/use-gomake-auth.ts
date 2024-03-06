import { canAccessState } from "@/store/access";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCustomer } from "./use-customer";

const useGomakeAuth = (permissionEnumValue,allowAnonymous?:boolean) => {

  const { user, validate } = useCustomer(permissionEnumValue,allowAnonymous);
  const [, setCanAccessvalue] = useRecoilState(canAccessState);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const check = useCallback(async () => {
    if(allowAnonymous){
      setCanAccessvalue(true);
      setIsAuth(true);
      return;
    }
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
