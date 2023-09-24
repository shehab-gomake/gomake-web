import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/settings-users/users/components/add-employee/style";
import {
    EmployeeGeneralForm
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/employee-general-form";

import {IAddEmployeeProps} from "@/widgets/settings-users/users/interface/components-props";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {ITab} from "@/components/tabs/interface";
import {SecondaryTabsComponent} from "@/components/tabs/secondary-tabs";

const AddEmployee = ({onClickAdd, action, onClickUpdate}: IAddEmployeeProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const tabs: ITab[] = [
        {
            title: t("usersSettings.general"),
            component: <>
                <EmployeeGeneralForm action={action}/>
                <div style={classes.btnContainer}>
                    {
                        action === EmployeeActions.ADD &&
                        <Button sx={classes.actionBtn} onClick={onClickAdd}>{t('usersSettings.add')}</Button>
                    }{
                    action === EmployeeActions.UPDATE &&
                    <Button sx={classes.actionBtn} onClick={onClickUpdate}>{t('usersSettings.update')}</Button>
                }
                </div>
            </>
        },
    ];
    return (
        <div style={classes.container}>
            <SecondaryTabsComponent tabs={tabs} navigationButtons={true}/>
        </div>
    );
}
export {AddEmployee}