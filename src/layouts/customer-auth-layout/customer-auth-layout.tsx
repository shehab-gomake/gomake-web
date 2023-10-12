import {IAuthLayout} from "./interfaces";
import {LeftSideLayout} from "./left-side";
import {useStyle} from "./style";
import {useAuthLayoutHook} from "./use-auth-layout-hook";
import {HeaderWidget} from "@/widgets/header";

const CustomerAuthLayout = ({children}: IAuthLayout) => {
    const {canAccess} = useAuthLayoutHook();
    const {clasess} = useStyle({isHover: false, navStatus: null});
    const handleScroll = (e) => {
        const scrollY = window.scrollY;
        const documentHeight = e.target.scrollHeight;
        const windowHeight = window.innerHeight;
        console.log('scroll', e.target.scrollHeight)
        console.log('client', e.target.clientHeight)
        console.log('offsetTop', e.target.offsetTop)
        console.log('windowHeight', windowHeight)
        console.log('client', e)

    };
    return (
        <div style={clasess.container}>
            {
                canAccess && <>
                    <LeftSideLayout/>
                    <div  style={clasess.rightContainer}>
                        <HeaderWidget/>
                        <div onScroll={handleScroll}   style={clasess.bodyContainer}>{children}</div>
                    </div>
                </>
            }
        </div>
    );
};

export {CustomerAuthLayout};
