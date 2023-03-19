import { useCallback, useEffect, useState } from "react";
import { useCustomer } from "./use-customer";

const useGomakeAuth = () => {
  const { user, validate } = useCustomer();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const check = useCallback(async () => {
    setIsAuth(await validate());
  }, [setIsAuth]);

  useEffect(() => {
    check();
  }, []);

  return { user, isAuth };
};

export { useGomakeAuth };
