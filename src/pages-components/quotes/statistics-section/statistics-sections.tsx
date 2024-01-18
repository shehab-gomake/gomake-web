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

const CardsSection = ({ statistics, onClick , setState}: ICardsSection) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { primaryColor, secondColor, warningColor, successColor, errorColor } = useGomakeTheme();


    
    return (
        <Stack direction={"row"} gap={"5px"} alignItems={"center"} flexWrap={"wrap-reverse"}>
            <CardComponent text={t("sales.quote.successRate")} number={getValueByKey(statistics, "successRate") + "%"} textColor="#FFFFFF" backGroundColor={primaryColor(300)} icon={<TrendingUpIcon/>} onClick={()=>console.log("search")}  onSecondClick={()=>console.log("clear")}/>
            <CardComponent text={t("sales.quote.waiting")} number={getValueByKey(statistics, "waitingCount")} textColor="#FFFFFF" backGroundColor={warningColor(300)} icon={<HourglassTopIcon />} onClick={()=>console.log("search 1")}  onSecondClick={()=>console.log("clear 1")} />
            <CardComponent text={t("sales.quote.approved")} number={getValueByKey(statistics, "approvedCount")} textColor="#FFFFFF" backGroundColor={successColor(300)} icon={<DoneAllIcon/>} />
            <CardComponent text={t("sales.quote.canceled")} number={getValueByKey(statistics, "canceledCount")} textColor="#FFFFFF" backGroundColor={errorColor(300)} icon={<DoDisturbAltIcon />} />
            <div style={classes.verticalLine}></div>
            <CardComponent text={t("sales.quote.totalPrice")} number={getValueByKey(statistics, "totalPrice")} textColor="#101020" backGroundColor={secondColor(100)} icon={<GoMakeCurrency/>} />
            <Button style={classes.createNew} onClick={onClick} startIcon={<AddCircleOutlineIcon style={{ color: 'black'  , fontSize:"24px"}}/>}>{t("sales.quote.createNew")}</Button>
        </Stack>
    );
}

export { CardsSection }