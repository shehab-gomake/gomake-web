/**
 * Inbox Business Hours Tab
 *
 * Configure working hours for the inbox.
 */

import React, { useState } from "react";
import { Box, Button, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  SettingsSection,
  WeeklyAvailability,
  createDefaultSchedule,
  type WeekSchedule,
} from "../../../components/settings";

interface InboxBusinessHoursTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onSave: (schedule: WeekSchedule) => Promise<void>;
  isSaving: boolean;
}

export const InboxBusinessHoursTab: React.FC<InboxBusinessHoursTabProps> = ({
  inbox,
  accountId,
  onSave,
  isSaving,
}) => {
  const theme = useTheme();

  // Initialize with default schedule or inbox's existing schedule
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    // TODO: Load from inbox.business_hours when available
    return createDefaultSchedule();
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleScheduleChange = (newSchedule: WeekSchedule) => {
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(schedule);
    setHasChanges(false);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure your working hours to let customers know when they can expect a
        response. Messages received outside these hours will be marked as after-hours.
      </Alert>

      <SettingsSection
        title="Weekly Availability"
        description="Set your available hours for each day of the week"
        showDivider={false}
      >
        <WeeklyAvailability
          schedule={schedule}
          onChange={handleScheduleChange}
          disabled={isSaving}
        />

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            sx={{ minWidth: 120 }}
          >
            {isSaving ? "Saving..." : "Save Hours"}
          </Button>
        </Box>
      </SettingsSection>
    </Box>
  );
};
