import {Box, Typography} from "@mui/material";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/settings-users/users/components/add-employee/style";
import {AddEmployeeTab, AddEmployeeTabs} from "@/widgets/settings-users/users/components/add-employee/components/tabs";
import {
    EmployeeGeneralForm
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/employee-general-form";
import {
    WorkingDaysForm
} from "@/widgets/settings-users/users/components/add-employee/components/working-days-form/working-days-form";
import {
    MissionsStationsForm
} from "@/widgets/settings-users/users/components/add-employee/components/missions-stations-form/missions-stations-form";
import {IAddEmployeeProps} from "@/widgets/settings-users/users/interface/components-props";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {convertWidthToVW} from "@/utils/adapter";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{
                    paddingLeft: convertWidthToVW(20),
                    paddingRight: convertWidthToVW(20),
                }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const AddEmployee = ({onClickAdd, action, onClickUpdate}: IAddEmployeeProps) => {
    const [value, setValue] = useState(0);
    const {t} = useTranslation();
    const {classes} = useStyle();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div style={classes.container}>
            <div style={classes.headerContainer}>
                <AddEmployeeTabs value={value} onChange={handleChange} aria-label="tabs example">
                    <AddEmployeeTab label={t('usersSettings.general')}/>
                    <AddEmployeeTab label={t('usersSettings.workingDays')}/>
                    <AddEmployeeTab label={t('usersSettings.missionStations')}/>
                </AddEmployeeTabs>
            </div>

            <CustomTabPanel value={value} index={0}>
                <EmployeeGeneralForm action={action}/>
                <div style={classes.btnContainer}>
                    <Button sx={classes.actionBtn} onClick={() => setValue(1)}>{t('usersSettings.next')}</Button>
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                <WorkingDaysForm/>
                <div style={classes.btnContainer}>
                    <Button sx={classes.actionBtn} onClick={() => setValue(2)}>{t('usersSettings.next')}</Button>
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                <MissionsStationsForm/>
                <div style={classes.btnContainer}>
                    {
                        action === EmployeeActions.ADD &&
                        <Button sx={classes.actionBtn} onClick={onClickAdd}>{t('usersSettings.add')}</Button>
                    }{
                    action === EmployeeActions.UPDATE &&
                    <Button sx={classes.actionBtn} onClick={onClickUpdate}>{t('usersSettings.update')}</Button>
                }
                </div>
            </CustomTabPanel>
        </div>
    );
}
export {AddEmployee}