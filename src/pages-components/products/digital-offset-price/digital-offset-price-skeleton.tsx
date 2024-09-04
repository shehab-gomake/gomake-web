import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
const PriceListPageSkeletonWidget = () => {
    const { clasess } = useStyle();


    return (
        <div style={clasess.skeletonContainer}>
            {/* Skeleton for the Title */}
            <Skeleton variant="text" width={300} height={40} />

            {/* Skeleton for the Tabs */}
            <div style={clasess.tabsContainer}>
                <Skeleton variant="rectangular" width={150} height={35} />
                <Skeleton variant="rectangular" width={150} height={35} />
                <Skeleton variant="rectangular" width={150} height={35} />
            </div>

            {/* Skeleton for the Section with parameters */}
            <div style={clasess.sectionsContainer}>
                <Skeleton variant="text" width={200} height={40} />
                <div style={clasess.parametersContainer}>
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} style={{ marginBottom: 40 }} />
                </div>

                <Skeleton variant="text" width={200} height={40} />
                <div style={clasess.parametersContainer}>
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} style={{ marginBottom: 40 }} />
                </div>
                <Skeleton variant="text" width={200} height={40} />
                <div style={clasess.parametersContainer}>
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} style={{ marginBottom: 40 }} />
                </div>
                <Skeleton variant="text" width={200} height={40} />
                <div style={clasess.parametersContainer}>
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} style={{ marginBottom: 40 }} />
                </div>

                <Skeleton variant="text" width={200} height={40} />
                <div style={clasess.parametersContainer}>
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} />
                    <Skeleton variant="rectangular" width={220} height={40} style={{ marginBottom: 40 }} />
                </div>
            </div>

            {/* Skeleton for the Right Side Widget */}
            <div style={clasess.rightSideMainContainerSkelton}>
                <Skeleton variant="rectangular" width={300} height={180} style={{ marginBottom: 40 }} />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 20 }}>
                    <Skeleton variant="rectangular" width={140} height={25} />
                    <Skeleton variant="rectangular" width={140} height={25} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 20 }}>
                    <Skeleton variant="rectangular" width={140} height={25} />
                    <Skeleton variant="rectangular" width={140} height={25} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 20 }}>
                    <Skeleton variant="rectangular" width={140} height={25} />
                    <Skeleton variant="rectangular" width={140} height={25} />
                </div>
                <Skeleton variant="rectangular" width={300} height={250} style={{ marginTop: 40 }} />

            </div>
        </div>
    );
};

export { PriceListPageSkeletonWidget };
