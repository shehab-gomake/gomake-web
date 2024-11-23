import React, {useEffect} from 'react';
import {Stack, TextField, IconButton} from '@mui/material';
import {AddCircleOutlineRounded} from '@mui/icons-material';
import {DeleteIcon} from "@/components/icons/delete-icon";
import {SelectMachines} from "@/widgets/employees-working-hours-widgets/modals/components/select-machines";
import {IStartEndTime, IWorkingHoursMachine} from "@/widgets/employees-working-hours-widgets/interface";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useTranslation} from "react-i18next";

interface TimeRangeManagerProps {
    groupIndex: number;
    onTimeChange: (groupIndex: number, timeIndex: number, field: 'startTime' | 'endTime', value: string) => void;
    onMachinesChange: (groupIndex: number, timeIndex: number, values: string[]) => void;
    onAddTimeRange: (groupIndex: number) => void;
    onRemoveTimeRange: (groupIndex: number, timeIndex: number) => void;
    machines: IWorkingHoursMachine[];
    timeIndex: number;
    time: IStartEndTime;
}

const TimeRangeManager: React.FC<TimeRangeManagerProps> = ({
                                                               groupIndex,
                                                               onTimeChange,
                                                               onMachinesChange,
                                                               onAddTimeRange,
                                                               onRemoveTimeRange,
                                                               machines,
                                                               timeIndex,
    time
                                                           }) => {
    const {secondColor} = useGomakeTheme();
    const {t} = useTranslation();
    const convertDateToTimeString = (date) => {
        const tDate = new Date(date);
        const hours = tDate.getHours().toString().padStart(2, '0'); // Get hours and pad to 2 digits
        const minutes = tDate.getMinutes().toString().padStart(2, '0'); // Get minutes and pad to 2 digits
        return `${hours}:${minutes}`;
    };

    useEffect(()=>{console.log(machines)},[machines])

    return (
                <Stack gap="20px" key={timeIndex}>
                    <Stack direction="row" gap="10px" alignItems="center">
                        <TextField
                            type="time"
                            variant="outlined"
                            fullWidth
                            value={convertDateToTimeString(time.startTime)}
                            onChange={(e) =>
                                onTimeChange(groupIndex, timeIndex, 'startTime', e.target.value)
                            }
                            sx={{
                                border: '1px solid #D0D5DD',
                                borderRadius: '8px',
                                height: '40px',
                                '& .MuiOutlinedInput-root': {
                                    height: '100%',
                                    '& input': {
                                        padding: '0 14px',
                                    },
                                },
                            }}
                        />
                        <span>{t('employeeWorkingHours.to')}</span>
                        <TextField
                            type="time"
                            variant="outlined"
                            fullWidth
                            value={convertDateToTimeString(time.endTime)}
                            onChange={(e) =>
                                onTimeChange(groupIndex, timeIndex, 'endTime', e.target.value)
                            }
                            sx={{
                                border: '1px solid #D0D5DD',
                                borderRadius: '8px',
                                height: '40px',
                                '& .MuiOutlinedInput-root': {
                                    height: '100%',
                                    '& input': {
                                        padding: '0 14px',
                                    },
                                },
                            }}
                        />
                        {timeIndex === 0 ? (
                            <IconButton
                                sx={{fontSize: 14}}
                                onClick={() => onAddTimeRange(groupIndex)}
                            >
                                <AddCircleOutlineRounded/>
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => onRemoveTimeRange(groupIndex, timeIndex)}
                            >
                                <DeleteIcon width={24} height={24} color={secondColor(500)}/>
                            </IconButton>
                        )}
                    </Stack>
                    <SelectMachines
                        onChange={(v) => onMachinesChange(groupIndex, timeIndex, v)}
                        options={[...machines]}
                        values={time.machines}
                    />
                </Stack>
    );
};

export {TimeRangeManager};
