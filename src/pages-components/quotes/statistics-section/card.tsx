import { Card, CardContent, Typography } from "@mui/material";
import { useStyle } from "./style";
import { CSSProperties, useEffect, useState } from "react";

interface ICardProps {
    textColor?: string;
    text?: string;
    number?: string;
    icon?: JSX.Element;
    onClick?: () => void;
    onSecondClick?:any;
    isActive?:any;
    style?:CSSProperties;
    backGroundColor?:string;

}

const CardComponent = ({ text, textColor, number, icon, onClick, onSecondClick , isActive , style ,backGroundColor}: ICardProps) => {
    const { classes } = useStyle();
    const [isFiltered, setIsFiltered] = useState(isActive || false);

    const mergedStyles = {
        ...classes.ticketStyle,
        ...style,
       cursor: onClick ? "pointer" : "auto",
       border: isFiltered ? "none" : `2px solid ${textColor}`,
       backgroundColor: isFiltered ? textColor : backGroundColor ,

    };

    const handleClick = () => {
        setIsFiltered((prev) => !prev); 
        if (isFiltered && onSecondClick) {
            onSecondClick();
        } else if (!isFiltered && onClick) {
            onClick();
        }
    };

    useEffect(() => {
        setIsFiltered(isActive || false);
    }, [isActive]);

    return (
        <Card sx={mergedStyles} onClick={ onClick && handleClick}>
            <CardContent style={classes.ticketContentStyle}>
                <Typography sx={classes.textStyle} color={isFiltered ?"#FFFFFF" :textColor } >{icon}{text}</Typography>
                <Typography sx={classes.numberStyle} color={isFiltered ? "#FFFFFF":textColor }>{number}</Typography>
            </CardContent>
        </Card>
    );
}

export { CardComponent }