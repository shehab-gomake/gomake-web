import {EStatementCategory} from "@/widgets/production-floor/enums/statement-category";
import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";

export interface IProductionFloorGroupData {
    category: number;
    statementId?: string;
    statementValue: string;
    valueId: string;
    value: string;
    clients: number;
    machines: string[];
    boardMissionStatuses: IProductionFloorGroupStatus[];
    groupName: string;
}

export interface IUserProductionFloorGroup {
    id: string;
    statementCategory: EStatementCategory;
    statementId?: string;
    statementValue?: any;
    groupName: string;
}
export interface IProductionFloorGroupStatus {
    boardMissionStatus: IProductionStatus

    count: string;
}