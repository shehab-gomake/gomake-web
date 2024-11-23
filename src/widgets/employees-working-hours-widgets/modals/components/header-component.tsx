import React, {FC} from "react";
import {Avatar, Divider, Stack, Typography} from "@mui/material";
import {IEmployeeWorkingHours} from "@/widgets/employees-working-hours-widgets/interface";
import {Dayjs} from "dayjs";

interface EmployeeHeaderProps {
    employee: IEmployeeWorkingHours;
    date?: Dayjs;
}

const HeaderComponent: FC<EmployeeHeaderProps> = ({ employee, date }) => (
    <Stack paddingTop="32px" direction="row" alignItems="center" gap="32px">
    <Stack direction="row" alignItems="center" gap="12px">
        <Avatar
            src={employee.imagePath}
            alt={employee.firstname}
            sx={{ fontSize: 16 }}
        >
            {employee.imagePath ? '' : employee.avatarInitials.toUpperCase()}
        </Avatar>
        <Typography variant="body1" fontWeight={600}>
            {`${employee.firstname} ${employee.lastname}`}
        </Typography>
    </Stack>
        {date && (
            <Stack direction={'row'} gap={'32px'} alignItems={'center'}>
                <Divider flexItem orientation="vertical" />
                <Typography variant="body2" color="text.secondary">
                {`${date.format('dddd, D/MM/YYYY')}`}
            </Typography>
            </Stack>
        )}
    </Stack>
);

export {HeaderComponent}