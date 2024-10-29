import {SeparateDateFormatterDDMMYYYY} from "@/utils/adapter";
import Stack from "@mui/material/Stack";
import {CSSProperties} from "react";

interface IProps {
    dateTime: string;
    direction?:  "row" | "column" | "column-reverse" | "row-reverse";
    gap?: string;
    style?: CSSProperties;
}
const DateTimeComponent = ({dateTime, direction, gap, style}: IProps) => {
    const { formattedDate: date, formattedTime: time } = SeparateDateFormatterDDMMYYYY(dateTime);
    return (
        <Stack style={style} direction={direction} gap={gap}>
            <span>{date}</span>
            <span>{time}</span>
        </Stack>
    )
}

export {DateTimeComponent}