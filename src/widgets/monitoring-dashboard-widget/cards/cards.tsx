import { useStyle } from "./style";
import { DashboardCard } from "./card";
import { IStatisticValue } from "../interfaces";
import { GoMakeCurrency } from "../icons/gomake-currency";

const Cards = ({ data }: { data: IStatisticValue }) => {
  const { classes } = useStyle();

  const colors = [
    "#4BC0C0",
    "#FF6384",
    // "#FFCE56"
    "#9966FF",
  ];

  const cardData = [
    {
      labelTranslationKey: "totalCost",
      value: data.totalCost,
    },
    {
      labelTranslationKey: "totalPrice",
      value: data?.totalPrice,
    },
    {
      labelTranslationKey: "totalProfit",
      value: data.totalProfit,
    },
  ];

  return (
    <div style={classes.container}>
      <div style={classes.statistics}>
        {cardData.map((item, index) => {
          return (
            <DashboardCard
              key={item.labelTranslationKey}
              label={item.labelTranslationKey}
              value={item.value}
              bgColor={colors[index % colors.length]}
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
