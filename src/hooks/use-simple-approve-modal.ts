import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { sendJobExampleConfirmationToClientApi } from "@/services/api-service/production-floor/production-floor-endpoints";

export const useSimpleApproveModal = (updateStatus: (boards: IBoardMissions[], statusId: string) => void) => {
  const { callApi } = useGomakeAxios();
  const [openSimpleApproveModal, setOpenSimpleApproveModal] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<string>("");
  const [boardsIdsList, setBoardsIdsList] = useState<IBoardMissions[]>([]);
  const [boardMissionId, setBoardMissionId] = useState<string>("");

  const handleOpenModal = (newStatusId: string, boards: IBoardMissions[], boardMissionId?: string) => {
    setStatusId(newStatusId);
    setBoardsIdsList(boards);
    setBoardMissionId(boardMissionId);
    setOpenSimpleApproveModal(true);
  };

  const handleCloseModal = () => {
    setOpenSimpleApproveModal(false);
    updateStatus(boardsIdsList, statusId);
  };

  const handleConfirm = () => {
    updateStatus(boardsIdsList, statusId);
    sendJobExampleConfirmationToClient(boardMissionId);
  };
  const sendJobExampleConfirmationToClient = async (boardMissionId: string) => {
    const callBack = (res) => {
      if (res.success) {
        console.log("res", res)
      }
    };
    await sendJobExampleConfirmationToClientApi(callApi, callBack, {
      boardMissionId,
    });
  };
  return {
    openSimpleApproveModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirm,
  };
};
