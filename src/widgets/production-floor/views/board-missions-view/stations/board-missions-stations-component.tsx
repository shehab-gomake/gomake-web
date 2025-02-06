import Stack from "@mui/material/Stack";
import { useBoardMissionsStations } from "@/widgets/production-floor/views/board-missions-view/stations/use-board-missions-stations";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@mui/material";
import { BoardMissionsSubWorkFlowComponent } from "@/widgets/production-floor/views/board-missions-view/stations/sub-work-flow-component";
import { CompletedBoardMissionsComponent } from "@/widgets/production-floor/views/board-missions-view/stations/completed-board-missions-component/completed-board-missions-component";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { BoardMissionsStationActionNew } from "./station-action-new";

//!here new version BoardMissionsStationsComponent
const BoardMissionsStationsComponent = () => {
  const { stations, subWorkFlows, boardMissions, getStations } =
    useBoardMissionsStations();

  const sortedStations = useMemo(
    () =>
      [...stations]
        ?.sort((a, b) => b?.index - a?.index)
        ?.sort((a, b) => (b?.isDone && a?.isDone ? 0 : a.isDone ? 1 : -1)),
    [stations]
  );

  const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(
    boardMissionsDetailsState
  );

  const isLoading =
    !boardMissionsDetails?.boardMissionId || sortedStations?.length === 0;

  return (
    <Stack gap={"10px"} minHeight="100%" overflow="auto">
      {/* Skeleton for Stations */}
      {isLoading ? (
        <>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={50}
                style={{ marginBottom: "10px", borderRadius: "8px" }}
              />
            ))}
        </>
      ) : (
        <>
          {/* Render the actual components when data is loaded */}
          <CompletedBoardMissionsComponent />
          {subWorkFlows?.map((workflow) => (
            <BoardMissionsSubWorkFlowComponent
              currentBoardMissionsActionId={
                boardMissions.currentBoardMissionActionId
              }
              key={workflow?.actionId}
              {...workflow}
            />
          ))}
          {sortedStations?.map((station, index) => (
            <BoardMissionsStationActionNew
              selected={
                station.boardMissionActionId ===
                boardMissions.currentBoardMissionActionId
              }
              key={station?.actionId + index}
              delay={index * 600}
              getStations={getStations}
              isHaveSubACtions={!!station.subActions}
              subActions={station.subActions}
              {...station}
            />
          ))}
        </>
      )}
    </Stack>
  );
};

export { BoardMissionsStationsComponent };
