import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import { adaptRight } from "@/utils/adapter";
import { useStyle } from "./style";
import { EStatus } from "@/shared";
import { formatValueWithUnit } from "@/utils/is-currency";
import { GrowthBadge } from "../growth-badge";

export interface IDashboardCard {
  label: string;
  value: string | number;
  bgColor: string;
  children?: JSX.Element;
  progressValue?: number;
  withProgressBar?: boolean;
  status?: EStatus;
  productionTime?: number;
  unit?: string;
  margin?: number;
  growth?: number | null;
}

const DashboardCard = ({
  label,
  value,
  bgColor,
  children,
  unit,
  margin,
  growth,
}: IDashboardCard) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const direction = t("direction");

  return (
    <Card style={classes.secContainer} variant={"outlined"}>
      <div
        style={{
          width: "3px",
          backgroundColor: bgColor,
          position: "absolute",
          top: "20px",
          bottom: "20px",
          ...adaptRight(direction, 0),
        }}
      />
      <Stack direction={"row"} gap={"10px"} padding={"10px"}>
        <div style={classes.iconWrapper}>
          <Stack
            width={"26px"}
            height={"26px"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={"6px"}
            border={`1px solid ${bgColor}`}
            bgcolor={bgColor + "40"}
          >
            {children}
          </Stack>
        </div>
        <Stack gap={"4px"}>
          <span style={classes.label}>{t(`dashboard.${label}`)}</span>
          <Stack gap={"2px"}>
            <div style={classes.value}>{formatValueWithUnit(value, unit)}</div>
            {label === "totalProfit" &&
              margin !== undefined &&
              margin !== null && (
                <div style={classes.marginLabel}>
                  {t("dashboard.profitMargin")}: {margin.toFixed(2)}%
                  {typeof growth === "number" && (
                    <GrowthBadge value={growth} />
                  )}
                </div>
              )}
            {typeof growth === "number" && (
              <GrowthBadge value={growth} />
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        textAlign={"center"}
      ></Stack>
    </Card>
  );
};

export { DashboardCard };
