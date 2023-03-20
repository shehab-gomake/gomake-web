import {EMissionType} from "@/shared/enums/mission-type";

const TYPE_MISSION_NAME_KEY = {
    [EMissionType.ENTIRE_COLUMNS_1]: 'board_col_1',
    [EMissionType.ENTIRE_COLUMNS_2]: 'board_col_2',
    [EMissionType.COVER]: 'board_cover',
    [EMissionType.VORSATZ]: 'board_vorsats',
}

export {TYPE_MISSION_NAME_KEY};