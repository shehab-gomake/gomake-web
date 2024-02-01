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

interface ICard {
    key: string;
    value: string;
}

interface ICardsSection {
    statistics: ICard[];
    onClick: () => void;
    setState?: any; 
    state?:any;
}

const getValueByKey = (statistics: ICard[], key: string) => {
    const card = statistics.find((item) => item.key === key);
    return card ? card.value : "";
};

const CardsSection = ({ statistics , onClick }: ICardsSection) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { primaryColor, secondColor, warningColor, successColor, errorColor } = useGomakeTheme();
    const [activeCard, setActiveCard] = useState(null);


    const handleCardClick = (cardKey) => {
        setActiveCard(cardKey);
        // setState(cardKey)
        // or setActiveCard used to be recoil state or come in props
    };

    return (
        <Stack direction={"row"} gap={"5px"} alignItems={"center"} flexWrap={"wrap-reverse"}>
            <CardComponent
            onClick={() => handleCardClick("card-waiting")}
            isActive={activeCard === "card-waiting"}
            onActivate={() => console.log(`activate card-waiting`)}
            key={"card-waiting"} text={t("sales.quote.waiting")} number={getValueByKey(statistics, "waitingCount")}  textColor={warningColor(300)} icon={<HourglassTopIcon />}   onSecondClick={()=>console.log("inactive waiting")} />
            <CardComponent 
            onClick={() => handleCardClick("card-approved")}
            isActive={activeCard === "card-approved"}
            onActivate={() => console.log(`activate card-approved`)}
            key={"card-approved"} text={t("sales.quote.approved")} number={getValueByKey(statistics, "approvedCount")}  textColor={successColor(300)} icon={<DoneAllIcon/>}  onSecondClick={()=>console.log("inactive approved")}/>
            <CardComponent
            onClick={() => handleCardClick("card-canceled")}
            isActive={activeCard === "card-canceled"}
            onActivate={() => console.log(`activate card-canceled`)}
            key={"card-canceled"} text={t("sales.quote.canceled")} number={getValueByKey(statistics, "canceledCount")} textColor={errorColor(300)} icon={<DoDisturbAltIcon />} onSecondClick={()=>console.log("inactive canceled")}/>
            <div style={classes.verticalLine}/>
            <CardComponent text={t("sales.quote.successRate")} number={getValueByKey(statistics, "successRate") + "%"}  textColor={primaryColor(300)} icon={<TrendingUpIcon/>} />
            <CardComponent text={t("sales.quote.totalPrice")} number={getValueByKey(statistics, "totalPrice")}  textColor={secondColor(100)} icon={<GoMakeCurrency color={secondColor(100)}/>} />
            <Button style={classes.createNew} onClick={onClick} startIcon={<AddCircleOutlineIcon style={{ color: 'black'  , fontSize:"24px"}}/>}>{t("sales.quote.createNew")}</Button>
    </Stack>

    );
}

export { CardsSection }