import { PStatus } from "./enums";

export interface BoardMissionFilters {
    signalrConnectionId: string;
    createDate?:Date;
    clientId?: string;
    agentId?: string;
    search?: string;
    fromDate?: Date;
    toDate?: Date;
    productsIds?: string[];
    productionStatus?: PStatus;
    pageNumber: number | null; 
    pageSize: number | null;
}
