import { useGomakeAxios } from "@/hooks";
import { getAllBoardMissionsUploadedFiles } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { boardMissionsFilesState } from "./state";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";

const useBoardMissionsFiles = () => {
  const { callApi } = useGomakeAxios();
  const [files, setFiles] = useRecoilState(boardMissionsFilesState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [activeTab, setActiveTab] = useState(FileTypeENUM.Printing);

  const getAllBoardMissionsFiles = async () => {
    const callBack = (res) => {
      if (res.success) {
        setFiles(res.data);
      }
    };
    await getAllBoardMissionsUploadedFiles(
      callApi,
      callBack,
      boardMissions?.orderItemId
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
