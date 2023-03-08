import { userState } from "@/store/user";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useGomakeAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const validate = useCallback(async () => {
    // if (true) {
    //   setTimeout(() => {
    //     setUser({
    //       email: "test@gmail.com",
    //       _id: "1234",
    //     });
    //     setIsAuth(true);
    //   }, 3000);
    // }
  }, [setUser, setIsAuth]);

  useEffect(() => {
    validate();
  }, []);

  return { user, isAuth };
};

export { useGomakeAuth };
