import React, {useState} from 'react';
import {Modal, Box, Typography, TextField, Button, IconButton, ButtonGroup, Chip, Stack, Divider} from '@mui/material';
import {Add, Remove} from '@mui/icons-material';
import {IEmployeeDefaultWorkingHours} from "@/widgets/employees-working-hours-widgets/interface";
import {FONT_FAMILY} from "@/utils/font-family";
import {PrimaryButton} from "@/components/button/primary-button";
import {GoMakeModal} from "@/components";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {AddNewButton} from "@/components/button/add-new-button";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

interface IStartEndTime {
    startTime: string;
    endTime: string;
}


interface EditDefaultWorkingHoursModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (defaultWorkingHours: IEmployeeDefaultWorkingHours[]) => void;
    existingWorkingHours: IEmployeeDefaultWorkingHours[];
}

const DAYS = [
    {value: 0, label: 'Sun'},
    {value: 1, label: 'Mon'},
    {value: 2, label: 'Tue'},
    {value: 3, label: 'Wed'},
    {value: 4, label: 'Thu'},
    {value: 5, label: 'Fri'},
    {value: 6, label: 'Sat'},
];

const EditDefaultWorkingHoursModal: React.FC<EditDefaultWorkingHoursModalProps> = ({
                                                                                       open,
                                                                                       onClose,
                                                                                       onSave,
                                                                                       existingWorkingHours
                                                                                   }) => {
    const [dayGroups, setDayGroups] = useState<IEmployeeDefaultWorkingHours[]>(existingWorkingHours);
    const [error, setError] = useState<string | null>(null);
    const {secondColor} = useGomakeTheme();
    // Get all selected days to prevent duplicates
    const selectedDays = dayGroups.flatMap(group => group.days);

    const handleAddGroup = () => {
        setDayGroups([...dayGroups, {days: [], times: [{startTime: null, endTime: null}]}]);
    };

    const handleRemoveGroup = (index: number) => {
        setDayGroups(dayGroups.filter((_, i) => i !== index));
    };

    const handleDayToggle = (groupIndex: number, day: number) => {
        const group = dayGroups[groupIndex];
        const isSelected = group.days.includes(day);

        // Add or remove the day
        const updatedDays = isSelected
            ? group.days.filter(d => d !== day)
            : [...group.days, day];

        setDayGroups(dayGroups.map((g, i) => (i === groupIndex ? {...g, days: updatedDays} : g)));
    };

    const handleTimeChange = (groupIndex: number, timeIndex: number, field: 'startTime' | 'endTime', value: string) => {
        const updatedGroups = dayGroups.map((group, i) =>
            i === groupIndex
                ? {
                    ...group,
                    times: group.times.map((time, j) => (j === timeIndex ? {
                        ...time,
                        [field]: convertTimeToDate(value)
                    } : time))
                }
                : group
        );
        setDayGroups(updatedGroups);
    };

    const handleAddTimeRange = (groupIndex: number) => {
        setDayGroups(dayGroups.map((group, i) =>
            i === groupIndex ? {...group, times: [...group.times, {startTime: null, endTime: null}]} : group
        ));
    };

    const handleRemoveTimeRange = (groupIndex: number, timeIndex: number) => {
        setDayGroups(dayGroups.map((group, i) =>
            i === groupIndex ? {...group, times: group.times.filter((_, j) => j !== timeIndex)} : group
        ));
    };

    const validateGroups = (): boolean => {
        const allSelectedDays = dayGroups.flatMap(group => group.days);
        const uniqueDays = new Set(allSelectedDays);
        if (allSelectedDays.length !== uniqueDays.size) {
            setError('Each day can only be assigned to one group.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSave = () => {
        if (validateGroups()) {
            onSave(dayGroups.map(group => ({
                ...group,
                times: group.times.filter(time => time.endTime !== null && time.startTime !== null)
            })));
            onClose();
        }
    };

    const convertTimeToDate = (timeString) => {
        const [hours, minutes] = timeString?.split(':').map(Number);

        // Create a new Date object with today's date and set the hours and minutes
        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds

        return date;
    };

    const convertDateToTimeString = (date) => {
        const tDate = new Date(date);
        const hours = tDate.getHours().toString().padStart(2, '0'); // Get hours and pad to 2 digits
        const minutes = tDate.getMinutes().toString().padStart(2, '0'); // Get minutes and pad to 2 digits
        return `${hours}:${minutes}`;
    };


    return (
        <GoMakeModal openModal={open} modalTitle={'Edit Default Working Hours'}
                     insideStyle={{height: 'fit-content', width: 'fit-content'}} onClose={onClose}>
            <Box sx={{padding: '5px'}}>
                <Stack direction={'row'} justifyContent={'flex-end'} padding={'0 0 5px 0'}>
                    <AddNewButton onClick={handleAddGroup} label={'Add new group'}/>
                </Stack>
                <Box maxHeight={'600px'} overflow={'auto'}>
                    {dayGroups.map((group, groupIndex) => (
                        <Box key={groupIndex} mb={3}>
                            <Stack alignItems={'center'} direction={'row'} gap={'5px'}>
                                <span style={{minWidth: 'fit-content'}}>Group {groupIndex + 1}</span>
                                <ButtonGroup sx={{gap: '3px'}} variant="outlined">
                                    {DAYS.map((day) => (
                                        <PrimaryButton
                                            sx={{
                                                padding: '1px',
                                                minWidth: 0,
                                                width: 'auto',
                                                height: '25px', ...FONT_FAMILY.Inter(500, 12)
                                            }}
                                            key={day.value}
                                            onClick={() => handleDayToggle(groupIndex, day.value)}
                                            variant={dayGroups[groupIndex].days.includes(day.value) ? 'contained' : 'outlined'}
                                            disabled={selectedDays.includes(day.value) && !dayGroups[groupIndex].days.includes(day.value)}
                                        >
                                            {day.label}
                                        </PrimaryButton>
                                    ))}
                                </ButtonGroup>
                                {groupIndex !== 0 && (
                                    <IconButton color="error" onClick={() => handleRemoveGroup(groupIndex)}>
                                        <DeleteIcon color={secondColor(500)}/>
                                    </IconButton>
                                )}
                            </Stack>
                            <Box maxHeight={'150px'} overflow={'auto'}>
                                {group.times.map((time, timeIndex) => (
                                    <Box key={timeIndex} display="flex" alignItems="center" mt={2}>
                                        <TextField
                                            label="From"
                                            type="time"
                                            fullWidth
                                            value={convertDateToTimeString(time.startTime)}
                                            onChange={(e) => handleTimeChange(groupIndex, timeIndex, 'startTime', e.target.value)}
                                            sx={{mr: 1}}
                                        />
                                        <TextField
                                            label="To"
                                            type="time"
                                            fullWidth
                                            value={convertDateToTimeString(time.endTime)}
                                            onChange={(e) => handleTimeChange(groupIndex, timeIndex, 'endTime', e.target.value)}
                                            sx={{mr: 1}}
                                        />
                                        <IconButton  onClick={() => handleRemoveTimeRange(groupIndex, timeIndex)}
                                                    disabled={group.times.length === 1}>
                                            <Remove sx={{color: group.times.length > 1 && secondColor(500)}}/>
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                            <PrimaryButton sx={{fontSize: 14, padding: 0}} variant="text" startIcon={<Add/>}
                                           onClick={() => handleAddTimeRange(groupIndex)}>
                                Add More
                            </PrimaryButton>
                            <Divider/>
                        </Box>
                    ))}
                </Box>


                {error && (
                    <Typography color="error" mb={2}>
                        {error}
                    </Typography>
                )}
                <Stack padding={'10px 0 0 0'} direction={"row"} justifyContent={'space-between'} gap={'5px'}>
                    <PrimaryButton variant="outlined" color="primary" onClick={onClose}>
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton variant="contained" color="primary" onClick={handleSave}>
                        Add
                    </PrimaryButton>
                </Stack>
            </Box>
        </GoMakeModal>
    );
};

export default EditDefaultWorkingHoursModal;
