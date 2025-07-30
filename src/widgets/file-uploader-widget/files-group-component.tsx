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

const FilesGroupComponent = ({
  title,
  filesInfo,
  orderItemId,
  filePath,
  graphicsFilePath,
  boardMissionId,
  isComplexProduct,
  productType
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
  const fileInputRef = useRef(null);
  const { t } = useTranslation();


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

  const graphicsFiles = filesInfo.filter(
    (file) => file.fileType === FileTypeENUM.Graphics
  );
  const printingFiles = filesInfo.filter(
    (file) => file.fileType === FileTypeENUM.Printing
  );

  const handelChooseFileClick = (fileType: FileTypeENUM) => {
    if (fileInputRef.current) {
      fileInputRef.current.fileType = fileType;
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e) => {
    const fileType = e.target.fileType;
    [...e.target.files].forEach(async (file) => {
      await handleFileUpload(file, fileType);
    });

  };
  const printJobUsingPrintNode = async (jobId: string,productType?:string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    let data = jobId;
    if(productType){
      data = data + "?productType="+productType;
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
          {title}
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
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}>
                {graphicsFiles.map((file) => (
                  <FileComponent {...file} />
                ))}
              </div>
            </Stack>
          </Stack>
        </Stack>
        {/* Divder */}
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
            <Stack >
              <div style={{
                maxHeight: '200px',
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}>
                {printingFiles.map((file) => (
                  <FileComponent {...file} />
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
        onClickDelete={() => { printJobUsingPrintNode(boardMissionId,productType).then() }}
      />
    </Stack>
  );
};

export { FilesGroupComponent };
