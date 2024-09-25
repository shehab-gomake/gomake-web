import {SeparateDateFormatterDDMMYYYY} from "@/utils/adapter";
import Stack from "@mui/material/Stack";

interface IProps {
    dateTime: string;
    direction?:  "row" | "column" | "column-reverse" | "row-reverse";
    gap?: string;
}
const DateTimeComponent = ({dateTime, direction, gap}: IProps) => {
    const { formattedDate: date, formattedTime: time } = SeparateDateFormatterDDMMYYYY(dateTime);
    return (
        <Stack direction={direction} gap={gap}>
            <span>{date}</span>
            <span>{time}</span>
        </Stack>
    )
}

export {DateTimeComponent}