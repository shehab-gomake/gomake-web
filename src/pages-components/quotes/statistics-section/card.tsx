import { Card,CardContent, Typography } from "@mui/material";
import { useStyle } from "./style";

interface ICardProps {
    backGroundColor?: string;
    textColor?:string;
    text?:string;
    number?: string;
    icon?:JSX.Element;
}

const CardComponent = ({ backGroundColor, text, textColor, number, icon  }: ICardProps) => {   
    const { classes } = useStyle();

    const mergedStyles = {
        ...classes.ticketStyle,
        backgroundColor: backGroundColor || classes.ticketStyle.background,
    };

    return (
        <Card sx={mergedStyles}>
            <CardContent style={classes.ticketContentStyle}>
                <Typography sx={classes.textStyle} color={textColor || "text.secondary"} >{icon}{text}</Typography>
                <Typography sx={classes.numberStyle} color={textColor || "text.secondary"}>{number}</Typography>
            </CardContent>
        </Card>
    );
}

export { CardComponent }