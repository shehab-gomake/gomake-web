import { canAccessState } from "@/store/access";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCustomer } from "./use-customer";
import { getUserToken } from "@/services/storage-data";

const useGomakeAuth = (permissionEnumValue, allowAnonymous?: boolean) => {
  const { user, validate, isLanguageUpdated, getPrintHouseSetupSteps } =
    useCustomer(permissionEnumValue, allowAnonymous);

  const [, setCanAccessvalue] = useRecoilState(canAccessState);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    if (allowAnonymous) {
      if (!!getUserToken()) {
        await validate();
      }

      setCanAccessvalue(true);
      setIsAuth(true);
      return;
    }
    const canAccess = await validate();
    setCanAccessvalue(canAccess);
    setIsAuth(canAccess);

    await getPrintHouseSetupSteps();
  }, [setIsAuth]);

  useEffect(() => {
    check();
  }, []);

  return { user, isAuth, isLanguageUpdated };
};

export { useGomakeAuth };
