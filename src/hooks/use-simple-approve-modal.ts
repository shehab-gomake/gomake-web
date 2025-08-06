import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { sendJobExampleConfirmationToClientApi, updateBoardMissionStuckReasonApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useSnackBar } from "./use-snack-bar";

export const useSimpleApproveModal = (updateStatus:any) => {
  const { callApi } = useGomakeAxios();
  const [openSimpleApproveModal, setOpenSimpleApproveModal] = useState<boolean>(false);
  const [openSimpleStuckModal, setOpenStuckModal] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<string>("");
  const [boardsIdsList, setBoardsIdsList] = useState<IBoardMissions[]>([]);
  const [boardMissionId, setBoardMissionId] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [stuckReason, setStuckReason] = useState<string>("");
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  
  const handleOpenModal = (newStatusId: string, boards: IBoardMissions[], boardMissionId?: string, productType?: string) => {
    setStatusId(newStatusId);
    setBoardsIdsList(boards);
    setBoardMissionId(boardMissionId);
    setOpenSimpleApproveModal(true);
  };

  const handleCloseModal = () => {
    setOpenSimpleApproveModal(false);
    updateStatus(boardsIdsList, statusId);
  };
  const handleOpenStuckModal = (newStatusId: string, boards: IBoardMissions[], boardMissionId?: string, productType?: string) => {
    setStatusId(newStatusId);
    setBoardsIdsList(boards);
    setBoardMissionId(boardMissionId);
    setProductType(productType);
    setOpenStuckModal(true);
  };
  const handleCloseStuckModal = () => {
    setOpenStuckModal(false);
    setStuckReason("");
    updateStatus(boardsIdsList, statusId);
  };

  const handleConfirm = () => {
    updateStatus(boardsIdsList, statusId);
    sendJobExampleConfirmationToClient(boardMissionId);
  };
  const sendJobExampleConfirmationToClient = async (boardMissionId: string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await sendJobExampleConfirmationToClientApi(callApi, callBack, {
      boardMissionId,
    });
  };

  const onUpdateStuckReason = async (
    stuckReason: string,
  ) => {
    await updateBoardMissionStuckReasonApi(
      callApi,
      (res) => {
        if (res?.success) {
        }
      },
      { boardMissionId, stuckReason, productType }
    );
  };
  return {
    openSimpleApproveModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirm,
    openSimpleStuckModal,
    handleOpenStuckModal,
    handleCloseStuckModal,
    stuckReason,
    setStuckReason,
    onUpdateStuckReason
  };
};
