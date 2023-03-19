import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "./use-admin";

const useGomakeAdminAuth = () => {
  const { admin, validate } = useAdmin();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const check = useCallback(async () => {
    setIsAuth(await validate());
  }, [setIsAuth]);

  useEffect(() => {
    check();
  }, []);

  return { admin, isAuth };
};

export { useGomakeAdminAuth };
