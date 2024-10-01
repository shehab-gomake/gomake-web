import { atom } from "recoil";
import { IBoardMissionsActivity } from "../interfaces/board-missions-activity";

export const boardMissionsActivitiesState = atom<IBoardMissionsActivity[]>({
  key: "boardMissionsActivitiesState",
  default: [],
});
