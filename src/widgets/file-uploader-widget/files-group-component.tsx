import Stack from "@mui/material/Stack";
import { FileComponent } from "@/widgets/file-uploader-widget/file-component";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  FileTypeENUM,
  IUploadingFileGroup,
} from "@/widgets/file-uploader-widget/interface";
import { useCallback, useRef, useState } from "react";
import { Divider, IconButton } from "@mui/material";
import { useUploadFiles } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import { FONT_FAMILY } from "@/utils/font-family";
import FolderIcon from "@mui/icons-material/Folder";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { OpenUploadFileIcon } from "./icons";
import { GoMakeDeleteModal } from "@/components";
import { useModal } from "@/hooks/use-modal";
import { ModalType } from "@/enums/tabs-icon-enums";
import { useGomakeAxios } from "@/hooks";
import { printJobUsingPrintNodeApi } from "@/services/api-service/board-missions/board-missions-table";
import { selectedMissionsState } from "../production-floor/state/boards";
import { useRecoilState, } from "recoil";

const FilesGroupComponent = ({
  title,
  filesInfo,
  orderItemId,
  filePath,
  graphicsFilePath,
  boardMissionId,
  isComplexProduct,
  productType,
  onFileDeleted
}: IUploadingFileGroup) => {
  const { primaryColor } = useGomakeTheme();
  const [isOverGraphics, setIsOverGraphics] = useState(false);
  const [isOverPrinting, setIsOverPrinting] = useState(false);
  const isOpenPrintingModal = useModal();
  const { callApi } = useGomakeAxios();

  const { handleFileUpload } = useUploadFiles(
    orderItemId,
    filePath,
    graphicsFilePath,
    isComplexProduct,
    productType,
    isOpenPrintingModal
  );
  const { push, pathname } = useRouter();
  const fileInputRef = useRef<HTMLInputElement & { fileType?: FileTypeENUM }>(null);
  const { t } = useTranslation();
  const [selectedMission, setSelectedMission] = useRecoilState<any>(
    selectedMissionsState
  );

  const handleGraphicsDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsOverGraphics(false);
    const files = event.dataTransfer.files;
    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      uploadPromises.push(handleFileUpload(files[i], FileTypeENUM.Graphics));
    }
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
  };

  const handlePrintingDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsOverPrinting(false);
    const files = event.dataTransfer.files;
    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      uploadPromises.push(handleFileUpload(files[i], FileTypeENUM.Printing));
    }
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
  };

  const handleGraphicsDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsOverGraphics(true);
  }, []);

  const handlePrintingDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsOverPrinting(true);
  }, []);

  const handleGraphicsDragLeave = useCallback(() => {
    setIsOverGraphics(false);
  }, []);

  const handlePrintingDragLeave = useCallback(() => {
    setIsOverPrinting(false);
  }, []);

  // Filter files by type and remove duplicates
  const graphicsFiles = filesInfo
    .filter((file) => file.fileType === FileTypeENUM.Graphics)
    .reduce((unique, item) => {
      // Remove duplicates based on fileName
      const exists = unique.find(
        (file) => file.fileName === item.fileName &&
          (item.uploadId ? file.uploadId === item.uploadId : true)
      );
      if (!exists) {
        unique.push(item);
      } else if (exists && item.uploadId && exists.uploadId !== item.uploadId) {
        // If it's a different upload of the same file, keep the latest one
        const index = unique.findIndex(f => f === exists);
        unique[index] = item;
      }
      return unique;
    }, []);

  const printingFiles = filesInfo
    .filter((file) => file.fileType === FileTypeENUM.Printing)
    .reduce((unique, item) => {
      // Remove duplicates based on fileName
      const exists = unique.find(
        (file) => file.fileName === item.fileName &&
          (item.uploadId ? file.uploadId === item.uploadId : true)
      );
      if (!exists) {
        unique.push(item);
      } else if (exists && item.uploadId && exists.uploadId !== item.uploadId) {
        // If it's a different upload of the same file, keep the latest one
        const index = unique.findIndex(f => f === exists);
        unique[index] = item;
      }
      return unique;
    }, []);

  const handelChooseFileClick = (fileType: FileTypeENUM) => {
    if (fileInputRef.current) {
      fileInputRef.current.fileType = fileType;
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileType = (e.target as HTMLInputElement & { fileType?: FileTypeENUM }).fileType;
    const uploadPromises = [];
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        uploadPromises.push(handleFileUpload(file, fileType));
      });
    }
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const printJobUsingPrintNode = async (jobId: string, productType?: string) => {
    const callBack = (res) => {
      if (res.success) {
        // Handle success
      }
    };
    let data = jobId;
    if (productType) {
      // data = data + "?productType=" + productType;
    }
    await printJobUsingPrintNodeApi(callApi, callBack, data);
  };

  return (
    <Stack minHeight={"50px"} position={"relative"} width={"500px"}>
      <Stack
        direction={"row"}
        gap={"10px"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h3 style={{ color: primaryColor(400), ...FONT_FAMILY.Inter(700, 14) }}>
          {title} {selectedMission && selectedMission?.number && `| ${selectedMission?.number}`}
        </h3>
        {pathname !== "/production-floor" && (
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton
              style={{
                width: "25px",
                height: "25px",
                padding: "2px",
              }}
              onClick={() => {
                push(
                  `/production-floor?boardMissionsId=${boardMissionId}&step=stations`
                ).then();
              }}
            >
              <FolderIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>

      <Stack
        direction="row"
        gap="20px"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Graphics Files Section */}
        <Stack
          gap="10px"
          onDrop={handleGraphicsDrop}
          onDragOver={handleGraphicsDragOver}
          onDragLeave={handleGraphicsDragLeave}
          className={`drop-zone ${isOverGraphics ? "dragging" : ""}`}
          width={"50%"}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <h3 style={{ ...FONT_FAMILY.Inter(600, 14) }}>
              {t("fileUploader.originalFiles")}
            </h3>
            {graphicsFiles?.length > 0 && (
              <IconButton
                style={{
                  width: "25px",
                  height: "25px",
                  padding: "2px",
                }}
                onClick={() => handelChooseFileClick(FileTypeENUM.Graphics)}
              >
                <OpenUploadFileIcon />
              </IconButton>
            )}
          </Stack>
          <Stack gap="10px">
            {graphicsFiles?.length === 0 && (
              <Stack direction={"row"} alignItems={"center"}>
                <Button
                  onClick={() => handelChooseFileClick(FileTypeENUM.Graphics)}
                  style={{
                    color: primaryColor(700),
                    ...FONT_FAMILY.Lexend(700, 15),
                    textTransform: "none",
                    gap: "5px",
                  }}
                  startIcon={<OpenUploadFileIcon />}
                >
                  {t("fileUploader.chooseFile")}
                </Button>
                <span
                  style={{
                    color: primaryColor(700),
                    ...FONT_FAMILY.Inter(500, 15),
                  }}
                >
                  {t("fileUploader.dropFile")}
                </span>
              </Stack>
            )}
            <Stack>
              <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
                {graphicsFiles.map((file, index) => (
                  <FileComponent
                    key={`${file.fileName}-${file.uploadId || index}`}
                    {...file}
                    filePath={filePath}
                    orderItemId={orderItemId}
                    productType={productType}
                    onFileDeleted={onFileDeleted}
                  />
                ))}
              </div>
            </Stack>
          </Stack>
        </Stack>
        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "#ECECEC",
          }}
        />
        {/* Printing Files Section */}
        <Stack
          gap="10px"
          onDrop={handlePrintingDrop}
          onDragOver={handlePrintingDragOver}
          onDragLeave={handlePrintingDragLeave}
          className={`drop-zone ${isOverPrinting ? "dragging" : ""}`}
          width={"50%"}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <h3 style={{ ...FONT_FAMILY.Inter(600, 14) }}>
              {t("fileUploader.printingFiles")}
            </h3>
            {printingFiles?.length > 0 && (
              <IconButton
                style={{
                  width: "25px",
                  height: "25px",
                  padding: "2px",
                }}
                onClick={() => handelChooseFileClick(FileTypeENUM.Printing)}
              >
                <OpenUploadFileIcon />
              </IconButton>
            )}
          </Stack>
          <Stack gap="10px">
            {printingFiles?.length === 0 && (
              <Stack direction={"row"} alignItems={"center"}>
                <Button
                  onClick={() => handelChooseFileClick(FileTypeENUM.Printing)}
                  style={{
                    color: primaryColor(700),
                    ...FONT_FAMILY.Lexend(700, 15),
                    textTransform: "none",
                    gap: "5px",
                  }}
                  startIcon={<OpenUploadFileIcon />}
                >
                  {t("fileUploader.chooseFile")}
                </Button>

                <span
                  style={{
                    color: primaryColor(700),
                    ...FONT_FAMILY.Inter(500, 15),
                  }}
                >
                  {t("fileUploader.dropFile")}
                </span>
              </Stack>
            )}
            <Stack>
              <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
                {printingFiles.map((file, index) => (
                  <FileComponent
                    key={`${file.fileName}-${file.uploadId || index}`}
                    {...file}
                    filePath={filePath}
                    orderItemId={orderItemId}
                    productType={productType}
                    onFileDeleted={onFileDeleted}
                  />
                ))}
              </div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <input
        type={"file"}
        multiple
        value={""}
        onChange={handleFileSelect}
        hidden={true}
        ref={fileInputRef}
      />

      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.printJobModaTitle")}
        subTitle={" "}
        yesBtn={t("sales.quote.print")}
        openModal={isOpenPrintingModal.isOpen}
        onClose={isOpenPrintingModal.close}
        onClickDelete={() => { printJobUsingPrintNode(boardMissionId, productType).then() }}
      />
    </Stack>
  );
};

export { FilesGroupComponent };