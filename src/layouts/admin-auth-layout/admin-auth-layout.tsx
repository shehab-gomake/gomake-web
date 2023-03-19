import { WaitingAuth } from "@/widgets";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";

const AdminAuthLayout = ({ children }: IAuthLayout) => {
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
      navigate("/admin/login");
      return <></>;
    }
  } else {
    return <WaitingAuth />;
  }
};

export { AdminAuthLayout };
