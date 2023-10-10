import { useRecoilValue, useSetRecoilState } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { navStatusState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";

const CustomerAuthLayout = ({ children }: IAuthLayout) => {
  const { canAccess } = useAuthLayoutHook();
  const { clasess } = useStyle({ isHover: false, navStatus: null });
  const setNavStatus = useSetRecoilState(navStatusState);
  const isHover = useRecoilValue(hoverStatusState);

  return (
    <div style={clasess.container}>
      {canAccess && (
        <>
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
            <div style={clasess.bodyContainer}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export { CustomerAuthLayout };
