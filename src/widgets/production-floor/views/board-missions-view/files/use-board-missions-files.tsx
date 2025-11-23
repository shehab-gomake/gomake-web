import { useGomakeAxios } from "@/hooks";
import { getAllBoardMissionsUploadedFiles } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { boardMissionsFilesState } from "./state";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";
import { useRouter } from "next/router";
import { abortControllerFilesState } from "../stations/state";

const useBoardMissionsFiles = () => {
  const { callApi } = useGomakeAxios();
  const [files, setFiles] = useRecoilState(boardMissionsFilesState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [activeTab, setActiveTab] = useState(FileTypeENUM.Printing);
  const [abortController, setAbortController] = useRecoilState(abortControllerFilesState);
  const router = useRouter();
  const { query } = router;

  const getAllBoardMissionsFiles = async () => {
    setFiles([])
    if (abortController) {
      abortController.abort();
    }
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);
    const callBack = (res) => {
      if (res.success) {
        if (res?.data && (res?.data[0]?.boardMissionId !== query.boardMissionsId)) {
          return;
        }
        setFiles(res.data);
      }
    };
    
    await getAllBoardMissionsUploadedFiles(
      callApi,
      callBack,
        {
          orderItemId: boardMissions?.orderItemId,
          productType: boardMissions?.productType,
        },
      false,
      newRequestAbortController
    );
  };

  return {
    boardMissions,
    getAllBoardMissionsFiles,
    activeTab,
    setActiveTab,
    files,
  };
};

export { useBoardMissionsFiles };
