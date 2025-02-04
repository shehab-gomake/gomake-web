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
    allowAnonymous,
    disableHeaderSideMenu
}: IAuthLayout) => {
    const { canAccess } = useAuthLayoutHook(permissionEnumValue, allowAnonymous);
    const { classes } = useStyle({
        isHover: false,
        navStatus: null,
        customGap,
    });
    const setNavStatus = useSetRecoilState(navStatusState);
    const isHover = useRecoilValue(hoverStatusState);

    return (
        disableHeaderSideMenu ?
            <>
                {canAccess && <div style={{ ...classes.bodyContainer, backgroundColor: '#FFF' }}>{children}</div>}
            </> :
            <div style={classes.container}>
                <LeftSideLayout customGap={customGap} />
                <div
                    style={classes.rightContainer}
                    onMouseEnter={() => {
                        if (!isHover) {
                            setNavStatus({ isClosed: true });
                        }
                    }}
                >
                    <HeaderWidget />
                    {
                        canAccess && <div style={classes.bodyContainer}>
                            {children}
                        </div>
                    }
                </div>
            </div>
    );
};

export { CustomerAuthLayout };