import Stack from "@mui/material/Stack";
import {BoardMissionsStationAction} from "@/widgets/production-floor/views/board-missions-view/stations/station-action";
import {
    useBoardMissionsStations
} from "@/widgets/production-floor/views/board-missions-view/stations/use-board-missions-stations";
import {useMemo} from "react";
import {
    GeneralInformationComponent
} from "@/widgets/production-floor/views/board-missions-view/stations/general-information/general-information-component";
import {Divider} from "@mui/material";

const BoardMissionsStationsComponent = () => {
    const {stations} = useBoardMissionsStations();
    const sortedStations = useMemo(() => [...stations]
        ?.sort((a, b) => b?.index - a?.index)
        ?.sort((a, b) => b?.isDone && a?.isDone ? 0 : a.isDone ? 1 : -1), [stations])
    return (
        <div style={{overflow: "hidden", maxHeight: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', gap: '18px'}}>
            <GeneralInformationComponent/>
            <Divider orientation={'horizontal'} flexItem/>
            <Stack gap={'10px'} height={'100%'} overflow={'scroll'}>
                {
                        sortedStations?.map((station, index) =>
                        <BoardMissionsStationAction key={station?.actionId + index} delay={index * 600} {...station} />)
                }
            </Stack>
        </div>
    );
}

export {BoardMissionsStationsComponent}