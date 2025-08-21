export interface IStation {
  id: string;
  name: string;
  machineIds: string[];
  capacity: number;
  activeJobs: number;
}

export interface ICategory {
  id: string;
  name: string;
  icon: string;
  stations: IStation[];
}

export interface IStationWithMissions {
  station: IStation;
  missions: any[];
}
