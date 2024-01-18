import { Card, CardContent, Typography } from "@mui/material";
import { useStyle } from "./style";
import { useState } from "react";

interface ICardProps {
    backGroundColor?: string;
    textColor?: string;
    text?: string;
    number?: string;
    icon?: JSX.Element;
    onClick?: () => void;
    onSecondClick?: () => void;
}

const CardComponent = ({ backGroundColor, text, textColor, number, icon, onClick, onSecondClick }: ICardProps) => {
    const { classes } = useStyle();
    const [isFiltered, setIsFiltered] = useState(false);

    const mergedStyles = {
        ...classes.ticketStyle,
        backgroundColor: backGroundColor || classes.ticketStyle.background,
        cursor: onClick ? "pointer" : "auto",
        border: isFiltered ? "3px solid green" : "2px solid transparent", // Example border style for indication
    };

    const handleClick = () => {
        setIsFiltered((prev) => !prev);
        if (isFiltered && onSecondClick) {
            onSecondClick();
        } else if (!isFiltered && onClick) {
            onClick();
        }
    };

    return (
        <Card sx={mergedStyles} onClick={onClick && handleClick}>
            <CardContent style={classes.ticketContentStyle}>
                <Typography sx={classes.textStyle} color={textColor || "text.secondary"} >{icon}{text}</Typography>
                <Typography sx={classes.numberStyle} color={textColor || "text.secondary"}>{number}</Typography>
            </CardContent>
        </Card>
    );
}

export { CardComponent }