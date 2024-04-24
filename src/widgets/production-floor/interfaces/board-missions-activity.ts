import {EActivityLogType, EActivityType} from "@/widgets/production-floor/enums/activity-type";

export interface IBoardMissionsActivity {
    id: string;
    activityType: EActivityType;
    userId: string;
    userName: string;
    userImages: string;
    text: string;
    logType: EActivityLogType;
    values: {source: string; current: string;};
}