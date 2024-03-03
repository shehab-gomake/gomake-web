import {ISideBarContainer} from "@/components/containers/interface";
import {useStyle} from "@/components/containers/machines-container/style";

const MachinesContainer = ({side, children, subHeader, header, actions, sideAction, sideDataTour, bodyDataTour}: ISideBarContainer) => {
    const {classes} = useStyle();
    return (
        <div style={classes.gridContainer}>
            {
                header && <h1 style={classes.header}>{header}</h1>
            }
            <div data-tour={sideDataTour} style={classes.sideList}>
                {side}
            </div>
            {subHeader && <h2 style={classes.subHeader}>{subHeader}</h2>}
            <div data-tour={bodyDataTour} style={classes.main}>
                {children}
            </div>
            <div style={classes.sideActionFooter}>
                <div style={{backgroundColor: '#FFF', width: '100%', padding: 1, display: 'flex', height: '100%'}}>
                    {sideAction && sideAction}
                </div>
            </div>
            <div style={classes.footer}>
                {actions && actions}
            </div>
        </div>
    )
}

export {MachinesContainer};