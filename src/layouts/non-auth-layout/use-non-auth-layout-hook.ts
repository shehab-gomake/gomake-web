import { useEffect, useState } from "react";

const useNonAuthLayoutHook = () => {
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
export { useNonAuthLayoutHook };
