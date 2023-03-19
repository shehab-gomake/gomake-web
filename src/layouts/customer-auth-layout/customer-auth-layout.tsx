import { WaitingAuth } from "@/widgets";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";

const CustomerAuthLayout = ({ children }: IAuthLayout) => {
  const { canAccess, navigate } = useAuthLayoutHook();
  const { clasess } = useStyle({});

  if (typeof canAccess === "boolean") {
    if (canAccess) {
      return (
        <div style={clasess.container}>
          <LeftSideLayout />
          <div style={clasess.rightContainer}>
            <div style={clasess.headerContainer}>Header</div>
            <div style={clasess.bodyContainer}>{children}</div>
          </div>
        </div>
      );
    } else {
      navigate("/login");
      return <></>;
    }
  } else {
    return <WaitingAuth />;
  }
};

export { CustomerAuthLayout };
