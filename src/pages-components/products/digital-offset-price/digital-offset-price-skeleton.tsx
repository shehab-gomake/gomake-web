import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const PriceListPageSkeletonWidget = ({ isMobileScreen }) => {
  const { clasess } = useStyle({ isMobileScreen });

  return (
    <div style={clasess.skeletonContainer}>
      {/* Skeleton for the Title */}
      <Skeleton
        variant="text"
        width={isMobileScreen ? "80%" : 300}
        height={40}
      />

      {/* Skeleton for the Tabs */}
      <div style={clasess.tabsContainerSkeleton}>
        <Skeleton
          variant="rectangular"
          width={isMobileScreen ? "30%" : 150}
          height={35}
        />
        <Skeleton
          variant="rectangular"
          width={isMobileScreen ? "30%" : 150}
          height={35}
        />
        <Skeleton
          variant="rectangular"
          width={isMobileScreen ? "30%" : 150}
          height={35}
        />
      </div>

      {/* Skeleton for the Section with parameters */}
      <div style={clasess.sectionsContainer}>
        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>

        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>

        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>

        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>

        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>

        <Skeleton
          variant="text"
          width={isMobileScreen ? "70%" : 250}
          height={40}
          style={{ marginBottom: 20 }}
        />
        <div style={clasess.tabsContainerSkeleton}>
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width={isMobileScreen ? "45%" : 200}
            height={40}
          />
        </div>
      </div>

      {/* Skeleton for the Right Side Widget */}
      {!isMobileScreen && (
        <div style={clasess.rightSideMainContainerSkelton}>
          <Skeleton
            variant="rectangular"
            width={300}
            height={180}
            style={{ marginBottom: 40 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <Skeleton variant="rectangular" width={140} height={25} />
            <Skeleton variant="rectangular" width={140} height={25} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <Skeleton variant="rectangular" width={140} height={25} />
            <Skeleton variant="rectangular" width={140} height={25} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <Skeleton variant="rectangular" width={140} height={25} />
            <Skeleton variant="rectangular" width={140} height={25} />
          </div>
          <Skeleton
            variant="rectangular"
            width={300}
            height={250}
            style={{ marginTop: 40 }}
          />
        </div>
      )}
    </div>
  );
};

export { PriceListPageSkeletonWidget };
