import { MouseEvent} from "react";
import {EBoardMissionsViews} from "@/widgets/board-mission-widget/enums";
import {useRecoilState} from "recoil";
import {boarMissionsCurViewState} from "@/widgets/board-mission-widget/state/boar-missions-cur-view-state";

const useBoardMissionsNavigationButtons = () => {
  const [curView, setCurView] = useRecoilState<EBoardMissionsViews>(boarMissionsCurViewState);
  const boardMissionsViews = [
    {value: EBoardMissionsViews.STATIONS, labelKey: 'station'},
    {value: EBoardMissionsViews.FILES, labelKey: 'files'},
    {value: EBoardMissionsViews.APPROVAL, labelKey: 'approval'},
    {value: EBoardMissionsViews.ACTIVITY, labelKey: 'activity'},
  ];

  const handleViewChange = (e: MouseEvent<HTMLElement>, newView: EBoardMissionsViews) => {
    setCurView(newView);
  }
  return {
    curView,
    handleViewChange,
    boardMissionsViews
  }
}

export {useBoardMissionsNavigationButtons}