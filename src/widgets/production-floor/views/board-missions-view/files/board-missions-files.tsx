import { useState, useEffect, useCallback } from "react";
import { Button, Stack, Divider } from "@mui/material";
import { useGomakeAxios } from "@/hooks";
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
  const [activeTab, setActiveTab] = useState(FileTypeENUM.Printing);

  useEffect(() => {
    if (boardMissions.orderItemId) {
      getAllBoardMissionsUploadedFiles(
        callApi,
        (res) => {
          if (res.success) setFiles(res.data);
        },
        boardMissions?.orderItemId
      );
    }
  }, [boardMissions.orderItemId]);

  const filteredFiles = files.filter((file) => file?.fileType === activeTab);

  if (!boardMissions.orderItemId) {
    return <p>{t("loading")}</p>;
  }

  return (
    <Stack width={"100%"} padding={"0 0 30px 0"}>
      {/* Tab Buttons */}
      <Stack direction="row" gap={2} marginBottom={2}>
        <Button
          variant="contained"
          onClick={() => setActiveTab(FileTypeENUM.Printing)}
          sx={{
            width: "100px",

            fontWeight: "bold",
            backgroundColor:
              activeTab === FileTypeENUM.Printing ? "#D0D1ED" : "#F9FAFB",
            color:
              activeTab === FileTypeENUM.Printing
                ? primaryColor(500)
                : "#344054",
            borderRadius: "var(--radius-full, 9999px)",
            border:
              activeTab === FileTypeENUM.Printing
                ? `1px solid ${primaryColor(500)}`
                : `1px solid #EAECF0`,
            boxShadow: "none",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor:
                activeTab === FileTypeENUM.Printing ? "#D0D1ED" : "#F9FAFB",
            },
            ...FONT_FAMILY.Inter(500, 14),
          }}
        >
          {t("fileUploader.printing")}
        </Button>
        <Button
          variant="contained"
          onClick={() => setActiveTab(FileTypeENUM.Graphics)}
          sx={{
            fontWeight: "bold",
            backgroundColor:
              activeTab === FileTypeENUM.Graphics ? "#D0D1ED" : "#F9FAFB",
            color:
              activeTab === FileTypeENUM.Graphics
                ? primaryColor(500)
                : "#344054",
            borderRadius: "var(--radius-full, 9999px)",
            border:
              activeTab === FileTypeENUM.Graphics
                ? `1px solid ${primaryColor(500)}`
                : `1px solid #EAECF0`,
            boxShadow: "none",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor:
                activeTab === FileTypeENUM.Graphics ? "#D0D1ED" : "#F9FAFB",
            },
            ...FONT_FAMILY.Inter(500, 14),
          }}
        >
          {t("fileUploader.graphics")}
        </Button>
      </Stack>

      {/* Files Display */}
      <Stack direction="row" gap={"10px"} flexWrap="wrap">
        {filteredFiles.length > 0 &&
          filteredFiles.map((file) => (
            <FileCardComponent key={file.name} file={file} />
          ))}
      </Stack>
    </Stack>
  );
};

export { BoardMissionsFiles };
