import { Card, IconButton, MenuItem, Paper, Stack } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { FONT_FAMILY } from "@/utils/font-family";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useRef, useState } from "react";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { DateFormatterDDMMYYYY } from "@/utils/date-formatters";
import { IBoardMissionsFile } from "@/widgets/production-floor/views/board-missions-view/files/state";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { getUserToken } from "@/services/storage-data";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
    deleteJobFileApi,
    updateJobDueDateApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";

const FileCardComponent = ({ file }: { file: IBoardMissionsFile }) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { primaryColor, grayColor } = useGomakeTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [companyProfile] = useRecoilState(printHouseProfile);
  const menuRef = useRef(null);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { query } = useRouter();
  const { callApi } = useGomakeAxios();
  const { productType } = query;

  const onClickDelete = async () => {
    try {
      setIsLoading(true);
      const callBack = async ()=>{
          const response = await fetch(
              companyProfile.filesApiAddress + "/api/Files/DeleteFile",
              {
                  method: "POST",
                  body: JSON.stringify({
                      orderItemId: boardMissions.orderItemId,
                      filename: file.name,
                      source: file.filePath,
                      productType: productType || "",
                  }),
                  headers: {
                      authorization: "Bearer " + getUserToken(),
                      "Content-Type": "application/json",
                  },
              }
          );
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
      }
      deleteJobFileApi(callApi, callBack, {
            orderItemId: boardMissions.orderItemId,
            filename: file.name,
            source: file.filePath,
            productType: productType || "",
      }).then();
      
    } catch (error) {
      console.error("Download failed:", error);
    }
    setIsLoading(false);
  };

  const onClickDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        companyProfile.filesApiAddress + "/api/Files/downloadfile",
        {
          method: "POST",
          body: JSON.stringify({
            orderItemId: boardMissions.orderItemId,
            filename: file.name,
            source: file.filePath,
          }),
          headers: {
            authorization: "Bearer " + getUserToken(),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file?.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "140px",
        width: "110px",
        // maxWidth: "60%",
        // maxHeight: "90%",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          padding: "8px",
          backgroundColor: primaryColor(100),
          borderRadius: "8px",
          border: "1px solid #2E3092",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardMedia
          sx={{ height: 120, borderRadius: "8px" }}
          image={file?.screenShotURL}
          title={file?.name}
        />
        <Stack direction={"row"}>
          <Stack
            sx={{
              color: grayColor(700),
              ...FONT_FAMILY.Inter(500, 12),
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <span
              style={{
                overflow: "scroll",
              }}
            >
              {file?.name}
            </span>
            <span>{DateFormatterDDMMYYYY(file?.uploadDate)}</span>
          </Stack>
          {isLoading ? (
            <DotsLoader />
          ) : (
            // <ClickOutside onClick={() => setOpen(false)} exceptionRef={menuRef}>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ height: 22, width: 22, alignSelf: "center" }}
              size="small"
            >
              <MoreVertIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            // </ClickOutside>
          )}
        </Stack>
        {!!open && !isLoading && (
          <ClickOutside onClick={() => setOpen(false)} exceptionRef={menuRef}>
            <Paper
              ref={menuRef}
              sx={{
                zIndex: 99999999999,
                position: "absolute",
                [direction === "rtl" ? "left" : "right"]: "6px",
                top: "calc(100% - 10px)",
              }}
            >
              <MenuItem onClick={onClickDownload}>
                {t("translations.download")}
              </MenuItem>
              <MenuItem onClick={onClickDelete}>{t("modal.delete")}</MenuItem>
            </Paper>
          </ClickOutside>
        )}
      </Card>
    </div>
  );
};

export { FileCardComponent };
