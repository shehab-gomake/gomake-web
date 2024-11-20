import {TableCell, TableHead, TableRow, Typography} from '@mui/material';
import {Dayjs} from 'dayjs';
import {useStyle} from "@/widgets/employees-working-hours-widgets/style";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {useRecoilState} from "recoil";
import {employeeWorkingHoursSearchState} from "@/widgets/employees-working-hours-widgets/state";
import {MachinesTableCell} from "@/widgets/employees-working-hours-widgets/employee-table-header/machines-cell";
import {FC, Fragment} from "react";
import {adaptRight} from "@/utils/adapter";
import {useTranslation} from "react-i18next";

interface CalendarHeaderProps {
    dates: Dayjs[];
}

const CalendarHeader: FC<CalendarHeaderProps> = ({dates}) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const direction = t('direction');
    const [search, setSearch] = useRecoilState(employeeWorkingHoursSearchState);
    return <TableHead style={{position: 'sticky', top: 0, zIndex: 2}}>
        <TableRow>
            <TableCell rowSpan={2} sx={{
                ...classes.tableHeader,
                position: 'sticky',
                top: 0,
                zIndex: 3,
                ...adaptRight(direction, 0)
            }}>
                <SearchInputComponent onChange={setSearch} value={search}/>
            </TableCell>
            {dates.map((date) => (
                <TableCell key={date.toString()} align="center" colSpan={2} sx={{...classes.tableHeader, minWidth: '360px'}}>
                    <Typography variant="body1" fontWeight="bold">
                        {date.format('ddd')} {date.format('DD')}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>
        <TableRow>
            {dates.map((date) => (
                <Fragment key={date.toString()}>
                    <TableCell align="center" sx={{...classes.tableHeader, fontWeight: 500}}>{t('employeeWorkingHours.totalHours')}</TableCell>
                    <MachinesTableCell date={date}/>
                </Fragment>
            ))}
        </TableRow>
    </TableHead>
};

export default CalendarHeader;
