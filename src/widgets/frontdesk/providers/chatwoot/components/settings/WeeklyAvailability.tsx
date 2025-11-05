/**
 * WeeklyAvailability Component
 *
 * Configure business hours for each day of the week.
 * Used in the Business Hours tab of inbox settings.
 */

import React from "react";
import {
  Box,
  Typography,
  Switch,
  TextField,
  Paper,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface DayAvailability {
  enabled: boolean;
  startTime: string; // Format: "HH:mm" (24-hour)
  endTime: string; // Format: "HH:mm" (24-hour)
}

export interface WeekSchedule {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface WeeklyAvailabilityProps {
  /** Current schedule */
  schedule: WeekSchedule;
  /** Change handler */
  onChange: (schedule: WeekSchedule) => void;
  /** Disabled state */
  disabled?: boolean;
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

export const WeeklyAvailability: React.FC<WeeklyAvailabilityProps> = ({
  schedule,
  onChange,
  disabled = false,
}) => {
  const theme = useTheme();

  const handleDayToggle = (day: keyof WeekSchedule) => {
    onChange({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
      },
    });
  };

  const handleTimeChange = (
    day: keyof WeekSchedule,
    field: "startTime" | "endTime",
    value: string
  ) => {
    onChange({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: theme.palette.text.secondary,
        }}
      >
        Configure your working hours for each day of the week. Messages received
        outside these hours will be marked as after-hours.
      </Typography>

      <Stack spacing={1.5}>
        {DAYS.map(({ key, label }) => {
          const daySchedule = schedule[key];

          return (
            <Paper
              key={key}
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: daySchedule.enabled
                  ? theme.palette.background.paper
                  : theme.palette.action.disabledBackground,
                transition: "all 0.2s",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Day Name & Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 140,
                  }}
                >
                  <Switch
                    checked={daySchedule.enabled}
                    onChange={() => handleDayToggle(key)}
                    disabled={disabled}
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      fontWeight: 600,
                      color: daySchedule.enabled
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>

                {/* Time Range */}
                {daySchedule.enabled && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flex: 1,
                    }}
                  >
                    <TextField
                      type="time"
                      size="small"
                      value={daySchedule.startTime}
                      onChange={(e) =>
                        handleTimeChange(key, "startTime", e.target.value)
                      }
                      disabled={disabled}
                      InputProps={{
                        sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                      }}
                      sx={{ width: 140 }}
                    />

                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      to
                    </Typography>

                    <TextField
                      type="time"
                      size="small"
                      value={daySchedule.endTime}
                      onChange={(e) =>
                        handleTimeChange(key, "endTime", e.target.value)
                      }
                      disabled={disabled}
                      InputProps={{
                        sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                      }}
                      sx={{ width: 140 }}
                    />
                  </Box>
                )}

                {!daySchedule.enabled && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.disabled,
                      fontStyle: "italic",
                    }}
                  >
                    Unavailable
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          display: "block",
          color: theme.palette.text.secondary,
        }}
      >
        All times are in your account's timezone. Toggle the switch to enable or
        disable each day.
      </Typography>
    </Box>
  );
};

/**
 * Create default business hours (Mon-Fri, 9am-5pm)
 */
export const createDefaultSchedule = (): WeekSchedule => {
  const defaultWorkday: DayAvailability = {
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  };

  const weekend: DayAvailability = {
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  };

  return {
    monday: { ...defaultWorkday },
    tuesday: { ...defaultWorkday },
    wednesday: { ...defaultWorkday },
    thursday: { ...defaultWorkday },
    friday: { ...defaultWorkday },
    saturday: { ...weekend },
    sunday: { ...weekend },
  };
};
