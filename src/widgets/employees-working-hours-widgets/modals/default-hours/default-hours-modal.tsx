import React, {useState} from 'react';
import {Box, Stack, Divider,} from '@mui/material';
import {
    IEmployeeDefaultWorkingHours,
    IEmployeeWorkingHours,
} from "@/widgets/employees-working-hours-widgets/interface";
import {PrimaryButton} from "@/components/button/primary-button";
import {GoMakeModal} from "@/components";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {TimeRangeManager} from "@/widgets/employees-working-hours-widgets/modals/components/time-range-manager";
import {useWorkingHours} from "@/widgets/employees-working-hours-widgets/use-working-hours";
import {HeaderComponent} from "@/widgets/employees-working-hours-widgets/modals/components/header-component";
import {DaysComponent} from "@/widgets/employees-working-hours-widgets/modals/components/days-component";
import {ActionButtons} from "@/widgets/employees-working-hours-widgets/modals/components/actionButtons";
import {useRecoilState} from "recoil";
import {employeesWorkingHoursState, machinesState} from "@/widgets/employees-working-hours-widgets/state";
import {useTranslation} from "react-i18next";


interface EditDefaultWorkingHoursModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (defaultWorkingHours: IEmployeeDefaultWorkingHours[]) => void;
    existingWorkingHours: IEmployeeDefaultWorkingHours[];
    employee: IEmployeeWorkingHours;
}

const DefaultHoursModal: React.FC<EditDefaultWorkingHoursModalProps> = ({
                                                                            open,
                                                                            onClose,
                                                                            onSave,
                                                                            existingWorkingHours,
                                                                            employee
                                                                        }) => {
    const [dayGroups, setDayGroups] = useState<IEmployeeDefaultWorkingHours[]>(existingWorkingHours);
    const [employees] = useRecoilState(employeesWorkingHoursState)
    const [, setError] = useState<string | null>(null);
    const {secondColor} = useGomakeTheme();
    const {convertTimeToDate} = useWorkingHours();
    const selectedDays = dayGroups.flatMap(group => group.days);
    const [machines] = useRecoilState(machinesState);
    const {mapMachinesWithEmployeesByDayGroup} = useWorkingHours();
    const {t} = useTranslation();
    const handleAddGroup = () => {
        setDayGroups([...dayGroups, {days: [], times: [{startTime: null, endTime: null, machines: []}]}]);
    };

    const handleRemoveGroup = (index: number) => {
        setDayGroups(dayGroups.filter((_, i) => i !== index));
    };

    const handleDayToggle = (groupIndex: number, day: number) => {
        const group = dayGroups[groupIndex];
        const isSelected = group.days.includes(day);

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

    const handleMachinesTimeChange = (groupIndex: number, timeIndex: number, values: string[]) => {
        const updatedGroups = dayGroups.map((group, i) =>
            i === groupIndex
                ? {
                    ...group,
                    times: group.times.map((time, j) => (j === timeIndex ? {
                        ...time,
                        machines: values
                    } : time))
                }
                : group
        );
        setDayGroups(updatedGroups);
    };

    const handleAddTimeRange = (groupIndex: number) => {
        setDayGroups(dayGroups.map((group, i) =>
            i === groupIndex ? {
                ...group,
                times: [...group.times, {startTime: null, endTime: null, machines: []}]
            } : group
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


    return (
        <GoMakeModal openModal={open} modalTitle={t('employeeWorkingHours.editDefaultHours')}
                     insideStyle={{height: 'fit-content', maxHeight: '85vh', width: '550px'}} onClose={onClose}>
            <Stack gap={'20px'} sx={{padding: '5px'}} position={'relative'} height={'100%'}>
                <HeaderComponent employee={employee}/>
                <Box maxHeight={'600px'} overflow={'auto'}>
                    {dayGroups.map((group, groupIndex) => (
                        <Stack gap={'10px'} key={groupIndex}>
                            {groupIndex > 0 && <Divider style={{margin: '20px 0 0 0'}} flexItem/>}
                            <Stack alignItems={'start'} direction={'column'} gap={'5px'}>
                                <Stack width={'100%'} direction={'row'} justifyContent={'space-between'}
                                       alignItems={'center'}>
                                    <Stack direction={'row'} alignItems={'center'} gap={'3px'} minWidth={'fit-content'}>
                                        <span>{t('employeeWorkingHours.group')}</span>
                                        <span> {groupIndex + 1}</span>
                                    </Stack>
                                    {groupIndex > 0 && (
                                        <PrimaryButton sx={{padding: 0, display: 'flex', alignItems: 'center'}}
                                                       variant={'text'}
                                                       onClick={() => handleRemoveGroup(groupIndex)}>
                                            <DeleteIcon width={20} height={20} color={secondColor(500)}/>
                                            <span>{t('modal.delete')}</span>
                                        </PrimaryButton>
                                    )}
                                </Stack>
                                <DaysComponent groupIndex={groupIndex} days={dayGroups[groupIndex].days}
                                               selectedDays={selectedDays} onToggleDay={handleDayToggle}/>

                            </Stack>
                            <Stack gap="20px">
                                {group.times.map((time, timeIndex) => (
                                    <TimeRangeManager time={time}
                                                      timeIndex={timeIndex}
                                                      groupIndex={groupIndex}
                                                      onTimeChange={handleTimeChange}
                                                      onMachinesChange={handleMachinesTimeChange}
                                                      onAddTimeRange={handleAddTimeRange}
                                                      machines={mapMachinesWithEmployeesByDayGroup(machines, employees.filter(e => e.id !== employee.id), time.startTime, time.endTime, group.days)}
                                                      onRemoveTimeRange={handleRemoveTimeRange}/>
                                ))}</Stack>
                        </Stack>
                    ))}
                </Box>
                <Stack bgcolor={'#FFF'} gap={'8px'} padding={'10px 0 0 0'} position={'sticky'} bottom={0}>
                    <PrimaryButton style={{width: '100%'}} variant={'outlined'}
                                   onClick={handleAddGroup}> + {t('mailingSettings.addNewGroup')}</PrimaryButton>
                    <ActionButtons onClose={onClose} onSave={handleSave}/>
                </Stack>
            </Stack>
        </GoMakeModal>
    );
};

export default DefaultHoursModal;