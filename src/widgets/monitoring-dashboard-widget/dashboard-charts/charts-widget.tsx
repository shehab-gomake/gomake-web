import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { ArrowDownNewIcon, SettingNewIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useChartsWidget } from "./use-charts-widget";
import {BarChartComponent} from "@/components/gomake-charts/bar-chart";
import {PieChartComponent} from "@/components/gomake-charts/pie-chart";
import SalesLineChart from "@/widgets/monitoring-dashboard-widget/dashboard-charts/components/sales-line-chart";
import AddCostModal from "@/widgets/monitoring-dashboard-widget/dashboard-charts/components/add-cost-modal";

type SalesChartWidgetProps = {
  salesItems: any;
  agentChartData: any;
  productTypeChartData: any;
  getSalesChartRoute: any;
  filters: any;
};

const ChartsWidget = ({
  salesItems,
  agentChartData,
  productTypeChartData,
  getSalesChartRoute,
  filters,
}: SalesChartWidgetProps) => {
  const { classes } = useStyle();
  const {
    t,
    anchorElSetting,
    openSetting,
    handleOpen,
    handleCloseSetting,
    isModalOpen,
    inputValue,
    setInputValue,
    modalType,
    openModal,
    closeModal,
  } = useChartsWidget();

  const handleAddValue = async () => {
    try {
      const amount = parseFloat(inputValue);
      if (isNaN(amount)) return;

      if (modalType === "actual") {
        await getSalesChartRoute(filters, { actualCost: amount });
      } else if (modalType === "target") {
        await getSalesChartRoute(filters, { target: amount });
      }

      closeModal();
    } catch (error) {
      console.error("Error adding value", error);
    }
  };

  return (
    <div style={classes.secSubContainer}>
      {salesItems?.length > 0 ? (
        <Stack
          direction="column"
          spacing={2}
          sx={{ flex: 2, minWidth: "300px", maxWidth: "65vw" }}
        >
          <Stack direction="row" justifyContent={"space-between"}>
            <h3 style={classes.labelStyle}>{t("dashboard.salesChartTitle")}</h3>
            <GomakePrimaryButton
              style={classes.settingBtn}
              leftIcon={<SettingNewIcon color="#182230" />}
              rightIcon={<ArrowDownNewIcon color="#182230" />}
              onClick={handleOpen}
            />
            <GoMakeMenu
              handleClose={handleCloseSetting}
              open={openSetting}
              anchorEl={anchorElSetting}
            >
              <div style={classes.menuContainer}>
                <MenuItem onClick={() => openModal("actual")}>
                  <div style={classes.menuItemReviewContainer}>
                    {t("dashboard.addActualCost")}
                  </div>
                </MenuItem>
                <MenuItem onClick={() => openModal("target")}>
                  <div style={classes.menuItemReviewContainer}>
                    {t("dashboard.addTarget")}
                  </div>
                </MenuItem>
              </div>
            </GoMakeMenu>
          </Stack>
          <SalesLineChart
            salesItems={salesItems}
            yKeys={["totalPrice", "totalCost", "actualCost", "target"]}
          />
        </Stack>
      ) : (
        <Skeleton width={"66%"} height={"100%"} variant="rectangular" />
      )}
      <div style={classes.piesContainer}>
        {productTypeChartData?.length > 0 ? (
          <BarChartComponent
            chartData={productTypeChartData}
            chartTitle={t("products.profits.exceptions.productType")}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width={300}
            height={300}
            style={{ marginBottom: 16 }}
          />
        )}

        {agentChartData?.length > 0 ? (
          <PieChartComponent
            chartData={agentChartData}
            chartTitle={t("dashboard.agents")}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width={300}
            height={300}
            style={{ marginBottom: 16 }}
          />
        )}
      </div>
      <AddCostModal
        open={isModalOpen}
        onClose={closeModal}
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleAddValue}
        type={modalType}
      />
    </div>
  );
};
export { ChartsWidget };
