import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React, {useState} from "react";
import {useStyle} from "@/widgets/employees-working-hours-widgets/style";
import {MenuButton} from "@/widgets/employees-working-hours-widgets/menu-button";
import MenuItem from "@mui/material/MenuItem";
import {useHover} from "@/widgets/employees-working-hours-widgets/use-hover";
import {Dayjs} from "dayjs";
import {useWorkingHours} from "@/widgets/employees-working-hours-widgets/use-working-hours";
import {useRecoilState} from "recoil";
import {
    employeesWorkingHoursState,
    machinesState
} from "@/widgets/employees-working-hours-widgets/state";
import {GoMakeModal} from "@/components";
import {FONT_FAMILY} from "@/utils/font-family";
import {useTranslation} from "react-i18next";

interface IProps {
    date: Dayjs;
}

const MachinesTableCell = ({date}: IProps) => {
    const {classes} = useStyle();
    const {hover, setHover} = useHover();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {getEmployeesForMachineOnDate} = useWorkingHours();
    const [employees] = useRecoilState(employeesWorkingHoursState);
    const [machines] = useRecoilState(machinesState);
    const {t} = useTranslation();
    return <>
        <TableCell align="center"
                   onMouseLeave={() => setHover(false)}
                   onMouseOver={() => setHover(true)}
                   sx={{
                       ...classes.tableHeader,
                       fontWeight: 500,
                       position: 'relative'
                   }}>
            <span>{t('tabs.machines')}</span>
            {
                hover &&
                <div style={{position: 'absolute', right: '10px', top: '20%'}}>
                    <MenuButton>
                        <MenuItem
                            onClick={() => setOpenModal(true)}>{t('employeeWorkingHours.machinesEmployeesModalTitle')}</MenuItem>
                    </MenuButton>
                </div>
            }
        </TableCell>
        <GoMakeModal openModal={openModal} onClose={() => setOpenModal(false)}
                     modalTitle={`${t('employeeWorkingHours.totalMachines')} (${machines.length})`}>
            <h5 style={{
                ...FONT_FAMILY.Inter(400, 14),
                color: '#475467',
                paddingBottom: '24px'
            }}>{`${date.format('ddd')} ${date.format('DD')}, ${date.format('YYYY')}`}</h5>
            <TableContainer style={{border: '1px solid #EAECF0'}}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{
                                backgroundColor: '#EAECF0',
                                color: '#475467', ...FONT_FAMILY.Inter(500, 12)
                            }}>{t('tabs.machines')}</TableCell>
                            <TableCell
                                style={{backgroundColor: '#EAECF0', color: '#475467', ...FONT_FAMILY.Inter(500, 12)}}
                                align="center">{t('tabs.employees')}</TableCell>
                            <TableCell
                                style={{backgroundColor: '#EAECF0', color: '#475467', ...FONT_FAMILY.Inter(500, 12)}}
                                align="center">{t('usersSettings.status')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {machines.map((machine) => (
                            <TableRow
                                key={machine.value}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                style={{color: '#475467', ...FONT_FAMILY.Inter(500, 14)}}
                            >
                                <TableCell component="th" scope="row" style={{maxWidth: '40%'}}>
                                    {machine.label}
                                </TableCell>
                                <TableCell
                                    align="center">{getEmployeesForMachineOnDate(employees, machine.value, date).map(e => e.firstname)}</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </GoMakeModal>
    </>
}

export {MachinesTableCell}