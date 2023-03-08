import { WaitingAuth } from "@/widgets";
import { IAuthLayout } from "./interfaces";
import { useAuthLayoutHook } from "./use-auth-layout-hook";

const AuthLayout = ({ children }: IAuthLayout) => {
  const { canAccess, navigate } = useAuthLayoutHook();

  if (typeof canAccess === "boolean") {
    if (canAccess) {
      return <div>{children}</div>;
    } else {
      navigate("/login");
      return <></>;
    }
  } else {
    return <WaitingAuth />;
  }
};

export { AuthLayout };
