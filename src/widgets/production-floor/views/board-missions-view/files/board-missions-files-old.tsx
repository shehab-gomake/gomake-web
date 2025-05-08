import { Divider, Skeleton, Stack } from "@mui/material";
import { useGomakeAxios } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { getAllBoardMissionsUploadedFiles } from "@/services/api-service/production-floor/production-floor-endpoints";
import { FileCardComponent } from "@/widgets/production-floor/views/board-missions-view/files/file-card-component";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { boardMissionsFilesState } from "@/widgets/production-floor/views/board-missions-view/files/state";
import { useUploadFiles } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";

const BoardMissionsFiles = () => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const [files, setFiles] = useRecoilState(boardMissionsFilesState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [isOverGraphics, setIsOverGraphics] = useState(false);
  const [isOverPrinting, setIsOverPrinting] = useState(false);

  const { handleFileUpload } = useUploadFiles(
    boardMissions.orderItemId,
    boardMissions.filesPath,
    boardMissions.graphicsFilePath
  );

  const handleGraphicsDrop = async (event) => {
    event.preventDefault();
    setIsOverGraphics(false);
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      handleFileUpload(files[i], FileTypeENUM.Graphics).then();
    }
  };

  const handlePrintingDrop = async (event) => {
    event.preventDefault();
    setIsOverPrinting(false);
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      handleFileUpload(files[i], FileTypeENUM.Printing).then();
    }
  };

  const handleGraphicsDragOver = useCallback((event) => {
    event.preventDefault();
    setIsOverGraphics(true);
  }, []);

  const handlePrintingDragOver = useCallback((event) => {
    event.preventDefault();
    setIsOverPrinting(true);
  }, []);

  const handleGraphicsDragLeave = useCallback(() => {
    setIsOverGraphics(false);
  }, []);

  const handlePrintingDragLeave = useCallback(() => {
    setIsOverPrinting(false);
  }, []);

  const graphicsFiles = files.filter(
    (file) => file?.fileType === FileTypeENUM.Graphics
  );
  const printingFiles = files.filter(
    (file) => file?.fileType === FileTypeENUM.Printing
  );

  useEffect(() => {
    const callBack = (res) => {
      if (res.success) {
        setFiles(res.data);
      }
    };
    if (boardMissions.orderItemId) {
      getAllBoardMissionsUploadedFiles(
        callApi,
        callBack,
        boardMissions?.orderItemId
      ).then();
    }
  }, [boardMissions.orderItemId]);

  if (!boardMissions.orderItemId) {
    return (
      <Stack
        direction={"row"}
        gap={"20px"}
        flex={1}
        padding={"0 0 30px 0"}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <Stack width={"50%"} gap={"15px"}>
          <Skeleton variant="text" width={150} height={30} />
        </Stack>
        <Divider
          flexItem
          orientation={"vertical"}
          sx={{ color: primaryColor(500), margin: "0 10px" }}
        />
        <Stack width={"50%"} gap={"15px"}></Stack>
      </Stack>
    );
  }

  return (
    <Stack
      direction={"row"}
      gap={"20px"}
      flex={1}
      padding={"0 0 30px 0"}
      width={"100%"}
      justifyContent={"space-between"}
    >
      {/* Graphics Section */}
      <Stack
        onDrop={handleGraphicsDrop}
        onDragOver={handleGraphicsDragOver}
        onDragLeave={handleGraphicsDragLeave}
        className={`drop-zone ${isOverGraphics ? "dragging" : ""}`}
        width={"50%"}
        gap={"15px"}
      >
        <h3 style={{ ...FONT_FAMILY.Inter(500, 18), color: primaryColor(500) }}>
          {t("fileUploader.originalFiles")}
        </h3>
        <Stack direction={"row"} gap={"20px"} flex={1} flexWrap={"wrap"}>
          {graphicsFiles
            .slice(0, 1)
            ?.filter((file) => !!file.screenShotURL)
            ?.map((file) => (
              <FileCardComponent key={file.name} file={file} />
            ))}
        </Stack>
      </Stack>
      <Divider
        flexItem
        orientation={"vertical"}
        sx={{ color: primaryColor(500), margin: "0 10px" }}
      />

      {/* Printing Section */}
      <Stack
        onDrop={handlePrintingDrop}
        onDragOver={handlePrintingDragOver}
        onDragLeave={handlePrintingDragLeave}
        className={`drop-zone ${isOverPrinting ? "dragging" : ""}`}
        width={"50%"}
        gap={"15px"}
      >
        <h3 style={{ ...FONT_FAMILY.Inter(500, 18), color: primaryColor(500) }}>
          {t("fileUploader.printingFiles")}
        </h3>
        <Stack direction={"row"} gap={"20px"} flex={1} flexWrap={"wrap"}>
          {printingFiles
            ?.filter((file) => !!file.screenShotURL)
            ?.map((file) => (
              <FileCardComponent key={file.name} file={file} />
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export { BoardMissionsFiles };
