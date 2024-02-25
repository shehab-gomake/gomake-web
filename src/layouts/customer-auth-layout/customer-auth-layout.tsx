import { useRecoilValue, useSetRecoilState } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { navStatusState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";

const CustomerAuthLayout = ({
  children,
  permissionEnumValue,
  customGap = LAYOUT_DEFAULT_GAP,
  allowAnonymous
}: IAuthLayout) => {
  const { canAccess } = useAuthLayoutHook(permissionEnumValue, allowAnonymous);
  const { clasess } = useStyle({
    isHover: false,
    navStatus: null,
    customGap,
  });

  const setNavStatus = useSetRecoilState(navStatusState);
  const isHover = useRecoilValue(hoverStatusState);
  return (
    <div style={clasess.container}>
      {
        !allowAnonymous && <LeftSideLayout customGap={customGap} />
      }
      <div
        style={clasess.rightContainer}
        onMouseEnter={() => {
          if (!isHover) {
            setNavStatus({ isClosed: true });
          }
        }}
      >
        {!allowAnonymous && <HeaderWidget />}
        {canAccess && <div style={clasess.bodyContainer}>{children}</div>}
      </div>
      <div></div>
    </div>
  );
};

export { CustomerAuthLayout };
