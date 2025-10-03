export interface IEmployeeWorkingHours {
  firstname: string;
  lastname;
  id: string;
  imagePath: string;
  avatarInitials: string;
  defaultWorkingHours: IEmployeeDefaultWorkingHours[];
  exceptionWorkingHours: IEmployeeExceptionWorkingHours[];
}

export interface IEmployeeDefaultWorkingHours {
  days: number[];
  times: IStartEndTime[];
}
export interface IStartEndTime {
  startTime: Date;
  endTime: Date;
  machines: string[];
}

export interface IEmployeeExceptionWorkingHours {
  id: string;
  date: Date;
  times: IStartEndTime[];
}

export interface IWorkingHoursMachine {
  label: string;
  value: string;
  category?: string;
  employees?: string[];
  minManpowerOperation: number;
}
