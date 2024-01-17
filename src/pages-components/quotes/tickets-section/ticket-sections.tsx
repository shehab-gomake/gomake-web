import { Button, Stack } from "@mui/material";
import { CardComponent } from "./ticket";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GomakePrimaryButton } from "@/components/button";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { CardIcon } from "./icon";

const CardsSection = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {primaryColor, secondColor, warningColor , successColor , errorColor} = useGomakeTheme();

    return(
        <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
            <CardComponent text="Success Rate" number={"67%"} textColor="#FFFFFF" backGroundColor={primaryColor(300)} icon={<CardIcon color="#FFFFFF"/>}/>
            <CardComponent text="Waiting" number={"5222"} textColor="#FFFFFF" backGroundColor={warningColor(300)} icon={<CardIcon color="#FFFFFF"/>}/>
            <CardComponent text="Approved" number={"5222"} textColor="#FFFFFF" backGroundColor={successColor(300)} icon={<CardIcon color="#FFFFFF"/>}/>
            <CardComponent text="Cancelled" number={"5222"} textColor="#FFFFFF" backGroundColor={errorColor(300)} icon={<CardIcon color="#FFFFFF"/>}/>
            <div style={{borderLeft: "1px solid #000", height: "20px",margin: "0 5px"}}></div>
            <CardComponent text="Total Price" number={"546"} textColor="#101020" backGroundColor={secondColor(100)} icon={<CardIcon/>}/>
            {/* <GomakePrimaryButton style={classes.createNew} onClick={()=>alert("hey")}>{<CardIcon/>}{t("Create new")}</GomakePrimaryButton> */}
            <Button style={classes.createNew} onClick={()=>alert("xxss")}startIcon={<CardIcon/>}>{t("Create new")}</Button>
        </Stack>
    );
}

export {CardsSection}