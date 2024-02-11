import { CardComponent } from "@/pages-components/quotes/statistics-section/card";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useCardWidget } from "./use-cards-widget";
import { useRecoilValue } from "recoil";
import { homeReportsState } from "@/pages-components/quote/store/quote";

const CardsWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const allReports = useRecoilValue<any>(homeReportsState);

    const {
        getCardIcon,
        getCardColor,
        getCardLabel,
    } = useCardWidget();

    return (
        <div style={classes.mainContainer}>
            <div style={classes.firstDiv}>
                {allReports?.slice(0, 2)?.map((card, index) => (
                    <CardComponent
                        key={card?.key}
                        style={{ ...classes.firstCard, background: getCardColor(card?.key) }}
                        text={t(getCardLabel(card?.key))}
                        // number={index === 0 ? (!isNaN(card.value) ? `${card.value}%` : "0%") :"+/- " + (!isNaN(card.value) ? `${card.value}%`: "0%")}
                        number={!isNaN(card.value) ? `${card.value}%` : "0%"}
                        textColor="#FFFFFF"
                        icon={getCardIcon(card?.key)} />
                ))}
            </div>
            <div style={classes.secondDiv}>
                {allReports?.slice(2)?.map((card) => (
                    <CardComponent
                        key={card?.key}
                        style={{ ...classes.secondCard, background: getCardColor(card?.key) }}
                        text={t(getCardLabel(card?.key))}
                        number={card?.value}
                        textColor="#FFFFFF"
                        icon={getCardIcon(card?.key)} />
                ))}
            </div>
        </div>
    );
};

export { CardsWidget };