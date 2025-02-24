import dayjs, {Dayjs} from 'dayjs';
import {
    IEmployeeWorkingHours,
    IStartEndTime,
    IWorkingHoursMachine
} from "@/widgets/employees-working-hours-widgets/interface";

const convertTimeToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const useWorkingHours = () => {
    const formatTime = (date: Date): string => dayjs(date).format('HH:mm');

    const getWorkingHoursForDate = (employee: IEmployeeWorkingHours, date: Dayjs): {times: IStartEndTime[] | null, isExceptionDay: boolean; id?: string} => {
        const exception = employee.exceptionWorkingHours.find((ex) => dayjs(ex.date).isSame(date, 'day'));
        if (exception) return {times: exception.times, isExceptionDay: true, id: exception.id};

        const dayOfWeek = date.day();
        const defaultHours = employee.defaultWorkingHours.find((dh) => dh.days.includes(dayOfWeek));
        return {times: defaultHours ? defaultHours.times : [], isExceptionDay: false};
    };

    const getEmployeesForMachineOnDate = (
        employees: IEmployeeWorkingHours[],
        machineId: string,
        date: Dayjs
    ): IEmployeeWorkingHours[] => {
        return employees.filter(employee => {
            const workingHours = getWorkingHoursForDate(employee, date);
            return workingHours.times?.some(timeRange => timeRange.machines.includes(machineId));
        });
    };


    const mapMachinesWithEmployeesByDayGroup = (
        machines: IWorkingHoursMachine[],
        employees: IEmployeeWorkingHours[],
        startTime: Date,
        endTime: Date,
        daysGroup: number[]
    ): IWorkingHoursMachine[] => {
        return machines.map((machine) => {
            const usingEmployees: Set<string> = new Set();

            employees.forEach((employee) => {
                const allWorkingHours = employee.defaultWorkingHours;

                allWorkingHours.forEach((workingHour) => {
                    const overlappingDays = workingHour.days.some((day) => daysGroup.includes(day));
                    if (overlappingDays) {
                        workingHour.times.forEach((timeRange) => {
                            if (
                                isOverlapping(
                                    {startTime, endTime, machines: []},
                                    timeRange
                                ) &&
                                timeRange.machines.includes(machine.value)
                            ) {
                                usingEmployees.add(`${employee.firstname} ${employee.lastname}`);
                            }
                        });
                    }
                });
            });

            return {
                ...machine,
                employees: Array.from(usingEmployees),
            };
        });
    };

    const mapMachinesWithEmployeesByDate = (
        machines: IWorkingHoursMachine[],
        employees: IEmployeeWorkingHours[],
        startTime: Date,
        endTime: Date,
        date: Dayjs
    ): IWorkingHoursMachine[] => {
        return machines.map((machine) => {
            const usingEmployees: Set<string> = new Set();

            employees.forEach((employee) => {
                const allWorkingHours = getWorkingHoursForDate(employee, date);

                allWorkingHours.times.forEach((workingHour) => {
                    if (isOverlapping({
                        startTime,
                        endTime,
                        machines: []
                    }, workingHour) && workingHour.machines.includes(machine.value)) {
                        usingEmployees.add(`${employee.firstname} ${employee.lastname}`);
                    }
                });
            });

            return {
                ...machine,
                employees: Array.from(usingEmployees),
            };
        });
    };

    const isOverlapping = (
        range1: IStartEndTime,
        range2: IStartEndTime
    ): boolean => {
        const time1Start = range1.startTime instanceof Date ? range1.startTime : new Date(range1.startTime);
        const time1End = range1.endTime instanceof Date ? range1.endTime : new Date(range1.endTime);
        const time2Start = range2.startTime instanceof Date ? range2.startTime : new Date(range2.startTime);
        const time2End = range2.endTime instanceof Date ? range2.endTime : new Date(range2.endTime);

        const normalizedTime1Start = new Date(0, 0, 0, time1Start.getHours(), time1Start.getMinutes());
        const normalizedTime1End = new Date(0, 0, 0, time1End.getHours(), time1End.getMinutes());
        const normalizedTime2Start = new Date(0, 0, 0, time2Start.getHours(), time2Start.getMinutes());
        const normalizedTime2End = new Date(0, 0, 0, time2End.getHours(), time2End.getMinutes());

        return normalizedTime1Start < normalizedTime2End && normalizedTime2Start < normalizedTime1End;
    };


    return {
        formatTime,
        getWorkingHoursForDate,
        getEmployeesForMachineOnDate,
        convertTimeToDate,
        mapMachinesWithEmployeesByDate,
        mapMachinesWithEmployeesByDayGroup
    };
};

export {useWorkingHours, convertTimeToDate}