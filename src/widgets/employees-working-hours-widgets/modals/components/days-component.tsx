import { PrimaryButton } from "@/components/button/primary-button";
import { Stack } from "@mui/material";
import { FC } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

interface DaySelectorProps {
  groupIndex: number;
  days: number[];
  selectedDays: number[];
  onToggleDay: (groupIndex: number, day: number) => void;
}

const DAYS = [
  { value: 0, label: "days.sun" },
  { value: 1, label: "days.mon" },
  { value: 2, label: "days.tue" },
  { value: 3, label: "days.wed" },
  { value: 4, label: "days.thu" },
  { value: 5, label: "days.fri" },
  { value: 6, label: "days.sat" },
];

const DaysComponent: FC<DaySelectorProps> = ({
  groupIndex,
  days,
  selectedDays,
  onToggleDay,
}) => {
  const { t } = useTranslation();
  return (
    <Stack
      bgcolor={"#EAECF0"}
      borderRadius={"10px"}
      gap={"28px"}
      overflow={"hidden"}
      padding={"4px 12px"}
      direction={"row"}
      width={"100%"}
    >
      {DAYS.map((day) => (
        <PrimaryButton
          key={day.value}
          variant={days?.includes(day?.value) ? "contained" : "outlined"}
          disabled={
            selectedDays.includes(day?.value) && !days.includes(day?.value)
          }
          onClick={() => onToggleDay(groupIndex, day?.value)}
          sx={{
            padding: "1px",
            border: 0,
            borderRadius: "4px",
            minWidth: 0,
            width: "100%",
            height: "36px",
            ...FONT_FAMILY.Inter(600, 14),
          }}
        >
          {t(day.label)}
        </PrimaryButton>
      ))}
    </Stack>
  );
};

export { DaysComponent };
