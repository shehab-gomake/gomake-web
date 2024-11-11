// components/NewExceptionModal.tsx
import React, {useEffect, useState} from 'react';
import {Modal, Box, Typography, TextField, Button, IconButton, Stack} from '@mui/material';
import {Add, Remove} from '@mui/icons-material';
import dayjs, {Dayjs} from 'dayjs';
import {GoMakeModal} from "@/components";
import {PrimaryButton} from "@/components/button/primary-button";
import {IStartEndTime} from "@/widgets/employees-working-hours-widgets/interface";


interface NewExceptionModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (exception: { date: Dayjs; times: IStartEndTime[] }) => void;
    selectedDate: Dayjs;
    times: IStartEndTime[];
}

const NewExceptionModal: React.FC<NewExceptionModalProps> = ({open, onClose, onSave, selectedDate, times}) => {
    const [timeRanges, setTimeRanges] = useState<IStartEndTime[]>(times);
    const [error, setError] = useState<string | null>(null);

    const handleAddTimeRange = () => {
        setTimeRanges([...timeRanges, {startTime: null, endTime: null}]);
    };

    const handleRemoveTimeRange = (index: number) => {
        setTimeRanges(timeRanges.filter((_, i) => i !== index));
    };

    const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const dateValue = convertTimeToDate(value)
        const updatedRanges = timeRanges.map((time, i) => (i === index ? {...time, [field]: dateValue} : time));
        setTimeRanges(updatedRanges);
    };

    const validateTimeRanges = (): boolean => {
        const sortedRanges = [...timeRanges].sort((a, b) => dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm')));

        for (let i = 0; i < sortedRanges.length - 1; i++) {
            const endCurrent = dayjs(sortedRanges[i].endTime, 'HH:mm');
            const startNext = dayjs(sortedRanges[i + 1].startTime, 'HH:mm');

            if (endCurrent.isAfter(startNext)) {
                setError('Time ranges cannot overlap');
                return false;
            }
        }

        setError(null);
        return true;
    };

    const handleSave = () => {
        if (validateTimeRanges()) {
            onSave({date: selectedDate, times: timeRanges});
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

    useEffect(()=>{setTimeRanges(times)}, [times])

    return (
        <GoMakeModal insideStyle={{width: 'fit-content', height: 'fit-content'}} openModal={open} onClose={onClose}
                     modalTitle={'Add working hours'}>
            <Box>
                <Typography>
                    {selectedDate?.format('MMMM DD, YYYY')}
                </Typography>
                <Box maxHeight={'300px'} overflow={'auto'}>
                    {timeRanges.map((time, index) => (
                        <Stack direction={'row'} gap={'10px'} key={index} display="flex" alignItems="center" mb={2}>
                            <TextField
                                type="time"
                                fullWidth
                                value={convertDateToTimeString(time.startTime)}
                                onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                sx={{mr: 1}}
                            />
                            <TextField
                                type="time"
                                fullWidth
                                value={convertDateToTimeString(time.endTime)}
                                onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                sx={{mr: 1}}
                            />
                            <IconButton onClick={() => handleRemoveTimeRange(index)} disabled={timeRanges.length === 1}>
                                <Remove/>
                            </IconButton>
                        </Stack>
                    ))}
                </Box>


                <PrimaryButton sx={{fontSize: 14, padding: 0}} variant="text" startIcon={<Add/>}
                               onClick={handleAddTimeRange}>
                    Add More
                </PrimaryButton>

                {error && (
                    <Typography color="error" mb={2}>
                        {error}
                    </Typography>
                )}
                <Stack direction={"row"} justifyContent={'space-between'} gap={'5px'}>
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

export default NewExceptionModal;
