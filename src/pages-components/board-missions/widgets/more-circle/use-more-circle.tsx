import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf-icon";
import { StartProductionIcon } from "./icons/start-production";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useStyle } from "./style";
import { PackageIcon } from "@/icons/package-icon";
import { QualityIssueIcon } from "@/widgets/production-floor/table-view/status-table/table-row/more-circle/icons/quality-issue";
import { GetPrintingTicketPDFApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { BoardMissionStatusForFilter } from "../enums";
import { Permissions } from "@/components/CheckPermission/enum";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { addBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import { useRecoilState } from "recoil";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { MarkAsUnReadyIcon } from "./icons/mark-as-un-ready";
import { printHouseProfile } from "@/store/print-house-profile";
import { EditIcon, TickMoveIcon } from "@/icons";
import { useUserPermission } from "@/hooks/use-permission";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import {
  moveBoardMissionStatusToWaitingApi,
  tryMoveBoardMissionToDoneApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { selectedMissionsState } from "@/widgets/production-floor/state/boards";
import { ORDER_STATUSES } from "@/enums";

const useMoreCircle = ({
  mission,
  onClickDuplicate,
  onClickMarksAsDone,
  onClickReturnToProduction,
  onClickOrderSummeryPdf,
  onClickWorkMissionPdf,
  onClickPrintPackagingSlip,
  onOpenModal,
  handleClickEdit,
  onClickMarksAsDoneForProductType,
  isDoneJobs,
  handleClickBackToProcess,
  onOpenMarkReadyModalForHasJobs,
  printJobUsingPrintNode,
  onOpenMarkReadyTypeModal,
  onReportQualityIssue,
  onOpenStartProductionModal,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultGetData } = useSnackBar();
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [companyProfile] = useRecoilState(printHouseProfile);

  const [selectedMission, setSelectedMission] = useRecoilState<any>(
    selectedMissionsState
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

  const GetPrintingTicketPDF = async (mission) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    await GetPrintingTicketPDFApi(callApi, callBack, {
      boardMissionId: mission?.id,
    });
  };

  const addBoardMissionsToFileUploader = async (mission) => {
    setSelectedMission(mission);
    const callBack = (res) => {
      if (res?.success) {
        setOpenFileUploader(true);
        setShowFileUploader(true);
      } else {
      }
    };
    await addBoardMissionsToFileUploaderApi(callApi, callBack, {
      boardMissionsId: mission?.id,
      connectionId: connectionId,
      productType: mission?.productType,
    });
  };

  // ✅ UPDATED handleClickMarkAsReady FUNCTION
  const handleClickMarkAsReady = () => {
    if (mission?.isReady) {
      // If already ready, mark as unready
      onClickReturnToProduction(mission);
    } else {
      // Check if mission has productType
      if (mission?.productType) {
        onOpenMarkReadyTypeModal(mission);
      } else {
        tryMoveBoardMissionsToDone(mission);
      }
    }
  };

  //  UPDATED tryMoveBoardMissionsToDone FUNCTION
  // This is now only called when there's NO productType
  // OR from the modal handler after user makes their choice
  const tryMoveBoardMissionsToDone = async (boardMission) => {
    const callBack = (res) => {
      if (res.success) {
        // Since this is only called when NO productType exists,
        // we handle the normal flow
        if (res.data) {
          // Has jobs - show has jobs modal
          onOpenMarkReadyModalForHasJobs(boardMission);
        } else {
          // No jobs - show regular mark ready modal
          onClickMarksAsDone(boardMission);
        }
      }
    };

    await tryMoveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: boardMission.id,
    });
  };

  const { CheckPermission, CheckDocumentPermission } = useUserPermission();

  const isSendPaymentToClient = CheckPermission(
    Permissions.SHOW_PRODUCTION_FLOOR
  );

  const isCanEditJob = CheckDocumentPermission(
    DOCUMENT_TYPE.order.toString(),
    DocumentPermission.UPDATE_DOCUMENT_ITEM
  );

  const isShowLogs = CheckPermission(Permissions.SHOW_LOGS);

  const hasPrintPackagingSlipPermission = CheckPermission(
    Permissions.ALLOW_PRINT_PACKAGING_SLIP_BEFORE_READY
  );

  const menuList = [
    {
      condition: true && isSendPaymentToClient,
      name: (
        <a
          style={classes.menuTitleStyle}
          href={
            mission?.groupedInJobId !== null
              ? `/production-floor?boardMissionsId=${mission?.groupedInJobId}${
                  mission?.productType
                    ? `&productType=${mission?.productType}`
                    : ""
                }&step=stations`
              : `/production-floor?boardMissionsId=${mission?.id}${
                  mission?.productType
                    ? `&productType=${mission?.productType}`
                    : ""
                }&step=stations`
          }
          target="_blank"
        >
          {t("boardMissions.viewTask")}
        </a>
      ),
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: () => {},
    },
    {
      condition: mission?.isEditable && isCanEditJob,
      name: (
        <a style={classes.menuTitleStyle} href={handleClickEdit(mission)}>
          {t("materials.buttons.edit")}
        </a>
      ),
      icon: <EditIcon stroke={"var(--theme-secondary-300, #8283BE)"} />,
      onclick: () => navigate(handleClickEdit(mission)),
    },
    {
      condition: true,
      onclick: () =>
        navigate(
          `/purchaseOrders?finalPatternSearch=${mission?.orderNumber}&pageNumber=1`
        ),
      icon: <TickMoveIcon />,
      name: t("sales.quote.purchaseOrders"),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.pdfWorkMission"),
      icon: <PDFIcon />,
      onclick: () =>
        onClickWorkMissionPdf(
          mission?.id,
          mission?.actionId,
          mission?.productType,
          mission?.productTypeName
        ),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.pdfProductionOrderSummary"),
      icon: <PDFIcon />,
      onclick: () => onClickOrderSummeryPdf(mission?.id),
    },
    {
      condition: true && isSendPaymentToClient && !isDoneJobs,
      name: t("boardMissions.printProductionPdf"),
      icon: <PDFIcon />,
      onclick: () => GetPrintingTicketPDF(mission),
    },
    {
      condition:
        isSendPaymentToClient &&
        !isDoneJobs &&
        (mission?.status === BoardMissionStatusForFilter.DONE ||
          mission?.isReady ||
          hasPrintPackagingSlipPermission),
      name: t("boardMissions.printPackagingSlip"),
      icon: <PackageIcon />,
      onclick:
        mission?.status !== BoardMissionStatusForFilter.DONE &&
        !mission?.isReady
          ? () => onOpenModal(mission)
          : () => onClickPrintPackagingSlip(mission),
    },
    {
      condition: true && !isDoneJobs,
      name: t("home.duplicate"),
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicate(mission),
    },
    {
      condition:
        true && isSendPaymentToClient && onReportQualityIssue && !isDoneJobs,
      name: t("productionFloor.reportQualityIssue"),
      icon: <QualityIssueIcon />,
      onclick: () => onReportQualityIssue?.(mission),
    },
    {
      condition: mission?.boardMissionStatus?.key === "Stuck",
      name: t("boardMissions.backToProcess"),
      icon: <MarkAsUnReadyIcon />,
      onclick: () => handleClickBackToProcess(mission),
    },
    {
      condition:
        mission?.orderStatus === ORDER_STATUSES.WaitingForPayment &&
        onOpenStartProductionModal,
      name: t("boardMissions.startProduction"),
      icon: <StartProductionIcon />,
      onclick: () => onOpenStartProductionModal?.(mission),
    },
    {
      condition: isSendPaymentToClient,
      name: !mission?.isReady
        ? t("boardMissions.markAsReady")
        : t("boardMissions.markAsUnReady"),
      icon: !mission?.isReady ? (
        <TaskAltOutlinedIcon style={classes.iconStyle} />
      ) : (
        <MarkAsUnReadyIcon />
      ),
      onclick: () => handleClickMarkAsReady(), // ✅ This now checks for productType
    },
    {
      condition: true && isSendPaymentToClient && isShowLogs,
      name: t("home.loggers"),
      icon: <LoggerIcon />,
      onclick: () => {
        window.open(
          `/production-floor?boardMissionsId=${mission?.id}${
            mission?.productType ? `&productType=${mission.productType}` : ""
          }&step=stations`,
          "_blank"
        );
      },
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("sales.quote.print"),
      icon: <PDFIcon />,
      onclick: () =>
        printJobUsingPrintNode(
          mission?.id,
          mission?.productType,
          mission?.productTypeName
        ).then(),
    },
    !!companyProfile.filesApiAddress && {
      condition: true && isSendPaymentToClient,
      name: t("fileUploader.uploadFile"),
      icon: <PDFIcon />,
      onclick: () => addBoardMissionsToFileUploader(mission),
    },
  ];

  return {
    t,
    menuList,
  };
};

export { useMoreCircle };
