import { userState } from "@/store/user";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCustomer } from "./use-customer";
import { useGomakeAxios } from "./use-gomake-axios";
import { useGomakeRouter } from "./use-gomake-router";

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
