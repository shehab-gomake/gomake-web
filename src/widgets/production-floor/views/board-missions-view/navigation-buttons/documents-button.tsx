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
import { ThreeOptionsModal } from "@/components";
import { isReadyBoardMissionsState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { moveBoardMissionToDoneApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { ModalType } from "@/enums";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingRight } from "@/utils/adapter";

const DocumentsButton = ({ isMobile = false }) => {
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [open, setOpen] = useState<boolean>(false);
  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const isReady = useRecoilValue(isReadyBoardMissionsState);
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
        onclick: () => onClickPrint(boardMissions),
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

  const onClickPrint = async (mission) => {
    setDownloading(true);
    setOpen(false);
    const callBack = (res) => {
      setDownloading(false);
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
      }
    };
    await getBoardMissionPDF(callApi, callBack, {
      boardMissionId: mission?.boardMissionId,
      productType: mission?.productType ?? "",
    });
  };

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

  const onClickMoveBoardMissionToDone = async (sendMessage: boolean) => {
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
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: boardMissions?.boardMissionId,
      sendMessage,
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
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyModal}
        onClose={() => setOpenMarkReadyModal(false)}
        onClickYes={() => onClickMoveBoardMissionToDone(true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false)}
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
    </div>
  );
};

export { DocumentsButton };
