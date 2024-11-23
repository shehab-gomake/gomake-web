import {Avatar, Stack, TableCell} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import {IEmployeeWorkingHours} from "@/widgets/employees-working-hours-widgets/interface";
import {useHover} from "@/widgets/employees-working-hours-widgets/use-hover";
import {MenuButton} from "@/widgets/employees-working-hours-widgets/menu-button";
import {adaptLeft, adaptRight} from "@/utils/adapter";
import {useTranslation} from "react-i18next";

interface IProps extends IEmployeeWorkingHours {
    onClick: () => void;
}

const EmployeeNameCell = ({onClick, avatarInitials, lastname, firstname, imagePath}: IProps) => {
    const {hover, setHover} = useHover();
    const {t} = useTranslation();
    const direction = t('direction');
    return (
        <TableCell
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            component="th"
            scope="row"
            sx={{
                position: 'sticky',
                ...adaptRight(direction, 0),
                zIndex: 1,
                background: hover ? '#EAECF0' : 'white',
                fontWeight: 'bold',
                minWidth: '200px',
                padding: '0 16px',
                ...FONT_FAMILY.Inter(500, 14)
            }}
        >
            <div style={{position: 'absolute', top: '5px', ...adaptLeft(direction, 5)}}>
                {
                     hover && <MenuButton>
                        <MenuItem onClick={onClick}>{t('employeeWorkingHours.editDefaultHours')}</MenuItem>
                    </MenuButton>
                }
            </div>
            <Stack direction={'row'} alignItems={'center'} gap={'12px'}>
                <Avatar style={{fontSize: 16}}
                        src={imagePath}>{imagePath ? '' : avatarInitials.toUpperCase()}</Avatar>
                {`${firstname} ${lastname}`}
            </Stack>
        </TableCell>
    )
}

export {EmployeeNameCell}