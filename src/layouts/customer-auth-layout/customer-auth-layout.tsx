import {IAuthLayout} from "./interfaces";
import {LeftSideLayout} from "./left-side";
import {useStyle} from "./style";
import {useAuthLayoutHook} from "./use-auth-layout-hook";
import {HeaderWidget} from "@/widgets/header";

const CustomerAuthLayout = ({children}: IAuthLayout) => {
    const {} = useAuthLayoutHook();
    const {clasess} = useStyle({isHover: false, navStatus: null});
    return (
        <div style={clasess.container}>
            <LeftSideLayout/>
            <div style={clasess.rightContainer}>
                <HeaderWidget/>
                <div style={clasess.bodyContainer}>{children}</div>
            </div>
        </div>
    );
};

export {CustomerAuthLayout};
