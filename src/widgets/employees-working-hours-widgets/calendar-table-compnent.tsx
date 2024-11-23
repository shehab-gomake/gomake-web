import {FC, useEffect, useState} from 'react';
import {Table, TableBody, TableContainer, Paper, Box, Typography, Stack, IconButton} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEmployeeWorkingHours } from '@/widgets/employees-working-hours-widgets/use-employee-working-hours';
import CalendarHeader from "@/widgets/employees-working-hours-widgets/employee-table-header/calendar-header-component";
import EmployeeRow from "@/widgets/employees-working-hours-widgets/employee-table-row/employee-row-component";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {HEADER_HEIGHT, SCREEN_HEIGHT} from "@/utils/layout-config";
import {convertHeightToVH} from "@/utils/adapter";
import {useMachines} from "@/widgets/employees-working-hours-widgets/use-machines";
import {useTranslation} from "react-i18next";
const CalendarTable: FC = () => {
    const { employees, getEmployees } = useEmployeeWorkingHours();
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const {getMachines} = useMachines();
    const {t} = useTranslation();
    const direction = t('direction');
    const getAllDatesInMonth = (month: Dayjs): Dayjs[] => {
        const startOfMonth = month.startOf('month');
        const endOfMonth = month.endOf('month');
        const dates: Dayjs[] = [];

        for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date = date.add(1, 'day')) {
            dates.push(date);
        }

        return dates;
    };

    const dates = getAllDatesInMonth(currentMonth);
    const handlePrevMonth = () => {
        setCurrentMonth((prevMonth) => prevMonth.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => prevMonth.add(1, 'month'));
    };

    useEffect(() => {
        getEmployees().then();
        getMachines().then();
    }, []);

    return (
        <Box bgcolor={'#FFF'}>
            <Stack height={'50px'} direction={direction === 'rtl' ? 'row-reverse' : 'row'} padding={'50px 0'} justifyContent={'space-between'} alignItems={'center'}>
                <IconButton onClick={handlePrevMonth}><NavigateBeforeIcon/></IconButton>
                <Typography variant="h4" fontWeight="bold">
                    {currentMonth.format('MMMM YYYY')}
                </Typography>
                <IconButton onClick={handleNextMonth}><NavigateNextIcon/></IconButton>
            </Stack>
            <TableContainer className={'custom-scrollbar'} component={Paper} sx={{ maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT - 105), overflow: 'auto', overflowY: 'auto' }}>
                <Table stickyHeader={true}>
            <CalendarHeader dates={dates}/>
                    <TableBody>
                        {employees.map((employee) => (
                            <EmployeeRow key={employee.id} employee={employee} dates={dates} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CalendarTable;
