import { IAuthLayout } from "./interfaces";
import { useAuthLayoutHook } from "./use-auth-layout-hook";

const AuthLayout = ({ children }: IAuthLayout) => {
  const { isAuth, isAuthCheckDone } = useAuthLayoutHook();

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

export { AuthLayout };
