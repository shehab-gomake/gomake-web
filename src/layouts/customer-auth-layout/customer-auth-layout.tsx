import { canAccessState } from "@/store/access";
import { WaitingAuth } from "@/widgets";
import { useRecoilState, useRecoilValue } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";

const CustomerAuthLayout = ({ children }: IAuthLayout) => {
  const {} = useAuthLayoutHook();
  const { clasess } = useStyle({isHover:false,navStatus:null});
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

export { CustomerAuthLayout };
