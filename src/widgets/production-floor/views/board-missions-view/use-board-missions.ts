import { getBoardMissionsById } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useResetRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import {
  boardMissionsStationsState,
  boardMissionsSubWorkFlowsState,
  stationGeneralInformationState,
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { boardMissionsFilesState } from "@/widgets/production-floor/views/board-missions-view/files/state";
import { addBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import { useRouter } from "next/router";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useBoardMissions = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(
    boardMissionsDetailsState
  );

  const resetStations = useResetRecoilState(boardMissionsStationsState);
  const resetFiles = useResetRecoilState(boardMissionsFilesState);
  const resetDetails = useResetRecoilState(boardMissionsDetailsState);
  const resetSubWorkFlows = useResetRecoilState(boardMissionsSubWorkFlowsState);
  const resetGeneralInformation = useResetRecoilState(
    stationGeneralInformationState
  );
  const initStates = () => {
    resetDetails();
    // resetFiles();
    // resetStations();
    // resetSubWorkFlows();
    // resetGeneralInformation();
  };

  const getBoardMissions = async (
    id: string,
    connectionId,
    productType: string
  ) => {
    const callBack = async (res) => {
      if (res.success) {
        setBoardMissionsDetails(res.data);
      }
    };
    await getBoardMissionsById(callApi, callBack, {
      id,
      connectionId,
      productType,
    });
  };

  //!here new
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
  const isLoading = !boardMissionsDetails?.boardMissionId; // Check if boardMissionId exists
  const router = useRouter();
  const { query } = router;

  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);

  const onClickUploadFile = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setOpenFileUploader(true);
        setShowFileUploader(true);
      } else {
      }
    };
    await addBoardMissionsToFileUploaderApi(callApi, callBack, {
      boardMissionsId: query.boardMissionsId,
      connectionId: connectionId,
    });
  };

  return {
    getBoardMissions,
    initStates,
    boardMissionsDetails,
    isLoading,
    onClickUploadFile,
    openAddNoteModal,
    setOpenAddNoteModal,
    t,
  };
};

export { useBoardMissions };
