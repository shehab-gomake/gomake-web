import {IMachineLayoutProps} from "@/widgets/machines/components/layout/interface";
import {useStyle} from "@/widgets/machines/components/layout/style";

const MachineLayout = ({side, children, subHeader, header}: IMachineLayoutProps) => {
    const {classes} = useStyle();
    return (
        <div>
            <h1 style={classes.header}>{header}</h1>
            <div style={classes.container}>
                <div style={classes.sideList}>
                    {side}
                </div>
                <div style={classes.main}>
                    <h2 style={classes.subHeader}>{subHeader}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
}

export {MachineLayout}