// components/CalendarHeader.tsx
import React from 'react';
import {Box, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import {Dayjs} from 'dayjs';
import {useStyle} from "@/widgets/employees-working-hours-widgets/style";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {useRecoilState} from "recoil";
import {employeeWorkingHoursSearchState} from "@/widgets/employees-working-hours-widgets/state";

interface CalendarHeaderProps {
    dates: Dayjs[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({dates}) => {
    const {classes} = useStyle();
    const [search, setSearch] = useRecoilState(employeeWorkingHoursSearchState);
    return <TableHead style={{position: 'sticky', top: 0, zIndex: 2}}>
        <TableRow>
            <TableCell rowSpan={2} sx={{
                ...classes.tableHeader,
                position: 'sticky',
                left: 0,
                top: 0,
                zIndex: 3
            }}>
                <SearchInputComponent onChange={setSearch} value={search}/>
            </TableCell>
            {dates.map((date) => (
                <TableCell key={date.toString()} align="center" colSpan={2} sx={{...classes.tableHeader, minWidth: '358px'}}>
                    <Typography variant="body1" fontWeight="bold">
                        {date.format('ddd')} {date.format('DD')}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>
        <TableRow>
            {dates.map((date) => (
                <React.Fragment key={date.toString()}>
                    <TableCell align="center" sx={{...classes.tableHeader, fontWeight: 500}}>From - To</TableCell>
                    <TableCell align="center" sx={{...classes.tableHeader, fontWeight: 500}}>Total Hours</TableCell>
                </React.Fragment>
            ))}
        </TableRow>
    </TableHead>
};

export default CalendarHeader;
