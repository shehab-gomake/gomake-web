import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf-icon";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useStyle } from "./style";
import { PackageIcon } from "@/icons/package-icon";
import { GetPrintingTicketPDFApi, getBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { PStatus } from "../enums";

const useMoreCircle = ({
  mission,
  onClickDuplicate,
  onClickLoggers,
  onClickMarksAsDone,
  onClickReturnToProduction,
  onClickOrderSummeryPdf,
  onClickWorkMissionPdf,
  onClickPrintPackagingSlip,
  onOpenModal
}: any) => {

  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, } = useSnackBar();
  const { navigate } = useGomakeRouter();
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
        downloadPdf(pdfLink)
      } else {
        alertFaultGetData();
      }
    };
    await GetPrintingTicketPDFApi(callApi, callBack, { boardMissionId: mission?.id });
  };

  const menuList = [
    {
      condition: true,
      name: "boardMissions.viewTask",
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: () => {
        window.open(`/production-floor?boardMissionsId=${mission?.id}&step=stations`, '_blank');
      },
    },
    {
      condition: true,
      name: "boardMissions.pdfWorkMission",
      icon: <PDFIcon />,
      onclick: () => onClickWorkMissionPdf(mission?.id),
    },
    {
      condition: true,
      name: "boardMissions.pdfProductionOrderSummary",
      icon: <PDFIcon />,
      onclick: () => onClickOrderSummeryPdf(mission?.id),
    },
    {
      condition: true,
      name: "boardMissions.printProductionPdf",
      icon: <PDFIcon />,
      onclick: () => GetPrintingTicketPDF(mission),

    },
    {
      condition: true,
      name: "boardMissions.printPackagingSlip",
      icon: <PackageIcon />,
      onclick: mission?.status === PStatus.IN_PROCESS ? () => onOpenModal(mission) : () => onClickPrintPackagingSlip(mission),

    },
    {
      condition: true,
      name: "home.duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicate(mission),
    },
    {
      condition: mission?.status === PStatus.IN_PROCESS,
      name: "boardMissions.markAsReady",
      icon: <TaskAltOutlinedIcon style={classes.iconStyle} />,
      onclick: () => onClickMarksAsDone(mission),
    },
    {
      condition: mission?.status === PStatus.DONE,
      name: "boardMissions.returnToProduction",
      icon: <LockOpenOutlinedIcon style={classes.iconStyle} />,
      onclick: () => onClickReturnToProduction(mission),
    },
    {
      condition: true,
      name: "home.loggers",
      icon: <LoggerIcon />,
      onclick: () => {
        window.open(`/production-floor?boardMissionsId=${mission?.id}&step=activity`, '_blank');
      },
    }
  ];

  return {
    t,
    menuList,
  };
};

export { useMoreCircle };