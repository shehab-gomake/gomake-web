// components/EmployeeRow.tsx
import {TableRow, TableCell, Chip, Stack, Button, Avatar} from '@mui/material';
import dayjs, {Dayjs} from 'dayjs';
import {
    IEmployeeDefaultWorkingHours,
    IEmployeeWorkingHours,
    IStartEndTime
} from "@/widgets/employees-working-hours-widgets/interface";
import {useWorkingHours} from "@/widgets/employees-working-hours-widgets/use-working-hours";
import React, {FC, Fragment, useState} from "react";
import NewExceptionModal from "@/widgets/employees-working-hours-widgets/exception-working-hours-modal";
import EditDefaultWorkingHoursModal from "@/widgets/employees-working-hours-widgets/default-working-hours-modal";
import {useGomakeAxios} from "@/hooks";
import {
    updateEmployeesDayWorkingHoursApi,
    updateEmployeesWorkingHoursApi
} from "@/services/api-service/users/users-api";
import {GoMakeModal} from "@/components";
import {useStyle} from "@/widgets/employees-working-hours-widgets/style";
import {FONT_FAMILY} from "@/utils/font-family";
import {useEmployeeWorkingHours} from "@/widgets/employees-working-hours-widgets/use-employee-working-hours";
import {OptionsButton} from "@/components/options-button/options-button";
import MenuItem from "@mui/material/MenuItem";

interface EmployeeRowProps {
    employee: IEmployeeWorkingHours;
    dates: Dayjs[];
}

const EmployeeRow: FC<EmployeeRowProps> = ({employee, dates}) => {
    const {formatTime, getWorkingHoursForDate} = useWorkingHours();
    const [modalOpen, setModalOpen] = useState(false);
    const [openDefaultWorkingHoursModal, setOpenDefaultWorkingHoursModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const {callApi} = useGomakeAxios();
    const [openModal, setOpenModal] = useState(false);
    const {classes} = useStyle();
    const {updateEmployeeStateDefaultWorkingHours, updateEmployeeExceptionWorkingHours} = useEmployeeWorkingHours();
    const [selectedTimes, setSelectedTimes] = useState<IStartEndTime[]>([])
    const handleOpenModal = () => {
        setModalOpen(true);
        setOpenModal(false)
    };
    const handleOpenDefaultWorkingHoursModal = () => {
        setOpenDefaultWorkingHoursModal(true);
        setOpenModal(false);
    };

    const handleSaveException = async (exception) => {
        exception.date = new Date(exception.date)
        const callBack = res => {
            if (res.success) {
                updateEmployeeExceptionWorkingHours(exception, employee.id);
            }
        }
        await updateEmployeesDayWorkingHoursApi(callApi, callBack, {...exception, employeeId: employee.id});
    };

    const updateEmployeeDefaultWorkingHours = async (workingHours) => {
        const callBack = (res) => {
            if (res.success) {
                updateEmployeeStateDefaultWorkingHours(employee.id, workingHours);
            }
        }
        await updateEmployeesWorkingHoursApi(callApi, callBack, {employeeId: employee.id, data: workingHours})
    }
    return (
        <>
            <TableRow key={employee.id}>
                <TableCell
                    component="th"
                    scope="row"
                    sx={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        background: 'white',
                        fontWeight: 'bold',
                        minWidth: '200px',
                        padding: '0 16px',
                        ...FONT_FAMILY.Inter(500, 14)
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'} gap={'12px'}>
                        <Avatar style={{fontSize: 16}}
                                src={employee?.imagePath}>{employee.imagePath ? '' : employee.avatarInitials.toUpperCase()}</Avatar>
                        {`${employee.firstname} ${employee.lastname}`}
                    </Stack>
                </TableCell>
                {dates.map((date) => {
                    const workingHours = getWorkingHoursForDate(employee, date);
                    const totalHours = workingHours
                        ? workingHours.reduce(
                            (sum, time) => sum + dayjs(time.endTime).diff(dayjs(time.startTime), 'hour', true),
                            0
                        )
                        : 0;
                    return (
                        <Fragment key={date.toString()}>
                            <TableCell align="center" sx={{...classes.tableCell, position: 'relative'}}>
                                <Stack position={'absolute'} top={'5px'} right={'5px'}>
                                    <OptionsButton withCircle={true}>
                                        <MenuItem>defult</MenuItem>
                                    </OptionsButton>
                                </Stack>
                                {workingHours ? (
                                    <Stack>
                                        {workingHours.map((time, index) => (
                                            <span key={index}>
                                            {`${formatTime(time.startTime)} - ${formatTime(time.endTime)}`}
                                        </span>
                                        ))}
                                    </Stack>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell sx={classes.tableCell} align="center">{totalHours || '-'}</TableCell>
                        </Fragment>
                    );
                })}
            </TableRow>
            <EditDefaultWorkingHoursModal open={openDefaultWorkingHoursModal}
                                          onClose={() => setOpenDefaultWorkingHoursModal(false)}
                                          onSave={updateEmployeeDefaultWorkingHours}
                                          existingWorkingHours={employee.defaultWorkingHours}/>
            <NewExceptionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveException}
                selectedDate={selectedDate}
                times={selectedTimes}
            />
            <GoMakeModal onClose={() => setOpenModal(false)} insideStyle={{width: 'fit-content', height: 'fit-content'}}
                         openModal={openModal}
                         modalTitle={`${employee.firstname} ${employee.lastname} working hours`}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} gap={'20px'} width={'400px'}
                       height={'180px'}>
                    <Button sx={{width: '150px', height: '150px'}} variant={'contained'}
                            onClick={handleOpenDefaultWorkingHoursModal}>default</Button>
                    <Button sx={{width: '150px', height: '150px'}} variant={'contained'} color={'secondary'}
                            onClick={handleOpenModal}>this day</Button>
                </Stack>
            </GoMakeModal>
        </>
    );
};

export default EmployeeRow;
