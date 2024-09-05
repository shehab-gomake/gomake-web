import Stack from "@mui/material/Stack";
import { BoardMissionsStationAction } from "@/widgets/production-floor/views/board-missions-view/stations/station-action";
import {
    useBoardMissionsStations
} from "@/widgets/production-floor/views/board-missions-view/stations/use-board-missions-stations";
import { useMemo } from "react";
import {
    GeneralInformationComponent
} from "@/widgets/production-floor/views/board-missions-view/stations/general-information/general-information-component";
import { Divider } from "@mui/material";
import {
    BoardMissionsSubWorkFlowComponent
} from "@/widgets/production-floor/views/board-missions-view/stations/sub-work-flow-component";
import {
    CompletedBoardMissionsComponent
} from "@/widgets/production-floor/views/board-missions-view/stations/completed-board-missions-component/completed-board-missions-component";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BoardMissionsStationsComponent = () => {
    const { stations, subWorkFlows, boardMissions, onClickAllJob, t, isRTL, getStations } = useBoardMissionsStations();
    const sortedStations = useMemo(() => [...stations]
        ?.sort((a, b) => b?.index - a?.index)
        ?.sort((a, b) => b?.isDone && a?.isDone ? 0 : a.isDone ? 1 : -1), [stations])
    return (
        <div style={{
            overflow: "hidden",
            maxHeight: 'calc(100vh - 300px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
        }}>
            <GeneralInformationComponent />
            <Divider orientation={'horizontal'} flexItem />
            {
                !!boardMissions?.productType &&
                <Button
                    onClick={onClickAllJob}
                    startIcon={isRTL ? <ArrowForwardIcon sx={{ marginLeft: '8px' }} />
                        : <ArrowBackIcon />}
                    variant={'contained'}
                    sx={{ width: 'fit-content', backgroundColor: '#CBCBE4', color: '#252675', '&:hover': { backgroundColor: '#CBCBE4', color: '#252675', opacity: 0.7 } }}>{t("productionFloor.allBookStations")}</Button>
            }
            <Stack gap={'10px'} minHeight={'fit-content'} overflow={'scroll'}>
                {<CompletedBoardMissionsComponent />}
                {
                    subWorkFlows?.map((workflow) => <BoardMissionsSubWorkFlowComponent
                        currentBoardMissionsActionId={boardMissions.currentBoardMissionActionId}  {...workflow} />)
                }
                {
                    sortedStations?.map((station, index) =>
                        <BoardMissionsStationAction
                            selected={station.boardMissionActionId === boardMissions.currentBoardMissionActionId}
                            key={station?.actionId + index} delay={index * 600} getStations={getStations} {...station} />)

                }
            </Stack>
        </div>
    );
}

export { BoardMissionsStationsComponent }