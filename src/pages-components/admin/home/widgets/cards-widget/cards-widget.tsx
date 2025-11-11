import { CardComponent } from "@/pages-components/quotes/widgets/statistics-section/card";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useCardWidget } from "./use-cards-widget";
import { useRecoilValue } from "recoil";
import { homeReportsState } from "@/pages-components/quote-new/store/quote";
import { useTheme } from "@/contexts/theme/useTheme";

const CardsWidget = () => {
  const { getComponentOverride } = useTheme();

  // Check for theme-specific override component (e.g., HpCardsWidget)
  const OverrideComponent = getComponentOverride("CardsWidget");

  // If override exists (e.g., when hp-client theme is active), use it
  if (OverrideComponent) {
    return <OverrideComponent />;
  }

  // Otherwise, render the default CardsWidget layout
  return <DefaultCardsWidget />;
};

// Separate component for default layout to keep hooks unconditional
const DefaultCardsWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const allReports = useRecoilValue<any>(homeReportsState);
  const {
    getCardIcon,
    getCardColor,
    getCardTextColor,
    getCardBorder,
    getCardLabel,
  } = useCardWidget();

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstDiv}>
        {allReports?.slice(0, 2)?.map((card, index) => (
          <CardComponent
            key={card?.key}
            style={{
              ...classes.firstCard,
              background: getCardColor(card?.key),
              border: getCardBorder(card?.key),
              boxShadow:
                "var(--theme-card-shadow, rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px)",
              borderRadius: "var(--theme-card-radius, 4px)",
            }}
            text={t(getCardLabel(card?.key))}
            number={!isNaN(card.value) ? `${card.value}%` : "0%"}
            textColor={getCardTextColor(card?.key)}
            icon={getCardIcon(card?.key)}
          />
        ))}
      </div>
      <div style={classes.secondDiv}>
        {allReports?.slice(2)?.map((card) => (
          <CardComponent
            key={card?.key}
            style={{
              ...classes.secondCard,
              background: getCardColor(card?.key),
              border: getCardBorder(card?.key),
              boxShadow:
                "var(--theme-card-shadow, rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px)",
              borderRadius: "var(--theme-card-radius, 4px)",
            }}
            text={t(getCardLabel(card?.key))}
            number={card?.value}
            textColor={getCardTextColor(card?.key)}
            icon={getCardIcon(card?.key)}
          />
        ))}
      </div>
    </div>
  );
};

export { CardsWidget };
