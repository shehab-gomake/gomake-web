import Stack from "@mui/material/Stack";
import {
  EUploadingFileStatus,
  IUploadingFile,
  FileTypeENUM,
} from "@/widgets/file-uploader-widget/interface";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { CircularProgress, IconButton, MenuItem, Paper } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRef, useState } from "react";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { getTempUserToken, getUserToken } from "@/services/storage-data";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  deleteJobFileApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { quoteItemState } from "@/store";

const FileComponent = ({ fileName, fileStatus, filePath, orderItemId, productType, fileType, onFileDeleted, downloadFilePath }: IUploadingFile & { onFileDeleted?: (fileName: string, fileType: FileTypeENUM) => void }) => {
  console.log("file name component", { fileName, fileStatus, filePath, orderItemId, productType, fileType, onFileDeleted, downloadFilePath });
  const { successColor, errorColor, primaryColor, grayColor, warningColor } =
    useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const [open, setOpen] = useState<boolean>(false);
  const [companyProfile] = useRecoilState(printHouseProfile);
  const menuRef = useRef(null);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { query } = useRouter();
  const { callApi } = useGomakeAxios();
  const { productType: queryProductType } = query;

  const onClickDelete = async () => {
    try {
      setIsLoading(true);
      const callBack = (res) => {
        if (res.success) {
          // Call the callback to update the parent component
          if (onFileDeleted && fileType !== undefined) {
            onFileDeleted(fileName, fileType);
          }
        }
      }
      await deleteJobFileApi(callApi, callBack, {
        orderItemId: orderItemId || boardMissions.orderItemId,
        filename: fileName,
        source: filePath,
        productType: productType || queryProductType || "",
      });

    } catch (error) {
      console.error("Delete failed:", error);
    }
    setIsLoading(false);
  };

  const handleDownloadFile = async (bucketName: string) => {
    // Add file to downloading state
    // setDownloadingFiles((prev) => [...prev, bucketName]);

    try {
      let userToken = getUserToken();
      if (!userToken) {
        userToken = getTempUserToken();
      }

      const response = await axios.post(
        `${companyProfile.filesApiAddress}/api/Files/CreateDownloadFilePreSignedUrl`,
        { bucketKey: bucketName },
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );

      if (response.data && typeof response.data === "string") {
        // Open the presigned URL in a new tab
        window.open(response.data, "_blank");
      } else {
        console.error("Invalid response from CreateDownloadFilePreSignedUrl");
      }
    } catch (error) {
      console.error("Error getting download URL:", error);
    } finally {
      // Remove file from downloading state
      // setDownloadingFiles((prev) => prev.filter((key) => key !== bucketName));
    }
  };


  const onClickDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        companyProfile.filesApiAddress + "/api/Files/downloadfile",
        {
          method: "POST",
          body: JSON.stringify({
            orderItemId: orderItemId || boardMissions.orderItemId,
            filename: fileName,
            source: downloadFilePath,
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
      link.download = fileName;
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
    <div style={{ position: "relative" }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        height={"80px"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"3px"}
          style={{ color: primaryColor(400) }}
        >
          <TextSnippetIcon />
          <span
            style={{
              ...FONT_FAMILY.Inter(500, 14),
              color: grayColor(700),
              maxWidth: "150px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            title={fileName}
          >
            {fileName}
          </span>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
          {fileStatus === EUploadingFileStatus.UPLOADING ? (
            <CircularProgress size={"25px"} />
          ) : fileStatus === EUploadingFileStatus.DONE ||
            fileStatus === EUploadingFileStatus.Uploaded || fileStatus === EUploadingFileStatus.UploadedToGoogleCloud ? (
            <>
              {
                fileStatus === EUploadingFileStatus.UploadedToGoogleCloud ?
                  <CloudDoneIcon
                    style={{
                      color: warningColor(500),
                      backgroundColor: warningColor(100),
                      width: "25px",
                      height: "25px",
                      padding: "2px",
                      borderRadius: "50%",
                    }}
                  /> :
                  <TaskAltIcon
                    style={{
                      color: successColor(500),
                      backgroundColor: successColor(100),
                      width: "25px",
                      height: "25px",
                      padding: "2px",
                      borderRadius: "50%",
                    }}
                  />


              }
              {isLoading ? (
                <DotsLoader />
              ) : (
                <IconButton
                  onClick={() => setOpen(!open)}
                  sx={{ height: 22, width: 22, alignSelf: "center" }}
                  size="small"
                >
                  <MoreVertIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              )}
            </>
          ) : (
            <ErrorOutlineIcon
              style={{
                color: errorColor(500),
                backgroundColor: errorColor(100),
                width: "25px",
                height: "25px",
                padding: "2px",
                borderRadius: "50%",
              }}
            />
          )}
        </Stack>
      </Stack>
      {!!open && !isLoading && (
        <ClickOutside onClick={() => setOpen(false)} exceptionRef={menuRef}>
          <Paper
            ref={menuRef}
            sx={{
              zIndex: 99999999999999,
              position: "absolute",
              [direction === "rtl" ? "left" : "right"]: "6px",
              top: "0px",
            }}
          >
            <MenuItem onClick={() => {
              if (fileStatus === EUploadingFileStatus.UploadedToGoogleCloud) {
                handleDownloadFile(fileName);

              }
              else {
                onClickDownload();
              }
            }}>
              {t("translations.download")}
            </MenuItem>
            <MenuItem onClick={onClickDelete}>{t("modal.delete")}</MenuItem>
          </Paper>
        </ClickOutside>
      )}
    </div>
  );
};

export { FileComponent };
