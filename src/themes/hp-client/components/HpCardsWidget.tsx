import { HpCardComponent } from "./HpCardComponent";
import { useTranslation } from "react-i18next";
import { useCardWidget } from "@/pages-components/admin/home/widgets/cards-widget/use-cards-widget";
import { useRecoilValue } from "recoil";
import { homeReportsState } from "@/pages-components/quote-new/store/quote";
import { EStatisticsLabels } from "@/pages-components/quotes/enums";
import { useMemo } from "react";

const HpCardsWidget = () => {
  const { t } = useTranslation();
  const allReports = useRecoilValue<any>(homeReportsState);
  const {
    getCardIcon,
    getCardColor,
    getCardTextColor,
    getCardNumberColor,
    getCardBorder,
    getCardLabel,
  } = useCardWidget();

  const orderedCards = useMemo(() => {
    if (!allReports) return [];

    const cardMap = new Map(allReports.map((card: any) => [card?.key, card]));

    const order = [
      EStatisticsLabels.APPROVED,
      EStatisticsLabels.SUCCESS_RATE,
      EStatisticsLabels.PENDING,
      EStatisticsLabels.CANCELED,
      EStatisticsLabels.STUCK_JOBS,
      EStatisticsLabels.ORDERS,
      EStatisticsLabels.MONTHLY_PERFORMANCE,
    ];

    return order.map((key) => cardMap.get(key)).filter(Boolean) as any[];
  }, [allReports]);

  // HpCardComponent handles its own layout from Figma specs
  // We only need to pass dynamic background and border
  const getCardStyle = (cardKey: string) => ({
    background: getCardColor(cardKey),
    border: getCardBorder(cardKey),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "none",
        gap: "10px",
      }}
    >
      {/* Main Grid: Responsive layout - 2 columns on desktop, 1 column on mobile */}
      {/* Cards maintain 194px size and don't grow too large even with only 2 per row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(194px, max-content))",
          gap: "10px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {orderedCards.map((card) => (
          <HpCardComponent
            key={card?.key}
            style={getCardStyle(card?.key)}
            text={t(getCardLabel(card?.key))}
            number={
              !isNaN(card.value)
                ? `${card.value}${
                    card?.key === EStatisticsLabels.SUCCESS_RATE ||
                    card?.key === EStatisticsLabels.MONTHLY_PERFORMANCE
                      ? "%"
                      : ""
                  }`
                : card?.key === EStatisticsLabels.SUCCESS_RATE ||
                  card?.key === EStatisticsLabels.MONTHLY_PERFORMANCE
                ? "0.00%"
                : "0"
            }
            textColor={getCardTextColor(card?.key)}
            numberColor={getCardNumberColor(card?.key)}
            icon={getCardIcon(card?.key)}
          />
        ))}
      </div>
    </div>
  );
};

export { HpCardsWidget };
