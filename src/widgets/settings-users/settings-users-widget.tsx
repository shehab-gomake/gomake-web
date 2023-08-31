import {UsersTable} from "@/widgets/settings-users/components/users-table/users-table";
import {TableFilter} from "@/widgets/settings-users/components/table-filter/table-filter";
import Button from "@mui/material/Button";
import {GoMakeModal} from "@/components";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useStyle} from "@/widgets/settings-users/style";
import {useEmployee} from "@/widgets/settings-users/use-employee";
import {AddEmployee} from "@/widgets/settings-users/components/add-employee/add-employee";

const SettingsUsersWidget = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {
        getAllUsers,
        handleAddEmployeeClick,
        onShowInActiveChange,
        getEmployees,
        toggleEmployeeActive,
        editEmployee,
        exportToExcel,
        openModal,
        setOpenModal,
        onAddEmployee,
        action,
        onUpdateEmployee,
        updateSearch
    } = useEmployee();


    useEffect(() => {
        getAllUsers();
    }, [])


    return (
        <div style={{position: 'relative'}}>
            <div style={classes.header}>
                <div style={classes.headerBtn}>
                    <Button sx={classes.addBtn} startIcon={<AddBoxOutlinedIcon/>} variant={'contained'}
                            onClick={handleAddEmployeeClick}>{t('usersSettings.addEmployee')}</Button>
                </div>
                <TableFilter onChangeFilter={updateSearch} onChangeShowInActive={onShowInActiveChange}></TableFilter>
            </div>
            <UsersTable users={getEmployees()} onToggleEmployeeStatus={toggleEmployeeActive}
                        onEditEmployee={editEmployee}/>
            {
                getEmployees()?.length > 0 && <div style={classes.footer}>
                    <Button sx={classes.exportBtn} onClick={exportToExcel}>{t('usersSettings.excel')}</Button>
                    <Button sx={classes.printBtn}>{t('usersSettings.print')}</Button>
                </div>
            }
            <GoMakeModal insideStyle={{paddingLeft: 0, paddingRight: 0}} headerPadding={20} openModal={openModal}
                         onClose={() => setOpenModal(false)}
                         modalTitle={t('usersSettings.addEmployee')}>
                <AddEmployee onClickUpdate={onUpdateEmployee} action={action} onClickAdd={onAddEmployee}/>
            </GoMakeModal>
        </div>
    )
}

export {SettingsUsersWidget}