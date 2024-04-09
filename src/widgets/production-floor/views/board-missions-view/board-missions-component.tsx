import Stack from "@mui/material/Stack";
import {useEffect} from "react";
import {useBoardMissions} from "@/widgets/production-floor/views/board-missions-view/use-board-missions";
import {
    BoardMissionsDetailsHeader
} from "@/widgets/production-floor/views/board-missions-view/header/board-nissions-details-header";
import {Divider} from "@mui/material";

import {
    NavigationButtonsComponent
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/navigation-buttons-component";
import {EBoardMissionsViews} from "@/widgets/production-floor/views/board-missions-view/enums";
import {
    BoardMissionsStationsComponent
} from "@/widgets/production-floor/views/board-missions-view/stations/board-missions-stations-component";

interface IProps {
    boardMissionsId: string;
    step: string;
}

const BoardMissionsComponent = ({boardMissionsId, step}: IProps) => {
    const {getBoardMissions} = useBoardMissions();

    useEffect(() => {
        if (!!boardMissionsId) {
            getBoardMissions(boardMissionsId).then();
        }
    }, [boardMissionsId])
    return <Stack maxHeight={'100%'} overflow={'hidden'} gap={'16px'} padding={'34px 24px'} borderRadius={'24px, 24px, 0px, 0px'}>
        <BoardMissionsDetailsHeader/>
        <Divider orientation={'horizontal'} flexItem/>
        <NavigationButtonsComponent/>
        <Stack>
            {
                step === EBoardMissionsViews.STATIONS && <BoardMissionsStationsComponent/>
            }
            {
                step === EBoardMissionsViews.FILES && <></>
            }
            {
                step === EBoardMissionsViews.APPROVAL && <></>
            }
            {
                step === EBoardMissionsViews.ACTIVITY && <></>
            }
        </Stack>
    </Stack>
}

export {BoardMissionsComponent}