import Stack from "@mui/material/Stack";
import { DaysComponent } from "@/widgets/employees-working-hours-widgets/modals/components/days-component";
import { TimeRangeManager } from "@/widgets/employees-working-hours-widgets/modals/components/time-range-manager";
import React from "react";

const WorkingDaysComponent = ({
  days,
  onToggleDay,
  startTime,
  endTime,
  onTimeChange,
}) => {
  return (
    <Stack gap={"5px"} width={"500px"}>
      <DaysComponent
        groupIndex={0}
        days={days}
        selectedDays={[]}
        onToggleDay={(i, d) => onToggleDay(d)}
      />
      <TimeRangeManager
        canAddTimeRange={false}
        onAddTimeRange={() => {}}
        onRemoveTimeRange={() => {}}
        timeIndex={0}
        onTimeChange={(groupIndex, timeIndex, field, value) => {
          onTimeChange(field, value);
        }}
        groupIndex={0}
        onMachinesChange={() => {}}
        showMachines={false}
        machines={[]}
        time={{
          startTime: startTime,
          endTime: endTime,
          machines: [],
        }}
      />
    </Stack>
  );
};

export { WorkingDaysComponent };
