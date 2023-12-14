import {useRecoilValue} from "recoil";
import {boardMissionsState} from "@/widgets/board-mission-widget/state/board-missions-state";

const useBoardMissionsHeader = () => {
  const boardMissions = useRecoilValue(boardMissionsState);
  return {
      boardMissions
  }
}

export {useBoardMissionsHeader}