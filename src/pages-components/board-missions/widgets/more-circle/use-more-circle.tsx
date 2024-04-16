import { useState } from "react";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf-icon";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { PStatus } from "../enums";
import { useStyle } from "./style";

const useMoreCircle = ({
  mission,
  onClickDuplicate,
  onClickLoggers,
  onClickMarksAsDone,
  onClickReturnToProduction,
  onClickOrderSummeryPdf,
  onClickWorkMissionPdf,
  onClickPrintPackagingSlip
}: any) => {

  const { t } = useTranslation(); 
  const { classes } = useStyle();

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
      onclick: ()=>onClickWorkMissionPdf(mission?.id),
    },
    {
      condition: true,
      name: "boardMissions.pdfProductionOrderSummary",
      icon: <PDFIcon />,
      onclick: ()=>onClickOrderSummeryPdf(mission?.id),
    },
    {
      condition: true,
      name: "Print packaging slip",
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: ()=>onClickPrintPackagingSlip(mission),

    },
    {
      condition: true,
      name: "home.duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: ()=>onClickDuplicate(mission),
    },
    {
      condition: mission?.status === PStatus.IN_PROCESS,
      name: "boardMissions.markAsReady",
      icon: <TaskAltOutlinedIcon style={classes.iconStyle} />,
      onclick: onClickMarksAsDone,
    },
    {
      condition: mission?.status === PStatus.DONE,
      name: "boardMissions.returnToProduction",
      icon: <LockOpenOutlinedIcon style={classes.iconStyle} />,
      onclick: onClickReturnToProduction,
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