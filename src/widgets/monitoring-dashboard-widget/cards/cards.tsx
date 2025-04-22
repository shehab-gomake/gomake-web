import { useStyle } from "./style";
import { DashboardCard } from "./card";
import { IStatisticValue } from "../interfaces";
import { GoMakeCurrency } from "../icons/gomake-currency";

const Cards = ({
  data,
  currUnit,
}: {
  data: IStatisticValue;
  currUnit: string;
}) => {
  const { classes } = useStyle();
  const colors = [
    "#4BC0C0",
    "#FF6384",
    "#9966FF",
    "#ff9f40",
    "#36a2eb",
    "#ffce56",
  ];

  const cardData = [
    {
      labelTranslationKey: "totalPrice",
      value: data?.totalPrice,
      unit: currUnit,
    },
    {
      labelTranslationKey: "totalCost",
      value: data.totalCost,
      unit: currUnit,
    },
    {
      labelTranslationKey: "totalProfit",
      value: data.totalProfit,
      unit: currUnit,
    },
    {
      labelTranslationKey: "successRate",
      value: data.successRate,
      unit: "%",
    },
    {
      labelTranslationKey: "totalActualCost",
      value: data.totalActualCost,
      unit: currUnit,
    },
  ];

  return (
    <div style={classes.container}>
      <div style={classes.statistics}>
        {cardData
          .filter((item) => item.value !== null && item.value !== undefined)
          .map((item, index) => {
            return (
              <DashboardCard
                key={item.labelTranslationKey}
                label={item.labelTranslationKey}
                value={item.value}
                bgColor={colors[index % colors.length]}
                unit={item?.unit}
              >
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
