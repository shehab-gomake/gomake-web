import React, {Fragment} from "react";
import { Stack, TableCell} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {IEmployeeWorkingHours, IStartEndTime} from "@/widgets/employees-working-hours-widgets/interface";
import {useWorkingHours} from "@/widgets/employees-working-hours-widgets/use-working-hours";
import {useStyle} from "@/widgets/employees-working-hours-widgets/style";
import {useHover} from "@/widgets/employees-working-hours-widgets/use-hover";
import {MenuButton} from "@/widgets/employees-working-hours-widgets/menu-button";
import {useMachines} from "@/widgets/employees-working-hours-widgets/use-machines";
import {MachineNameComponent} from "@/widgets/employees-working-hours-widgets/employee-table-row/machine-name";
import {Dayjs} from "dayjs";
import {useTranslation} from "react-i18next";
import {adaptLeft} from "@/utils/adapter";
import {useGomakeAxios} from "@/hooks";
import {resetEmployeesDayWorkingHoursApi} from "@/services/api-service/users/users-api";
import {useRecoilState} from "recoil";
import {employeesWorkingHoursState} from "@/widgets/employees-working-hours-widgets/state";

interface IProps {
    date: Dayjs;
    onClick: (date: Dayjs, hours: IStartEndTime[], id: string) => void;
    employee: IEmployeeWorkingHours;
}

const EmployeeHoursCell = ({date, onClick, employee}: IProps) => {
    const {formatTime, getWorkingHoursForDate} = useWorkingHours();
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const direction = t('direction');
    const workingHours = getWorkingHoursForDate(employee, date);
    const {hover, setHover} = useHover();
    const {classes} = useStyle();
    const {getEmployeeMachines} = useMachines();
    const [, setEmployees] = useRecoilState(employeesWorkingHoursState)

    const handleResetDayHours = async (id) => {
        const callBack = res => {
            if (res.success) {
                setEmployees(prev => prev.map(e => e.id === employee.id ? {
                    ...e,
                    exceptionWorkingHours: e.exceptionWorkingHours.filter(ex => ex.id !== id)
                } : e))
            }
        }
        await resetEmployeesDayWorkingHoursApi(callApi, callBack, {id})
    }
    return (
        <Fragment>
            <TableCell onMouseLeave={() => setHover(false)} onMouseOver={() => setHover(true)} align="center"
                       sx={{
                           ...classes.tableCell,
                           width: '50%',
                           position: 'relative',
                           backgroundColor: hover ? '#EAECF0' : '#FFF'
                       }}>
                <Stack position={'absolute'} top={'5px'} {...adaptLeft(direction, 5)}>
                    {
                        hover && <MenuButton>
                            <MenuItem onClick={() => onClick(date, workingHours.times, workingHours.id)}>{t('employeeWorkingHours.editDayHours')}</MenuItem>
                            {workingHours.isExceptionDay && <MenuItem onClick={() => handleResetDayHours(workingHours.id)}>{t('employeeWorkingHours.resetDefaultHours')}</MenuItem>}
                        </MenuButton>
                    }
                </Stack>
                {workingHours ? (
                    <Stack>
                        {workingHours.times.map((time, index) => (
                            <span key={index}>{`${formatTime(time.startTime)} - ${formatTime(time.endTime)}`}</span>
                        ))}
                    </Stack>
                ) : (
                    '-'
                )}
            </TableCell>
            <TableCell sx={{...classes.tableCell, width: '50%'}} align="center">
                <Stack dir={'ltr'} maxHeight={'60px'} overflow={'auto'} className={'custom-scrollbar small'} gap={'8px'}>
                    {
                        !!workingHours &&
                        getEmployeeMachines(workingHours.times.flatMap(time => time.machines)).map(machine => <MachineNameComponent key={machine.value} machineName={machine.label}/>)
                    }
                </Stack>
            </TableCell>
        </Fragment>
    )
}

export {EmployeeHoursCell}