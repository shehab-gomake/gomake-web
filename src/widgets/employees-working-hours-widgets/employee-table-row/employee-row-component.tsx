import {TableRow} from '@mui/material';
import {Dayjs} from 'dayjs';
import {
    IEmployeeWorkingHours,
    IStartEndTime
} from "@/widgets/employees-working-hours-widgets/interface";
import {FC, useState} from "react";
import DayHoursModal from "@/widgets/employees-working-hours-widgets/modals/day-hours/day-hours-modal";
import DefaultHoursModal from "@/widgets/employees-working-hours-widgets/modals/default-hours/default-hours-modal";
import {useGomakeAxios} from "@/hooks";
import {
    updateEmployeesDayWorkingHoursApi,
    updateEmployeesWorkingHoursApi
} from "@/services/api-service/users/users-api";
import {useEmployeeWorkingHours} from "@/widgets/employees-working-hours-widgets/use-employee-working-hours";
import {EmployeeNameCell} from "@/widgets/employees-working-hours-widgets/employee-table-row/employee-name";
import {EmployeeHoursCell} from "@/widgets/employees-working-hours-widgets/employee-table-row/Employee-hours";


interface EmployeeRowProps {
    employee: IEmployeeWorkingHours;
    dates: Dayjs[];
}

const EmployeeRow: FC<EmployeeRowProps> = ({employee, dates}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [openDefaultWorkingHoursModal, setOpenDefaultWorkingHoursModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const {callApi} = useGomakeAxios();
    const {updateEmployeeStateDefaultWorkingHours, updateEmployeeExceptionWorkingHours} = useEmployeeWorkingHours();
    const [selectedTimes, setSelectedTimes] = useState<IStartEndTime[]>([]);
    const [selectedId, setSelectedId] = useState<string>(null);
    const handleSaveException = async (exception) => {
        exception.date = new Date(exception.date)
        const callBack = res => {
            if (res.success) {
                updateEmployeeExceptionWorkingHours(exception, employee.id);
            }
        }
        await updateEmployeesDayWorkingHoursApi(callApi, callBack, {...exception, employeeId: employee.id, id: selectedId});
    };

    const updateEmployeeDefaultWorkingHours = async (workingHours) => {
        const callBack = (res) => {
            if (res.success) {
                updateEmployeeStateDefaultWorkingHours(employee.id, workingHours);
            }
        }
        await updateEmployeesWorkingHoursApi(callApi, callBack, {employeeId: employee.id, data: workingHours})
    }
    return (
        <>
            <TableRow key={employee.id}>
                <EmployeeNameCell onClick={() => setOpenDefaultWorkingHoursModal(true)} {...employee}/>
                {dates.map((date) => <EmployeeHoursCell key={date.toString()} employee={employee} date={date}
                                                        onClick={(d, h, id) => {
                                                            setModalOpen(true);
                                                            setSelectedDate(d);
                                                            setSelectedTimes(h);
                                                            setSelectedId(id);
                                                        }}/>)}
            </TableRow>
            <DefaultHoursModal open={openDefaultWorkingHoursModal}
                               onClose={() => setOpenDefaultWorkingHoursModal(false)}
                               onSave={updateEmployeeDefaultWorkingHours}
                               employee={employee}
                               existingWorkingHours={employee.defaultWorkingHours}/>
            <DayHoursModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveException}
                selectedDate={selectedDate}
                times={selectedTimes}
                employee={employee}
            />
        </>
    );
};

export default EmployeeRow;
