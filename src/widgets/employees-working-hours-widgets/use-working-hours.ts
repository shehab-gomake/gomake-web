// hooks/useWorkingHours.ts
import dayjs, { Dayjs } from 'dayjs';
import {IEmployeeWorkingHours, IStartEndTime} from "@/widgets/employees-working-hours-widgets/interface";

const useWorkingHours = () => {
    const formatTime = (date: Date): string => dayjs(date).format('HH:mm');

    const getWorkingHoursForDate = (employee: IEmployeeWorkingHours, date: Dayjs): IStartEndTime[] | null => {
        const exception = employee.exceptionWorkingHours.find((ex) => dayjs(ex.date).isSame(date, 'day'));
        if (exception) return exception.times;

        const dayOfWeek = date.day();
        const defaultHours = employee.defaultWorkingHours.find((dh) => dh.days.includes(dayOfWeek));
        return defaultHours ? defaultHours.times : null;
    };

    return { formatTime, getWorkingHoursForDate };
};

export {useWorkingHours}