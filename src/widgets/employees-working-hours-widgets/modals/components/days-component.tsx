import { PrimaryButton } from "@/components/button/primary-button";
import { Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  const { primaryColor, neutralColor } = useGomakeTheme();

  const containerStyle = useMemo(
    () => ({
      backgroundColor: `var(--theme-bg-secondary, ${neutralColor(50)})`,
      borderRadius: `var(--theme-radius-md, 8px)`,
      gap: "8px",
      overflow: "hidden",
      padding: "6px",
      border: `1px solid var(--theme-border-color, ${neutralColor(300)})`,
    }),
    [neutralColor]
  );

  const buttonStyle = useMemo(
    () => ({
      padding: "8px 4px",
      border: "none",
      borderRadius: `var(--theme-radius-md, 4px)`,
      minWidth: 0,
      width: "100%",
      height: "40px",
      ...FONT_FAMILY.Inter(600, 14),
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
      },
    }),
    []
  );

  const getButtonVariant = (dayValue: number) => {
    const isSelected = days?.includes(dayValue);
    const isDisabled =
      selectedDays.includes(dayValue) && !days.includes(dayValue);
    return isSelected ? "contained" : "outlined";
  };

  return (
    <Stack sx={containerStyle} direction={"row"} width={"100%"}>
      {DAYS.map((day) => {
        const isSelected = days?.includes(day?.value);
        const isDisabled =
          selectedDays.includes(day?.value) && !days.includes(day?.value);

        return (
          <PrimaryButton
            key={day.value}
            variant={getButtonVariant(day.value)}
            disabled={isDisabled}
            onClick={() => onToggleDay(groupIndex, day?.value)}
            sx={{
              ...buttonStyle,
              ...(isSelected && {
                backgroundColor: `var(--theme-primary-color, ${primaryColor(
                  500
                )})`,
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: `var(--theme-primary-hover, ${primaryColor(
                    500
                  )})`,
                },
              }),
              ...(!isSelected && {
                backgroundColor: "transparent",
                color: `var(--theme-text-primary, ${neutralColor(900)})`,
                border: `1px solid var(--theme-border-color, ${neutralColor(
                  300
                )})`,
                "&:hover": {
                  backgroundColor: `var(--theme-bg-tertiary, ${neutralColor(
                    50
                  )})`,
                  borderColor: `var(--theme-primary-color, ${primaryColor(
                    500
                  )})`,
                },
              }),
              ...(isDisabled && {
                opacity: 0.4,
                cursor: "not-allowed",
                "&:hover": {
                  transform: "none",
                },
              }),
            }}
          >
            {t(day.label)}
          </PrimaryButton>
        );
      })}
    </Stack>
  );
};

export { DaysComponent };
