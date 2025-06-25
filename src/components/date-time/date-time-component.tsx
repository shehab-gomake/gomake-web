import { SeparateDateFormatterDDMMYYYY } from "@/utils/date-formatters";
import Stack from "@mui/material/Stack";
import { CSSProperties } from "react";

interface IProps {
  dateTime: string;
  direction?: "row" | "column" | "column-reverse" | "row-reverse";
  gap?: string;
  style?: CSSProperties;
}

const DateTimeComponent = ({ dateTime, direction, gap, style }: IProps) => {
  const utcDate = convertUtcToLocalIsoString(dateTime);
  const { formattedDate: date, formattedTime: time } =
    SeparateDateFormatterDDMMYYYY(utcDate);
  return (
    <Stack style={style} direction={direction} gap={gap}>
      <span>{date}</span>
      <span>{time}</span>
    </Stack>
  );
};

const convertUtcToLocalIsoString = (utcString: string): string => {
  try {
    const date = new Date(utcString + "Z"); // Parse the UTC date string
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ); // Adjust to local timezone
    return localDate.toISOString().replace("Z", ""); // Remove the 'Z' to indicate local time
  } catch (e) {
    return utcString;
  }
};

const formatDateToISOString = (date: Date | null | undefined) => {
  if (date && !isNaN(date.getTime())) {
    return date.toISOString();
  }
  return "";
};

export { DateTimeComponent, convertUtcToLocalIsoString, formatDateToISOString };
