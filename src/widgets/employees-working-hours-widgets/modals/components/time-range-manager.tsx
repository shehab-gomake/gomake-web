import React, { useEffect } from 'react';
import { Stack, IconButton } from '@mui/material';
import { AddCircleOutlineRounded } from '@mui/icons-material';
import { SelectMachines } from "@/widgets/employees-working-hours-widgets/modals/components/select-machines";
import { IStartEndTime, IWorkingHoursMachine } from "@/widgets/employees-working-hours-widgets/interface";
import { useTranslation } from "react-i18next";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { TimeTextField } from "@/widgets/employees-working-hours-widgets/modals/components/time-text-field";
import { FONT_FAMILY } from "@/utils/font-family";

interface TimeRangeManagerProps {
    groupIndex: number;
    onTimeChange: (groupIndex: number, timeIndex: number, field: 'startTime' | 'endTime', value: string) => void;
    onMachinesChange: (groupIndex: number, timeIndex: number, values: string[]) => void;
    onAddTimeRange: (groupIndex: number) => void;
    onRemoveTimeRange: (groupIndex: number, timeIndex: number) => void;
    machines: IWorkingHoursMachine[];
    timeIndex: number;
    time: IStartEndTime;
    showMachines?: boolean;
    canAddTimeRange?: boolean;
}

const TimeRangeManager: React.FC<TimeRangeManagerProps> = ({
    groupIndex,
    onTimeChange,
    onMachinesChange,
    onAddTimeRange,
    onRemoveTimeRange,
    machines,
    timeIndex,
    time,
    showMachines = true,
    canAddTimeRange = true
}) => {
    const { t } = useTranslation();
    const convertDateToTimeString = (date) => {
        if (date === null) {
            return null;
        }
        const tDate = new Date(date);
        const hours = tDate.getHours().toString().padStart(2, '0'); // Get hours and pad to 2 digits
        const minutes = tDate.getMinutes().toString().padStart(2, '0'); // Get minutes and pad to 2 digits
        return `${hours}:${minutes}`;
    };

    return (
        <Stack gap="20px" key={timeIndex}>
            <Stack direction="row" gap="10px" alignItems="center">
                <TimeTextField
                    type="time"
                    variant="outlined"
                    fullWidth
                    sx={{ background: 'white' }}
                    value={convertDateToTimeString(time.startTime)}
                    onChange={(e) =>
                        onTimeChange(groupIndex, timeIndex, 'startTime', e.target.value)
                    }
                />
                <span>{t('employeeWorkingHours.to')}</span>
                <TimeTextField
                    type="time"
                    variant="outlined"
                    fullWidth
                    sx={{ background: 'white' }}
                    value={convertDateToTimeString(time.endTime)}
                    onChange={(e) =>
                        onTimeChange(groupIndex, timeIndex, 'endTime', e.target.value)
                    }
                />
                {
                    canAddTimeRange && <>
                        {timeIndex === 0 ? (
                            <IconButton
                                sx={{ fontSize: 14 }}
                                onClick={() => onAddTimeRange(groupIndex)}
                            >
                                <AddCircleOutlineRounded />
                            </IconButton>
                        ) : (
                            <IconButton

                                onClick={() => onRemoveTimeRange(groupIndex, timeIndex)}
                            >
                                <DeleteOutlinedIcon style={{ color: 'D92D20' }} />
                            </IconButton>
                        )}
                    </>
                }
            </Stack>
            {showMachines && <div>
                <h5 style={{
                    ...FONT_FAMILY.Inter(500, 14),
                    color: '#344054',
                    paddingBottom: '8px'
                }}>{t('tabs.machines')}</h5>
                <SelectMachines
                    onChange={(v) => onMachinesChange(groupIndex, timeIndex, v)}
                    options={[...machines]}
                    values={time.machines}
                />
            </div>
            }
        </Stack>
    );
};

export { TimeRangeManager };
