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
import {useHover} from "@/widgets/employees-working-hours-widgets/use-hover";

interface CalendarHeaderProps {
    dates: Dayjs[];
}

const CalendarHeader: FC<CalendarHeaderProps> = ({dates}) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const direction = t('direction');
    const [search, setSearch] = useRecoilState(employeeWorkingHoursSearchState);
    const {hover, setHover} = useHover();
    return <TableHead style={{position: 'sticky', top: 0, zIndex: 2}}>
        <TableRow>
            <TableCell rowSpan={2} sx={{
                ...classes.tableHeader,
                position: 'sticky',
                top: 0,
                zIndex: 3,
                ...adaptRight(direction, 0)
            }}>
                <div onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}
                     style={{
                         borderRadius: '8px',
                         border: hover && '1px solid #7375CD',
                         boxShadow: hover && '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #D0D1ED'

                     }}>
                    <SearchInputComponent onChange={setSearch} value={search}/>
                </div>
            </TableCell>
            {dates.map((date) => (
                <TableCell key={date.toString()} align="center" colSpan={2}
                           sx={{...classes.tableHeader, minWidth: '360px'}}>
                    <Typography variant="body1" fontWeight="bold">
                        {date.format('ddd')} {date.format('DD')}
                    </Typography>
                </TableCell>
            ))}
        </TableRow>
        <TableRow>
            {dates.map((date) => (
                <Fragment key={date.toString()}>
                    <TableCell align="center" sx={{
                        ...classes.tableHeader,
                        fontWeight: 500
                    }}>{t('employeeWorkingHours.totalHours')}</TableCell>
                    <MachinesTableCell date={date}/>
                </Fragment>
            ))}
        </TableRow>
    </TableHead>
};

export default CalendarHeader;
