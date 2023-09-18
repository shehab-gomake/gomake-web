import Button from "@mui/material/Button";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useEmployee} from "@/widgets/settings-users/users/use-employee";
import {TableFilter} from "@/widgets/settings-users/users/components/table-filter/table-filter";
import {UsersTable} from "@/widgets/settings-users/users/components/users-table/users-table";
import {useStyle} from "@/widgets/settings-users/users/style";

const UsersSettings = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {
        getAllUsers,
        onShowInActiveChange,
        getEmployees,
        toggleEmployeeActive,
        editEmployee,
        exportToExcel,
        updateSearch,
    } = useEmployee();

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div style={{position: "relative"}}>
            <div style={classes.header}>
                <div style={classes.headerBtn}>

                </div>
                <TableFilter
                    onChangeFilter={updateSearch}
                    onChangeShowInActive={onShowInActiveChange}
                ></TableFilter>
            </div>
            <UsersTable
                users={getEmployees()}
                onToggleEmployeeStatus={toggleEmployeeActive}
                onEditEmployee={editEmployee}
            />
            {getEmployees()?.length > 0 && (
                <div style={classes.footer}>
                    <Button sx={classes.exportBtn} onClick={exportToExcel}>
                        {t("usersSettings.excel")}
                    </Button>
                    <Button sx={classes.printBtn}>{t("usersSettings.print")}</Button>
                </div>
            )}
        </div>
    );
};

export {UsersSettings};
