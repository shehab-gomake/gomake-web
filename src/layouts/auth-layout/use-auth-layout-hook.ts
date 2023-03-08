import { useEffect, useState } from "react";

const useAuthLayoutHook = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthCheckDone, setIsAuthCheckDone] = useState(false);

  useEffect(() => {
    setIsAuth(true);
    setTimeout(() => {
      setIsAuthCheckDone(true);
    }, 1000);
  }, []);

  return {
    isAuth,
    isAuthCheckDone,
  };
};
export { useAuthLayoutHook };
