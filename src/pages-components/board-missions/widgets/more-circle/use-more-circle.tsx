import { useState } from "react";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf-icon";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useStyle } from "./style";
import { getBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";

const useMoreCircle = ({
  mission,
  onClickDuplicate,
  onClickLoggers,
  onClickMarksAsDone,
  onClickReturnToProduction
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


  const onClickPrint = async (mission) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink)
      } else {
        alertFaultGetData();
      }
    };
    await getBoardMissionPDF(callApi, callBack, { boardMissionId: mission?.id });
  };


  const menuList = [
    {
      condition: true,
      name: "boardMissions.viewTask",
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: () => navigate(`/production-floor?boardMissionsId=${mission?.id}}`),
    },
    {
      condition: true,
      name: "boardMissions.pdfWorkMission",
      icon: <PDFIcon />,
      onclick: () => onClickPrint(mission),
    },
    {
      condition: true,
      name: "boardMissions.pdfProductionOrderSummary",
      icon: <PDFIcon />,
      onclick: () => null,
    },
    {
      condition: true,
      name: "home.duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicate(mission),
    },
    {
      //condition: mission?.productionStatus === PStatus.IN_PROCESS,
      condition: true,
      name: "boardMissions.markAsReady",
      icon: <TaskAltOutlinedIcon style={classes.iconStyle} />,
      onclick: () => onClickMarksAsDone(mission),
    },
    {
      condition: true,

      //condition: mission?.productionStatus === PStatus.DONE,
      name: "boardMissions.returnToProduction",
      icon: <LockOpenOutlinedIcon style={classes.iconStyle} />,
      onclick: () => onClickReturnToProduction(mission),
    },
    {
      condition: true,
      name: "home.loggers",
      icon: <LoggerIcon />,
      onclick: () => null,
    }
  ];

  return {
    t,
    menuList,
  };
};

export { useMoreCircle };