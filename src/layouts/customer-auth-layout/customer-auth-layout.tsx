import { useRecoilValue, useSetRecoilState } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { navStatusState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";

const CustomerAuthLayout = ({
  children,
  permissionEnumValue,
  withGap = true,
}: IAuthLayout) => {
  const { canAccess } = useAuthLayoutHook(permissionEnumValue);
  const { clasess } = useStyle({
    isHover: false,
    navStatus: null,
    withGap,
  });

  const setNavStatus = useSetRecoilState(navStatusState);
  const isHover = useRecoilValue(hoverStatusState);
  return (
    <div style={clasess.container}>
      <LeftSideLayout />
      <div
        style={clasess.rightContainer}
        onMouseEnter={() => {
          if (!isHover) {
            setNavStatus({ isClosed: true });
          }
        }}
      >
        <HeaderWidget />
        {canAccess && <div style={clasess.bodyContainer}>{children}</div>}
      </div>
      <div></div>
    </div>
  );
};

export { CustomerAuthLayout };
