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
import { PieChartComponent } from "@/components/charts/pie-chart";

const MonitoringDashboardWidget = ({}: IDashboardWidget) => {
  const { classes } = useStyle();
  const { t } = useMonitoringDashboard();

  // useEffect(() => {
  //   setStatistics(null);
  // }, []);

  const statistics = {
    totalPrice: 57384.398,
    totalCost: 8595.29,
    totalProfit: 48789.108,
  };

  const data = [
    {
      label: "paper",
      value: 37069.6,
    },
    {
      label: "Labels in rolls",
      value: 381.13,
    },
  ];

  const orderData = [
    { label: "Orders in production", value: 2 },
    { label: "Orders are ready but not delivered", value: 98 },
  ];

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
      {/* <Stack style={{ height: "100%" }}>
        {true ? (
          <GaussianChart />
        ) : (
          // <DashboardChart />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={400}
            style={{ borderRadius: 16 }}
          />
        )}
      </Stack> */}
      <PieChartComponent
        chartData={data}
        chartTitle={t("products.profits.exceptions.productType")}
      />
    </div>
  );
};
export { MonitoringDashboardWidget };
