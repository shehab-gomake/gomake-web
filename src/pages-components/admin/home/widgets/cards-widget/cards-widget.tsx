import { CardComponent } from "@/pages-components/quotes/statistics-section/card";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useCardWidget } from "./use-cards-widget";

const CardsWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {
        getCardIcon,
        getCardColor,
        getCardLabel,
        documentStatisticsList
    } = useCardWidget();

    return (
        <div style={classes.mainContainer}>
            <div style={classes.firstDiv}>
                {documentStatisticsList.slice(0, 2)?.map((card) => (
                    <CardComponent
                        style={{ width: "100%", height: "50%" }}
                        text={t(getCardLabel(card?.key))}
                        number={card?.value}
                        textColor="#FFFFFF"
                        backGroundColor={getCardColor(card?.key)}
                        icon={getCardIcon(card?.key)} />
                ))}
            </div>
            <div style={classes.secondDiv}>
                {documentStatisticsList.slice(2)?.map((card) => (
                    <CardComponent
                        style={{ width: "100%", height: "25%" }}
                        text={t(getCardLabel(card?.key))}
                        number={card?.value}
                        textColor="#FFFFFF"
                        backGroundColor={getCardColor(card?.key)}
                        icon={getCardIcon(card?.key)} />
                ))}
            </div>
        </div>
    );
};

export { CardsWidget };
