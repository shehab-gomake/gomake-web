import { Button, Stack } from "@mui/material";
import { CardComponent } from "./card";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { CardIcon } from "./icon";

interface ICard {
    key: string;
    value: string;
}

interface ICardsSection {
    statistics: ICard[];
    onClick: ()=> void;
}

const getValueByKey = (statistics: ICard[], key: string) => {
    const card = statistics.find((item) => item.key === key);
    return card ? card.value : "";
};

const CardsSection = ({ statistics , onClick  }: ICardsSection) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { primaryColor, secondColor, warningColor, successColor, errorColor } = useGomakeTheme();

    return (
        <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
            <CardComponent text={t("sales.quote.successRate")} number={getValueByKey(statistics, "successRate") + "%"} textColor="#FFFFFF" backGroundColor={primaryColor(300)} icon={<CardIcon color="#FFFFFF" />} />
            <CardComponent text={t("sales.quote.waiting")} number={getValueByKey(statistics, "waitingCount")} textColor="#FFFFFF" backGroundColor={warningColor(300)} icon={<CardIcon color="#FFFFFF" />} />
            <CardComponent text={t("sales.quote.approved")} number={getValueByKey(statistics, "approvedCount")} textColor="#FFFFFF" backGroundColor={successColor(300)} icon={<CardIcon color="#FFFFFF" />} />
            <CardComponent text={t("sales.quote.canceled")} number={getValueByKey(statistics, "canceledCount")} textColor="#FFFFFF" backGroundColor={errorColor(300)} icon={<CardIcon color="#FFFFFF" />} />
            <div style={classes.verticalLine}></div>
            <CardComponent text={t("sales.quote.totalPrice")} number={getValueByKey(statistics, "totalPrice")} textColor="#101020" backGroundColor={secondColor(100)} icon={<CardIcon />} />
            <Button style={classes.createNew} onClick={onClick} startIcon={<CardIcon />}>{t("sales.quote.createNew")}</Button>
        </Stack>
    );
}

export { CardsSection }