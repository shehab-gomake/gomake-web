import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { IDashboardWidget } from "./interfaces";
import { GaussianChart } from "@/pages-components/gussian-chart/gussian-chart";
import { DashboardDates } from "./dates";
import { DashboardChart } from "./charts/chart";

const MonitoringDashboardWidget = ({}: IDashboardWidget) => {
  const { classes } = useStyle();
  // const { statistics, setStatistics } = useMonitoringDashboard();

  // useEffect(() => {
  //   setStatistics(null);
  // }, []);

  const statistics = {
    totalPrice: 57384.398,
    totalCost: 8595.29,
    totalProfit: 48789.108,
  };

  return (
    <div style={classes.container}>
      <DashboardDates />
      {statistics ? (
        <Cards data={statistics} />
      ) : (
        <Stack style={{ ...classes.SkeletonCardsContainer }} gap={"15px"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {new Array(6).fill(null).map((_) => (
              <Skeleton
                variant="rectangular"
                width={215}
                height={80}
                style={{ borderRadius: 16 }}
              />
            ))}
          </Stack>
        </Stack>
      )}
      <Stack style={{ height: "100%" }}>
        {true ? (
          // <GaussianChart />
          <DashboardChart />
        ) : (
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={400}
            style={{ borderRadius: 16 }}
          />
        )}
      </Stack>
    </div>
  );
};
export { MonitoringDashboardWidget };
