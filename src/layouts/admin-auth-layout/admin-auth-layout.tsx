import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";

const AdminAuthLayout = ({ children }: IAuthLayout) => {
  const {} = useAuthLayoutHook();
  const { classes } = useStyle({isHover:null, navStatus:null});

  return (
    <div style={classes.container}>
      <LeftSideLayout />
      <div style={classes.rightContainer}>
        <div style={classes.headerContainer}>
          <HeaderWidget />
        </div>
        <div style={classes.bodyContainer}>{children}</div>
      </div>
    </div>
  );
};

export { AdminAuthLayout };
