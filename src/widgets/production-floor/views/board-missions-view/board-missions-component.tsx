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
import {
    BoardMissionsActivities
} from "@/widgets/production-floor/views/board-missions-view/activity/board-missions-activities";
import {useBoardMissionsSignalr} from "@/hooks/signalr/use-board-missions-signalr";
import {BoardMissionsFiles} from "@/widgets/production-floor/views/board-missions-view/files/board-missions-files";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {
    useBoardMissionsActivities
} from "@/widgets/production-floor/views/board-missions-view/activity/use-board-missions-activities";

interface IProps {
    boardMissionsId: string;
    step: string;
    productType: string;
}

const BoardMissionsComponent = ({boardMissionsId, step, productType}: IProps) => {
    const {getBoardMissions, initStates} = useBoardMissions();
    const {connectionId} = useBoardMissionsSignalr();
    const {getData} = useProductionFloorData();
    const {getAllActivities, activities} = useBoardMissionsActivities()
    useEffect(() => {
        if (!!boardMissionsId && !!connectionId) {
            getBoardMissions(boardMissionsId, connectionId, productType).then();
        }
        return () => {
            initStates();
            getData().then();
        };
    }, [boardMissionsId, connectionId, productType])

    useEffect(() => {
        if (step === 'activity') {
            getAllActivities().then();
        }
    }, [step])
    return <Stack maxHeight={'100%'} overflow={'hidden'} gap={'16px'} padding={'34px 24px'}
                  borderRadius={'24px, 24px, 0px, 0px'}>
        <BoardMissionsDetailsHeader/>
        <Divider orientation={'horizontal'} flexItem/>
        <NavigationButtonsComponent/>
        <Stack>
            {
                step === EBoardMissionsViews.STATIONS && <BoardMissionsStationsComponent/>
            }
            {
                step === EBoardMissionsViews.FILES && <BoardMissionsFiles/>
            }
            {
                step === EBoardMissionsViews.APPROVAL && <></>
            }
            {
                step === EBoardMissionsViews.ACTIVITY && <BoardMissionsActivities activities={!!activities ? activities : []}/>
            }
        </Stack>
    </Stack>
}

export {BoardMissionsComponent}