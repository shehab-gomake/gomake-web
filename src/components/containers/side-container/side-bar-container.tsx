import {ISideBarContainer} from "@/components/containers/interface";
import {useStyle} from "@/components/containers/side-container/style";

const SideBarContainer = ({
                              side,
                              children,
                              subHeader,
                              header,
                              sideDataTour,
                              bodyDataTour
                          }: ISideBarContainer) => {
    const {classes} = useStyle();
    return (
        <div style={classes.mainContainer}>
            {header && <h1 style={classes.header}>{header}</h1>}
            <div style={classes.container}>
                <div data-tour={sideDataTour} style={classes.sideList}>{side}</div>
                <div data-tour={bodyDataTour} style={classes.main}>
                    {subHeader && <h2 style={classes.subHeader}>{subHeader}</h2>}
                    <div style={{overflow: "scroll", maxHeight: "100%"}}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export {SideBarContainer};
