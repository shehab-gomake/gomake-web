import Stack from "@mui/material/Stack";
import { BoardMissionsStationAction } from "@/widgets/production-floor/views/board-missions-view/stations/station-action";
import { useBoardMissionsStations } from "@/widgets/production-floor/views/board-missions-view/stations/use-board-missions-stations";
import { useMemo } from "react";
import { Divider, Skeleton } from "@mui/material";
import { BoardMissionsSubWorkFlowComponent } from "@/widgets/production-floor/views/board-missions-view/stations/sub-work-flow-component";
import { CompletedBoardMissionsComponent } from "@/widgets/production-floor/views/board-missions-view/stations/completed-board-missions-component/completed-board-missions-component";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { GeneralInformationComponent } from "./general-information/general-information-component";
import { MaterialsAndProductionTimeModalWidget } from "./material-and-production-time-modal";
import { materialModalState } from "./material-and-production-time-modal/states";
import { updatePrintHouseMaterialStockFromJobApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const BoardMissionsStationsComponent = () => {
  const {
    stations,
    setStations,
    subWorkFlows,
    boardMissions,
    onClickAllJob,
    t,
    isRTL,
    getStations,
  } = useBoardMissionsStations();
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
  const isLoading = !boardMissionsDetails?.boardMissionId && sortedStations;

  const [openMaterialsModal, setOpenMaterialsModal] =
    useRecoilState<any>(materialModalState);
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const onUpdateMaterialStock = async (updatedState: {
    currentStationId: string;
    boardMissionActionId: string;
    productionTime: string;
    materials: {
      ProductType: string;
      WorkFlowActionId: string;
      materialKey: string;
      currentValue: string;
    }[];
  }) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setOpenMaterialsModal(false);

        setStations(
          stations.map((station) => {
            if (
              station.boardMissionActionId == updatedState.boardMissionActionId
            ) {
              return {
                ...station,
                boardMissionActionTimer: {
                  isTimerRunning: false,
                  totalRunningTime: Number(updatedState.productionTime),
                },
              };
            }
            return { ...station };
          })
        );
      } else {
        alertFaultUpdate();
      }
    };
    await updatePrintHouseMaterialStockFromJobApi(
      callApi,
      callBack,
      updatedState
    );
  };
  return (
    <div
      style={{
        overflow: "auto",
        // maxHeight: 'calc(100vh - 300px)',
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <GeneralInformationComponent />
      {boardMissionsDetails?.isNeedExample && (
        <h4>{t("productionFloor.needExample")}</h4>
      )}
      {boardMissionsDetails?.isRepetitiveWork && (
        <h4>{t("productionFloor.repetitiveWork")}</h4>
      )}

      <Divider orientation={"horizontal"} flexItem />
      {!!boardMissions?.productType && (
        <Button
          onClick={onClickAllJob}
          startIcon={
            isRTL ? (
              <ArrowForwardIcon sx={{ marginLeft: "8px" }} />
            ) : (
              <ArrowBackIcon />
            )
          }
          variant={"contained"}
          sx={{
            width: "fit-content",
            backgroundColor: "#CBCBE4",
            color: "#252675",
            "&:hover": {
              backgroundColor: "#CBCBE4",
              color: "#252675",
              opacity: 0.7,
            },
          }}
        >
          {t("productionFloor.allBookStations")}
        </Button>
      )}

      <Stack gap={"10px"} minHeight={"fit-content"} overflow={"scroll"}>
        {/* Skeleton for CompletedBoardMissionsComponent */}
        {isLoading ? (
          <>
            {/* Skeleton for CompletedBoardMissionsComponent */}
            <Skeleton variant="rectangular" width="100%" height={100} />
            {/* Skeleton for SubWorkFlows */}
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="100%"
                  height={60}
                  style={{ marginBottom: "10px" }}
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
              <BoardMissionsStationAction
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
      <MaterialsAndProductionTimeModalWidget
        openModal={openMaterialsModal}
        onClose={() => setOpenMaterialsModal(false)}
        onUpdate={onUpdateMaterialStock}
      />
    </div>
  );
};

export { BoardMissionsStationsComponent };
