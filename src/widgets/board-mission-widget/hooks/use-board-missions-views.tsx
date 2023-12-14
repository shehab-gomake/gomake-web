import {useRecoilValue} from "recoil";
import {boarMissionsCurViewState} from "@/widgets/board-mission-widget/state/boar-missions-cur-view-state";
import {EBoardMissionsViews} from "@/widgets/board-mission-widget/enums";
import Stack from "@mui/material/Stack";
import {
    StationsViewComponent
} from "@/widgets/board-mission-widget/components/board-missions-views/views/stations-view";

const useBoardMissionsViews = () => {
    const curView = useRecoilValue(boarMissionsCurViewState);

    const curViewComponent = () => {
        switch (curView) {
            case EBoardMissionsViews.STATIONS:
                return <StationsViewComponent/>;
            default:
                return <Stack>Coming soon...</Stack>
        }
    }
    return {
        curViewComponent
  }
}

export {useBoardMissionsViews}