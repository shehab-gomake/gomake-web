import { Button, Stack } from "@mui/material";
import { CardComponent } from "./card";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GoMakeCurrency } from "@/icons/go-make-currency";
import { useState } from "react";
import { EStatisticsLabels, QUOTE_STATUSES } from "../enums";

interface ICard {
    key: string;
    value: string;
}

interface ICardsSection {
    statistics: ICard[];
    onClick: () => void;
    setState?: any; 
}

const getValueByKey = (statistics: ICard[], key: string) => {
    const card = statistics.find((item) => item.key === key);
    return card ? card.value : "";
};

const CardsSection = ({ statistics , onClick, setState }: ICardsSection) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { primaryColor, secondColor, warningColor, successColor, errorColor } = useGomakeTheme();
    const [activeCard, setActiveCard] = useState(null);

    const handleCardClick = (cardKey, statusValue) => {
        setActiveCard(cardKey);
        setState({ label: t(`sales.quote.${cardKey}`), value: statusValue });
    };

    const handleSecondCardClick = () => {
      setState(null);
      setActiveCard(null);
    };

    return (
        <Stack direction={"row"} gap={"5px"} alignItems={"center"} flexWrap={"wrap-reverse"}>
            <CardComponent
            onClick={() => handleCardClick(EStatisticsLabels.WAITING,QUOTE_STATUSES.Waiting)}
            isActive={activeCard === EStatisticsLabels.WAITING}
            key={EStatisticsLabels.WAITING} text={t("sales.quote.waiting")} number={getValueByKey(statistics, "waitingCount")}  textColor={warningColor(300)} icon={<HourglassTopIcon />}   onSecondClick={handleSecondCardClick} />
            <CardComponent 
            onClick={() => handleCardClick(EStatisticsLabels.APPROVED , QUOTE_STATUSES.Approved)}
            isActive={activeCard === EStatisticsLabels.APPROVED}
            key={EStatisticsLabels.APPROVED} text={t("sales.quote.approved")} number={getValueByKey(statistics, "approvedCount")}  textColor={successColor(300)} icon={<DoneAllIcon/>}  onSecondClick={handleSecondCardClick}/>
            <CardComponent
            onClick={() => handleCardClick(EStatisticsLabels.CANCELED , QUOTE_STATUSES.Canceled)}
            isActive={activeCard === EStatisticsLabels.CANCELED}
            key={EStatisticsLabels.CANCELED} text={t("sales.quote.canceled")} number={getValueByKey(statistics, "canceledCount")} textColor={errorColor(300)} icon={<DoDisturbAltIcon />} onSecondClick={handleSecondCardClick}/>
            <div style={classes.verticalLine}/>
            <CardComponent text={t("sales.quote.successRate")} number={getValueByKey(statistics, "successRate") + "%"}  textColor={primaryColor(300)} icon={<TrendingUpIcon/>} />
            <CardComponent text={t("sales.quote.totalPrice")} number={getValueByKey(statistics, "totalPrice")}  textColor={secondColor(100)} icon={<GoMakeCurrency color={secondColor(100)}/>} />
            <Button style={classes.createNew} onClick={onClick} startIcon={<AddCircleOutlineIcon style={{ color: 'black'  , fontSize:"24px"}}/>}>{t("sales.quote.createNew")}</Button>
    </Stack>

    );
}

export { CardsSection }