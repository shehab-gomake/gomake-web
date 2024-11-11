export interface IEmployeeWorkingHours {
    firstname: string;
    lastname
    id: string;
    imagePath: string;
    avatarInitials: string;
    defaultWorkingHours: IEmployeeDefaultWorkingHours[];
    exceptionWorkingHours: IEmployeeExceptionWorkingHours[]
}

export interface IEmployeeDefaultWorkingHours {
    days: number[];
    times: IStartEndTime[]
}
export interface IStartEndTime {
    startTime: Date;
    endTime: Date;
}

export interface IEmployeeExceptionWorkingHours {
    date: Date;
    times: IStartEndTime[]
}