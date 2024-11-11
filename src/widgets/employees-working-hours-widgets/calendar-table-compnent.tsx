// components/CalendarTable.tsx
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableContainer, Paper, Box, Typography, Button, Stack, IconButton} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEmployeeWorkingHours } from '@/widgets/employees-working-hours-widgets/use-employee-working-hours';
import CalendarHeader from "@/widgets/employees-working-hours-widgets/calendar-header-component";
import EmployeeRow from "@/widgets/employees-working-hours-widgets/employee-row-component";
import EditDefaultWorkingHoursModal from "@/widgets/employees-working-hours-widgets/default-working-hours-modal";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
const CalendarTable: React.FC = () => {
    const { employees, getEmployees } = useEmployeeWorkingHours();
    const [currentMonth, setCurrentMonth] = useState(dayjs());
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

    // Function to go to the next month
    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => prevMonth.add(1, 'month'));
    };

    useEffect(() => {
        getEmployees().then();
    }, []);

    return (
        <Box bgcolor={'#FFF'}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <IconButton onClick={handlePrevMonth}><NavigateBeforeIcon/></IconButton>
                <Typography variant="h4" fontWeight="bold">
                    {currentMonth.format('MMMM YYYY')}
                </Typography>
                <IconButton onClick={handleNextMonth}><NavigateNextIcon/></IconButton>
            </Stack>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
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
