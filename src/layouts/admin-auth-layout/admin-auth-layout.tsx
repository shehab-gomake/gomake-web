import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";

const AdminAuthLayout = ({ children }: IAuthLayout) => {
  const {} = useAuthLayoutHook();
  const { clasess } = useStyle({isHover:null, navStatus:null});

  return (
    <div style={clasess.container}>
      <LeftSideLayout />
      <div style={clasess.rightContainer}>
        <div style={clasess.headerContainer}>
          <HeaderWidget />
        </div>
        <div style={clasess.bodyContainer}>{children}</div>
      </div>
    </div>
  );
};

export { AdminAuthLayout };
