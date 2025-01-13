import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf-icon";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useStyle } from "./style";
import { PackageIcon } from "@/icons/package-icon";
import { GetPrintingTicketPDFApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { PStatus } from "../enums";
import { Permissions } from "@/components/CheckPermission/enum";
import {
  addBoardMissionsToFileUploaderApi,
  printJobUsingPrintNodeApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { useRecoilState } from "recoil";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { MarkAsUnReadyIcon } from "./icons/mark-as-un-ready";
import { printHouseProfile } from "@/store/print-house-profile";
import { EditIcon } from "@/icons";
import { useUserPermission } from "@/hooks/use-permission";

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

  //!here the most imp
  const addBoardMissionsToFileUploader = async (mission) => {
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
    });
  };

  const handleClickMarkAsReady = () => {
    if (mission?.isReady) {
      onClickReturnToProduction(mission);
    } else {
      onClickMarksAsDone(mission);
    }
  };

  const printJobUsingPrintNode = async (jobId: string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await printJobUsingPrintNodeApi(callApi, callBack, jobId);
  };
  const { CheckPermission } = useUserPermission();

  const isSendPaymentToClient = CheckPermission(
    Permissions.SHOW_PRODUCTION_FLOOR
  );
  const isShowLogs = CheckPermission(Permissions.SHOW_LOGS);

  const menuList = [
    {
      condition: true && isSendPaymentToClient,
      name: (
        <a
          style={classes.menuTitleStyle}
          href={`/production-floor?boardMissionsId=${mission?.id}&step=stations`}
        >
          {t("boardMissions.viewTask")}
        </a>
      ),
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: () =>
        navigate(
          `/production-floor?boardMissionsId=${mission?.id}&step=stations`
        ),
    },
    {
      condition: mission?.isEditable && isSendPaymentToClient,
      name: (
        <a style={classes.menuTitleStyle} href={handleClickEdit(mission)}>
          {t("materials.buttons.edit")}
        </a>
      ),
      icon: <EditIcon />,
      onclick: () => navigate(handleClickEdit(mission)),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.pdfWorkMission"),
      icon: <PDFIcon />,
      onclick: () => onClickWorkMissionPdf(mission?.id, mission?.actionId),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.pdfProductionOrderSummary"),
      icon: <PDFIcon />,
      onclick: () => onClickOrderSummeryPdf(mission?.id),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.printProductionPdf"),
      icon: <PDFIcon />,
      onclick: () => GetPrintingTicketPDF(mission),
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("boardMissions.printPackagingSlip"),
      icon: <PackageIcon />,
      onclick:
        mission?.status === PStatus.IN_PROCESS
          ? () => onOpenModal(mission)
          : () => onClickPrintPackagingSlip(mission),
    },
    {
      condition: true,
      name: t("home.duplicate"),
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicate(mission),
    },
    {
      condition:
        mission?.status === PStatus.IN_PROCESS && isSendPaymentToClient,
      name: !mission?.isReady
        ? t("boardMissions.markAsReady")
        : t("boardMissions.markAsUnReady"),
      icon: !mission?.isReady ? (
        <TaskAltOutlinedIcon style={classes.iconStyle} />
      ) : (
        <MarkAsUnReadyIcon />
      ),
      onclick: () => handleClickMarkAsReady(),
    },
    // {
    //   condition: mission?.status === PStatus.DONE,
    //   name: "boardMissions.returnToProduction",
    //   icon: <LockOpenOutlinedIcon style={classes.iconStyle} />,
    //   onclick: () => onClickReturnToProduction(mission),
    // },
    {
      condition: true && isSendPaymentToClient && isShowLogs,
      name: t("home.loggers"),
      icon: <LoggerIcon />,
      onclick: () => {
        window.open(
          `/production-floor?boardMissionsId=${mission?.id}&step=activity`,
          "_blank"
        );
      },
    },
    {
      condition: true && isSendPaymentToClient,
      name: t("sales.quote.print"),
      icon: <PDFIcon />,
      onclick: () => {
        printJobUsingPrintNode(mission?.id).then();
      },
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
