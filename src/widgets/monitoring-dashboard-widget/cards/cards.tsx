import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useStyle } from "./style";
import { DashboardCard } from "./card";
import { IStatisticValue } from "../interfaces";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { GoMakeCurrency } from "../icons/gomake-currency";

const Cards = ({ data }: { data: IStatisticValue }) => {
  const { classes } = useStyle();
  const { successColor, warningColor } = useGomakeTheme();

  const colors = ["#9747FF", "#3DB2F9", successColor(500), warningColor(500)];

  const icons = [
    LocalOfferOutlinedIcon,
    LocalFireDepartmentOutlinedIcon,
    VerifiedOutlinedIcon,
    ShowChartIcon,
  ];

  const cardData = [
    {
      labelTranslationKey: "totalPrice",
      value: data?.totalPrice,
      color: "#9747FF",
      Icon: LocalOfferOutlinedIcon,
    },
    {
      labelTranslationKey: "totalCost",
      value: data.totalCost,
      color: "#3DB2F9",
      Icon: LocalFireDepartmentOutlinedIcon,
    },
    {
      labelTranslationKey: "totalProfit",
      value: data.totalProfit,
      color: successColor(500),
      Icon: VerifiedOutlinedIcon,
    },
  ];

  return (
    <div style={classes.container}>
      <div style={classes.statistics}>
        {cardData.map((item, index) => {
          //   const IconComponent = icons[index % icons.length];
          return (
            <DashboardCard
              key={item.labelTranslationKey}
              label={item.labelTranslationKey}
              value={item.value}
              bgColor={colors[index % colors.length]}
            >
              {/* <IconComponent
                style={{
                  width: 20,
                  height: 20,
                  color: colors[index % colors.length],
                }}
              /> */}

              <GoMakeCurrency
                color={colors[index % colors.length]}
                width={30}
                height={30}
                scale={1.3}
              />
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
};

export { Cards };
