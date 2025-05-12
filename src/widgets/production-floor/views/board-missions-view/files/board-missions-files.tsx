import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { FileCardComponent } from "@/widgets/production-floor/views/board-missions-view/files/file-card-component";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";
import { useBoardMissionsFiles } from "./use-board-missions-files";

const BoardMissionsFiles = () => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const {
    boardMissions,
    getAllBoardMissionsFiles,
    activeTab,
    setActiveTab,
    files,
  } = useBoardMissionsFiles();

  useEffect(() => {
    if (boardMissions.orderItemId) {
      getAllBoardMissionsFiles().then();
    }
  }, [boardMissions.orderItemId]);

  const filteredFiles = files.filter((file) => file?.fileType === activeTab);

  if (!boardMissions.orderItemId) {
    return <p>{t("loading")}</p>;
  }

  return (
    <Stack width={"100%"} padding={"0 0 30px 0"}>
      {/* Tab Buttons */}
      <Stack
        direction="row"
        gap={1}
        marginBottom={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Button
          variant="contained"
          onClick={() => setActiveTab(FileTypeENUM.Printing)}
          sx={{
            fontWeight: "bold",
            height: "fit-content",
            padding: "0px 10px",

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
            height: "fit-content",
            padding: "0px 10px",
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
          {t("fileUploader.original")}
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
