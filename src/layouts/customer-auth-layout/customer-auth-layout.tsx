import { useRecoilValue, useSetRecoilState } from "recoil";
import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { navStatusState } from "@/store/nav-status";
import { hoverStatusState } from "@/store";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";
import {GoMakeModal} from "@/components";
import {useHtmlTour} from "@/layouts/customer-auth-layout/use-html-tour";

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
    const {htmlTour, openModal, onCloseModal} = useHtmlTour();
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
                <GoMakeModal insideStyle={{height: 'fit-content'}} openModal={openModal} onClose={onCloseModal} >
                    <div
                        dangerouslySetInnerHTML={{ __html: htmlTour}}
                        style={{padding: '10px' }}
                    />
                </GoMakeModal>
            </div>
    );
};

export { CustomerAuthLayout };