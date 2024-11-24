import React, { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    FormControl,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { GoMakeModal } from "@/components";
import { TimeRangeManager } from "@/widgets/employees-working-hours-widgets/modals/components/time-range-manager";
import { IEmployeeWorkingHours, IStartEndTime } from "@/widgets/employees-working-hours-widgets/interface";
import {useWorkingHours} from "@/widgets/employees-working-hours-widgets/use-working-hours";
import {ActionButtons} from "@/widgets/employees-working-hours-widgets/modals/components/actionButtons";
import {HeaderComponent} from "@/widgets/employees-working-hours-widgets/modals/components/header-component";
import {useRecoilState} from "recoil";
import {employeesWorkingHoursState, machinesState} from "@/widgets/employees-working-hours-widgets/state";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

interface NewExceptionModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (exception: { date: Dayjs; times: IStartEndTime[] }) => void;
    selectedDate: Dayjs;
    times: IStartEndTime[];
    employee: IEmployeeWorkingHours;
}

const DayHoursModal: React.FC<NewExceptionModalProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 onSave,
                                                                 selectedDate,
                                                                 times,
                                                                 employee,
                                                             }) => {
    const [timeRanges, setTimeRanges] = useState<IStartEndTime[]>(times);
    const [, setError] = useState<string | null>(null);
    const [active, setActive] = useState<boolean>(null);
    const {convertTimeToDate} = useWorkingHours();
    const [machines] = useRecoilState(machinesState);
    const {mapMachinesWithEmployeesByDate} = useWorkingHours();
    const [employees,] = useRecoilState(employeesWorkingHoursState);
    const {t} = useTranslation();
    const {primaryColor} = useGomakeTheme();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActive(event.target.value === "true");
    };

    const handleAddTimeRange = () => {
        setTimeRanges([...timeRanges, { startTime: null, endTime: null, machines: [] }]);
    };

    const handleRemoveTimeRange = (index: number) => {
        setTimeRanges(timeRanges.filter((_, i) => i !== index));
    };

    const handleTimeChange = (groupIndex: number, index: number, field: 'startTime' | 'endTime', value: string) => {
        const dateValue = convertTimeToDate(value);
        const updatedRanges = timeRanges.map((time, i) =>
            i === index ? { ...time, [field]: dateValue } : time
        );
        setTimeRanges(updatedRanges);
    };

    const handleMachinesTimeChange = (groupIndex: number, timeIndex: number, values: string[]) => {
        const updatedRanges = timeRanges.map((time, i) =>
            i === timeIndex ? { ...time, machines: values } : time
        );
        setTimeRanges(updatedRanges);
    };

    const validateTimeRanges = (): boolean => {
        const sortedRanges = [...timeRanges].sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
        );

        for (let i = 0; i < sortedRanges.length - 1; i++) {
            const endCurrent = dayjs(sortedRanges[i].endTime);
            const startNext = dayjs(sortedRanges[i + 1].startTime);

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
            onSave(active ? { date: selectedDate, times: timeRanges } : {date: selectedDate, times: []});
            onClose();
        }
    };

    useEffect(() => {
        setTimeRanges(
            times.length > 0 ? times : [{ startTime: new Date(), endTime: new Date(), machines: [] }]
        );
        setActive(times.length > 0)
    }, [times]);

    return (
        <GoMakeModal
            insideStyle={{ height: 'fit-content', width: '650px' }}
            openModal={open}
            onClose={onClose}
            modalTitle={t('employeeWorkingHours.editDayHours')}
        >
            <Stack gap="20px">
                    <HeaderComponent employee={employee} date={selectedDate}/>
                <FormControl>
                    <FormLabel style={{...FONT_FAMILY.Inter(500, 18), color: primaryColor(500)}}>{t('employeeWorkingHours.employeeStatus')}</FormLabel>
                    <RadioGroup row value={active} onChange={handleChange}>
                        <FormControlLabel
                            style={{width: '50%'}}
                            value={true}
                            control={<Radio style={{color: primaryColor(500)}}/>}
                            label={t('usersSettings.active')}
                        />
                        <FormControlLabel
                            value={false}
                            control={<Radio style={{color: primaryColor(500)}}/>}
                            label={t('usersSettings.inactive')}
                        />
                    </RadioGroup>
                </FormControl>
                {active && (
                    <Box maxHeight="50vh" overflow="auto">
                        <Stack gap="20px">
                            {timeRanges.map((time, timeIndex) => (
                        <TimeRangeManager
                            timeIndex={timeIndex}
                            time={time}
                            groupIndex={0}
                            onTimeChange={handleTimeChange}
                            onMachinesChange={handleMachinesTimeChange}
                            onAddTimeRange={handleAddTimeRange}
                            onRemoveTimeRange={handleRemoveTimeRange}
                            machines={mapMachinesWithEmployeesByDate(machines, employees.filter(e => e.id !== employee.id), time.startTime, time.endTime, selectedDate)}
                        />))}</Stack>
                    </Box>
                )}
                <ActionButtons onSave={handleSave} onClose={onClose}/>
            </Stack>
        </GoMakeModal>
    );
};

export default DayHoursModal;
