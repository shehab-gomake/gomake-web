import {FONT_FAMILY} from "@/utils/font-family";

interface IProps {
    date: Date;
}
const MessageDateTimeComponent = ({date}: IProps) => {
    const dayName = date.toLocaleDateString([], { weekday: 'short' });

    // Get the time in H:MM AM/PM format
    const time = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return <span style={{...FONT_FAMILY.Lexend(400, 11)}}>{`${dayName} ${time}`}</span>
}

export {MessageDateTimeComponent}