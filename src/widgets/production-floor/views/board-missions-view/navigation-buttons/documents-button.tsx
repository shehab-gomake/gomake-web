import { PrimaryButton } from "@/components/button/primary-button";
import { CircularProgress, MenuItem, Paper } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { ArrowDownIcon } from "@/icons";

import {
  getBoardMissionPDF,
  GetPrintingTicketPDFApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PDFIcon } from "@/pages-components/quotes/more-circle/icons/pdf";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { getOrderSummeryPdfApi } from "@/services/api-service/board-missions/board-missions-table";
import { PackageIcon } from "@/icons/package-icon";
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { isReadyBoardMissionsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { moveBoardMissionToDoneApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { ModalType } from "@/enums";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingRight } from "@/utils/adapter";
import { useFrontDeskEmailIntegration } from "@/pages-components/quotes/hooks/use-frontdesk-email-integration";
import { FrontDeskEmailComposerWrapper } from "@/pages-components/quotes/components/frontdesk-email-composer-wrapper";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";

const DocumentsButton = ({ isMobile = false }) => {
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [open, setOpen] = useState<boolean>(false);
  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // ===== NEW STATE FOR PRINT TYPE SELECTION MODAL =====
  const [openPrintTypeModal, setOpenPrintTypeModal] = useState<boolean>(false);
  const [pendingPrintMission, setPendingPrintMission] = useState(null);

  const isReady = useRecoilValue(isReadyBoardMissionsState);
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const dir = t("direction");
  const { primaryColor } = useGomakeTheme();
  const { alertFaultGetData, alertFaultUpdate, alertSuccessUpdate } =
    useSnackBar();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuList = useMemo(
    () => [
      {
        condition: true,
        name: "boardMissions.pdfWorkMission",
        icon: <PDFIcon />,
        onclick: () => handlePrintClick(boardMissions), // CHANGED: Now calls handlePrintClick
      },
      {
        condition: true,
        name: "boardMissions.pdfProductionOrderSummary",
        icon: <PDFIcon />,
        onclick: () => onClickOrderSummeryPdf(boardMissions.boardMissionId),
      },
      {
        condition: true,
        name: t("boardMissions.printProductionPdf"),
        icon: <PDFIcon />,
        onclick: () => GetPrintingTicketPDF(boardMissions.boardMissionId),
      },
      {
        condition: true,
        name: t("boardMissions.printPackagingSlip"),
        icon: <PackageIcon />,
        onclick: () =>
          isReady ? setOpenPackagesModal(true) : setOpenConfirmModal(true),
      },
    ],
    [boardMissions]
  );

  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  const onClickOrderSummeryPdf = async (boardMissionId: string) => {
    setOpen(false);
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
      } else {
      }
    };
    await getOrderSummeryPdfApi(callApi, callBack, { boardMissionId });
  };

  // ===== NEW FUNCTION: Handle print click - checks if productType exists =====
  const handlePrintClick = (mission) => {
    setOpen(false); // Close the menu

    if (mission?.productType) {
      // Has productType - show modal to ask user
      setPendingPrintMission(mission);
      setOpenPrintTypeModal(true);
    } else {
      // No productType - proceed with full job
      processPrintRequest(mission, "");
    }
  };

  // ===== NEW FUNCTION: Process the actual print request =====
  const processPrintRequest = async (mission, productType) => {
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        // Handle error
      }
    };

    await getBoardMissionPDF(callApi, callBack, {
      boardMissionId: mission?.boardMissionId,
      productType: productType, // Will be "" for full job or actual productType for specific
    });
  };

  // ===== NEW FUNCTION: Handle user's choice from modal =====
  const handlePrintTypeChoice = (printAll: boolean) => {
    if (!pendingPrintMission) return;

    // Close modal
    setOpenPrintTypeModal(false);

    if (printAll) {
      // User wants full job - send empty string
      processPrintRequest(pendingPrintMission, "");
    } else {
      // User wants specific product type
      processPrintRequest(pendingPrintMission, pendingPrintMission.productType);
    }

    // Clear pending mission
    setPendingPrintMission(null);
  };

  // ===== REMOVED OLD onClickPrint function - replaced with handlePrintClick and processPrintRequest =====

  const GetPrintingTicketPDF = async (boardMissionId) => {
    setDownloading(true);
    const callBack = (res) => {
      setDownloading(false);

      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    await GetPrintingTicketPDFApi(callApi, callBack, { boardMissionId });
  };

  const {
    isEmailComposerOpen,
    emailData,
    openEmailComposer,
    closeEmailComposer,
  } = useFrontDeskEmailIntegration({ documentType: DOCUMENT_TYPE.boardMission });

  const onClickMoveBoardMissionToDone = async (isSendMessage: boolean = false) => {
    const callBack = (res) => {
      setOpenMarkReadyModal(false);
      if (boardMissions.productType === "" || !boardMissions.productType) {
        setOpenPackagesModal(true);
      }
      if (res?.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    // Mark as ready without sending message - user will decide in email composer
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: boardMissions?.boardMissionId,
      sendMessage: isSendMessage, // Don't send automatically - let user decide in composer
      productType: boardMissions?.productType
    });
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        zIndex: 9999999,
      }}
    >
      <PrimaryButton
        ref={buttonRef}
        style={{
          backgroundColor: primaryColor(300),
          borderRadius: isMobile ? "8px" : "12px",
          ...(isMobile && { height: "30px", ...FONT_FAMILY.Inter(500, 14) }),
        }}
        onClick={() => setOpen(!open)}
        variant={"contained"}
        disabled={downloading}
        startIcon={
          dir === "rtl" ? (
            <ArrowDownIcon
              fill={"#FFF"}
              width={isMobile ? "13px" : undefined}
              height={isMobile ? "10px" : undefined}
            />
          ) : undefined
        }
        endIcon={
          downloading ? (
            <CircularProgress size={isMobile ? 18 : 25} />
          ) : dir === "ltr" ? (
            <ArrowDownIcon
              fill={"#FFF"}
              width={isMobile ? "13px" : undefined}
              height={isMobile ? "10px" : undefined}
            />
          ) : undefined
        }
      >
        {t("productionFloor.documents")}
      </PrimaryButton>
      {!!open && (
        <ClickOutside exceptionRef={buttonRef} onClick={() => setOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              right: 0,
              top: "110%",
              zIndex: 9999999,
            }}
          >
            {menuList.map(
              (item, index) =>
                item.condition && (
                  <MenuItem
                    style={{
                      display: "flex",
                      flexDirection: "row" as "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 8,
                      color: primaryColor(300),
                      ...adaptPaddingRight(dir, isMobile ? 10 : 15),
                      ...(isMobile && { ...FONT_FAMILY.Inter(500, 12) }),
                    }}
                    key={index}
                    onClick={item?.onclick}
                  >
                    {item?.icon}
                    {t(item?.name)}
                  </MenuItem>
                )
            )}
          </Paper>
        </ClickOutside>
      )}

      {/* ===== NEW MODAL: Print Type Selection Modal ===== */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.selectPrintContent")}
        subTitle={
          pendingPrintMission?.productType
            ? t("boardMissions.askPrintType", {
              productType: pendingPrintMission.productTypeName || pendingPrintMission.productType
            })
            : ""
        }
        yesBtn={t("boardMissions.printAllJobs")}
        noBtn={t("boardMissions.printProductTypeOnly", {
          productType: pendingPrintMission?.productTypeName || pendingPrintMission?.productType
        })}
        openModal={openPrintTypeModal}
        onClose={() => {
          setOpenPrintTypeModal(false);
          setPendingPrintMission(null);
        }}
        onClickYes={() => handlePrintTypeChoice(true)}
        onClickNo={() => handlePrintTypeChoice(false)}
        style={
          isMobile
            ? {
              width: "95vw",
              maxWidth: 600,
              minWidth: "unset",
            }
            : undefined
        }
      />

      <PrintPackingSlipModalWidget
        openModal={openPackagesModal}
        onClose={() => setOpenPackagesModal(false)}
        boardMissionId={boardMissions?.boardMissionId}
        quantity={boardMissions?.quantity}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.printAndMoveToReadyTitle")}
        subTitle={" "}
        yesBtn={t("boardMissions.printAndTransferToReady")}
        noBtn={t("boardMissions.printOnly")}
        openModal={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onClickYes={() => {
          setOpenPackagesModal(false);
          setOpenMarkReadyModal(true);
        }}
        onClickNo={() => setOpenPackagesModal(true)}
        style={
          isMobile
            ? {
              width: "95vw",
              maxWidth: 600,
              minWidth: "unset",
            }
            : undefined
        }
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        openModal={openMarkReadyModal}
        onClose={() => setOpenMarkReadyModal(false)}
        onClickDelete={() => onClickMoveBoardMissionToDone(true)}
        onClickCancel={() => onClickMoveBoardMissionToDone(false)}
        style={
          isMobile
            ? {
              width: "95vw",
              maxWidth: 600,
              minWidth: "unset",
            }
            : undefined
        }
      />
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={boardMissions?.boardMissionId}
          documentType={DOCUMENT_TYPE.boardMission}
        />
      )}
    </div>
  );
};

export { DocumentsButton };
