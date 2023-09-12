import {useRecoilState} from "recoil";
import {employeeState, initState} from "@/store/employee-state";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useCallback, useState} from "react";

import {useTranslation} from "react-i18next";
import * as XLSX from 'xlsx/xlsx.mjs';
import {saveAs} from 'file-saver';
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {IUser} from "@/widgets/settings-users/users/interface/user";
import {addEmployeeOpenModalState, employeeActionState} from "@/widgets/settings-users/state/open-modat-state";
import {IUserData} from "@/widgets/settings-users/users/interface/employee";
import {usersArrayState} from "@/widgets/settings-users/state/users-state";
import {emailRegex} from "@/utils/regex";
import {
    addNewEmployee,
    getAllUsersApi,
    getEmployeeApi,
    toggleEmployeeStatus,
    updateEmployee
} from "@/services/api-service/users/users-api";


const useEmployee = () => {
    const {setSnackbarStateValue} = useSnackBar();
    const [employee, setEmployeeState] = useRecoilState<IUserData>(employeeState);
    const [users, setUsers] = useRecoilState<IUser[]>(usersArrayState);
    const [showInActiveEmployees, setShowInActiveEmployees] = useState<boolean>(false);
    const {callApi} = useGomakeAxios();
    const [openModal, setOpenModal] = useRecoilState<boolean>(addEmployeeOpenModalState);
    const [action, setAction] = useRecoilState<EmployeeActions | null>(employeeActionState);
    const [search, setSearch] = useState<string>('');
    const {t} = useTranslation();

    const getAllUsers = () => {
        getAllUsersApi(callApi, setUsers).then();
    }
    const onShowInActiveChange = (value: boolean) => {
        setShowInActiveEmployees(value);
    }

    const getEmployees = useCallback(() => {
        let usersArray = [...users];
        if (usersArray?.length > 0) {
            if (search) {
                usersArray = usersArray.filter(user =>
                    user.email?.includes(search) ||
                    user.firstname?.includes(search) ||
                    user.lastname?.includes(search) ||
                    user.phone?.includes(search) ||
                    user.role?.includes(search) ||
                    (user.firstname + ' ' + user.lastname).includes(search)
                )
            }

            return showInActiveEmployees ? usersArray : usersArray.filter((user: IUser) => user.isActive);
        }
        return usersArray
    }, [users, showInActiveEmployees, search])

    const editEmployee = (id: string) => {
        getEmployeeApi(callApi, setEmployeeState, id).then(() => {
            setAction(EmployeeActions.UPDATE);
            setOpenModal(true);

        });
    }

    const toggleEmployeeActive = (id: string) => {
        toggleEmployeeStatus(callApi, undefined, id).then(
            (res) => {
                if (res.success) {
                    setSnackbarStateValue({
                        state: true,
                        message: t("modal.updatedSusuccessfully"),
                        type: "sucess",
                    });
                    setUsers(
                        users.map(
                            user => {
                                return user.id === id ? {...user, isActive: !user.isActive} : user
                            }))
                }
                else {
                    setSnackbarStateValue({
                        state: true,
                        message: t("modal.updatedfailed"),
                        type: "error",
                    });
                }
            }
        )

    }

    const onAddEmployee = () => {
        if (isValidAddEmployee() && validateEmail()) {
            addNewEmployee(callApi, undefined, employee).then(
                (res) => {
                    if (res.success) {
                        setSnackbarStateValue({
                            state: true,
                            message: t("modal.addedSusuccessfully"),
                            type: "sucess",
                        });
                        const newEmployee: IUser = res.data
                        setUsers([newEmployee, ...users]);
                        setOpenModal(false);
                        setEmployeeState(initState);
                    } else {
                        setSnackbarStateValue({
                            state: true,
                            message: t("modal.addedfailed"),
                            type: "error",
                        });
                    }
                }
            )
        }
    }
    const onUpdateEmployee = () => {
        if (isValidEditEmployee() && validateEmail()) {
            updateEmployee(callApi, undefined, employee).then(
                (res) => {
                    if (res.success) {
                        const newEmployee = res.data;
                        setUsers(users.map(user => user.id === newEmployee?.id ? newEmployee : user))
                        setOpenModal(false);
                        setEmployeeState(initState);
                        setSnackbarStateValue({
                            state: true,
                            message: t("modal.updatedSusuccessfully"),
                            type: "sucess",
                        });
                    } else {
                        setSnackbarStateValue({
                            state: true,
                            message: t("modal.updatedfailed"),
                            type: "error",
                        });
                    }
                }
            )
        }
    }

    const handleAddEmployeeClick = () => {
        setEmployeeState(initState);
        setAction(EmployeeActions.ADD);
        setOpenModal(true);
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'}); // Change 'buffer' to 'array'
        const excelBlob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(excelBlob, 'users.xlsx');
    }

    const isValidAddEmployee = () => {
        return !!employee.employee.firstname &&
            !!employee.employee.lastname &&
            !!employee.username &&
            !!employee.password &&
            !!employee.roleID

    };

    const validateEmail = () => !!employee.employee.email ? emailRegex.test(employee.employee.email) : true;
    const isValidEditEmployee = () => {
        return !!employee.employee.firstname &&
            !!employee.employee.lastname &&
            !!employee.username &&
            !!employee.roleID
    }
    const updateSearch = (value: string) => {
        setSearch(value);
    }
    return {
        getEmployees,
        onShowInActiveChange,
        showInActiveEmployees,
        editEmployee,
        openModal,
        toggleEmployeeActive,
        onAddEmployee,
        handleAddEmployeeClick,
        exportToExcel,
        getAllUsers,
        setOpenModal,
        action,
        onUpdateEmployee,
        updateSearch,
        t
    }
}

export {useEmployee}