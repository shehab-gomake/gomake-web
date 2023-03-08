import { INonAuthLayout } from "./interfaces";
import { useNonAuthLayoutHook } from "./use-non-auth-layout-hook";

const NonAuthLayout = ({ children }: INonAuthLayout) => {
  const { isAuth, isAuthCheckDone } = useNonAuthLayoutHook();

  if (isAuth) {
    return <div>{children}</div>;
  } else {
    if (isAuthCheckDone) {
      return <div>Not auth</div>;
    } else {
      return <div>Waiting auth....</div>;
    }
  }
};

export { NonAuthLayout };
