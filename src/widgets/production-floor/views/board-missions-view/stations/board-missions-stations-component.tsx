import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { Skeleton } from "@mui/material";
import { BoardMissionsSubWorkFlowComponent } from "@/widgets/production-floor/views/board-missions-view/stations/sub-work-flow-component";
import { CompletedBoardMissionsComponent } from "@/widgets/production-floor/views/board-missions-view/stations/completed-board-missions-component/completed-board-missions-component";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { BoardMissionsStationActionItem } from "./station-action-item";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { t } from "i18next";
import { isPackagingModalOpenState, isPrintNodeModalOpenState } from "./state";
import { printJobUsingPrintNodeApi } from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { PrintPackingSlipModalWidget } from "../navigation-buttons/print-packing-slip-modal-widget";

const BoardMissionsStationsComponent = ({
  stations,
  subWorkFlows,
  boardMissions,
  getStations,
}) => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const [isPrintNodeModalOpen, setIsPrintNodeModalOpen] = useRecoilState(isPrintNodeModalOpenState);
  const boardMissionsDetails = useRecoilValue(boardMissionsDetailsState);
  const [openPackagingModal, setOpenPackagingModal] = useRecoilState(isPackagingModalOpenState);

  const handleClosePackagingModal = () => {
    setOpenPackagingModal(false);
  };

  const sortedStations = useMemo(
    () =>
      [...stations]
        ?.sort((a, b) => b?.stationIndex - a?.stationIndex)
        ?.sort((a, b) => (b?.isDone && a?.isDone ? 0 : a.isDone ? 1 : -1)),
    [stations]
  );
  const isLoading =
    !boardMissionsDetails?.boardMissionId || sortedStations?.length === 0;
  const printJobUsingPrintNode = async (jobId: string, productType?: string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    let data = jobId;
    if (productType) {
      data = data + "?productType=" + productType;
    }
    await printJobUsingPrintNodeApi(callApi, callBack, data);
  };
  return (
    <Stack gap={"10px"} maxHeight="100%">
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
            <BoardMissionsStationActionItem
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

          <PrintPackingSlipModalWidget
            boardMissionId={boardMissions.boardMissionId}
            quantity={boardMissions.quantity}
            openModal={openPackagingModal}
            onClose={handleClosePackagingModal}
          />

          <GoMakeDeleteModal
            modalType={ModalType.WARNING}
            title={t("boardMissions.printOrderJobsModalTitle")}
            subTitle={" "}
            yesBtn={t("sales.quote.print")}
            openModal={isPrintNodeModalOpen}
            onClose={() => { setIsPrintNodeModalOpen(false) }}
            style={{
              zIndex: 999999999999999,
            }}
            onClickDelete={() => {
              setIsPrintNodeModalOpen(false);
              printJobUsingPrintNode(router.query.boardMissionsId as string, boardMissionsDetails.productType).then();
            }}
            // onClickCancel={() => {
            //   setIsPrintNodeModalOpen(false)
            // }}
            cancelBtn={t("modal.cancel")}
          />
        </>
      )}
    </Stack>
  );
};

export { BoardMissionsStationsComponent };
