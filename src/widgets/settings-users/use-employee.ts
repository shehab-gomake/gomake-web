import {useRecoilState} from "recoil";
import {employeeState, initState} from "@/store/employee-state";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useCallback, useState} from "react";
import {IUser} from "@/widgets/settings-users/interface/user";
import {useTranslation} from "react-i18next";
import * as XLSX from 'xlsx/xlsx.mjs';
import {saveAs} from 'file-saver';
import {EmployeeActions} from "@/widgets/settings-users/enums/employee-actions";

const useEmployee = () => {
    const {setSnackbarStateValue} = useSnackBar();
    const [employee, setEmployeeState] = useRecoilState(employeeState);
    const [users, setUsers] = useState<IUser[]>([]);
    const [showInActiveEmployees, setShowInActiveEmployees] = useState<boolean>(false);
    const {callApi} = useGomakeAxios();
    const [openModal, setOpenModal] = useState(false);
    const [action, setAction] = useState<EmployeeActions | null>(null);
    const [search, setSearch] = useState<string>('');
    const {t} = useTranslation();

    const getAllUsers = () => {
        callApi('GET', '/v1/crm-service/employee/get-employees').then(
            (res) => {
                setUsers(res.data?.data?.data);
            }
        )
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
                    user.role?.includes(search)
                )
            }

            return showInActiveEmployees ? usersArray : usersArray.filter((user: IUser) => user.isActive);
        }
        return usersArray
    }, [users, showInActiveEmployees, search])

    const editEmployee = (id: string) => {
        callApi('GET', '/v1/crm-service/employee/get-employee/' + id).then(
            (res) => {
                setEmployeeState({...employee, employee: {...employee.employee, ...res?.data?.data?.data}});
                setAction(EmployeeActions.UPDATE);
                setOpenModal(true);
            }
        )
    }

    const toggleEmployeeActive = (id: string) => {
        callApi('PUT', '/v1/crm-service/employee/toggle-employee-active/' + id)
            .then((res) => {
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
                } else {
                    setSnackbarStateValue({
                        state: true,
                        message: t("modal.updatedfailed"),
                        type: "error",
                    });
                }
            })
    }

    const onAddEmployee = () => {
        callApi('POST', '/v1/crm-service/employee/add-employee', employee).then()
    }
    const onUpdateEmployee = () => {
        callApi('PUT', '/v1/crm-service/employee/update-employee', employee).then()
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