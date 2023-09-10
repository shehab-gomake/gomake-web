import {ISideBarContainer} from "@/components/containers/interface";
import {useStyle} from "@/components/containers/style";


const SideBarContainer = ({side, children, subHeader, header}: ISideBarContainer) => {
    const {classes} = useStyle();
    return (
        <div>
            {
                header && <h1 style={classes.header}>{header}</h1>
            }
            <div style={classes.container}>
                <div style={classes.sideList}>
                    {side}
                </div>
                <div style={classes.main}>
                    {subHeader && <h2 style={classes.subHeader}>{subHeader}</h2>}
                    <div style={{overflow: 'scroll', maxHeight: '100%'}}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export {SideBarContainer};