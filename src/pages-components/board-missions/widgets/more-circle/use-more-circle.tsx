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
  onClickReturnToProduction
}: any) => {

  const { t } = useTranslation();
  const { classes } = useStyle();

  const menuList = [
    {
      condition: true,
      name: "boardMissions.viewTask",
      icon: <VisibilityOutlinedIcon style={classes.iconStyle} />,
      onclick: () => null,
    },
    {
      condition: true,
      name: "boardMissions.pdfWorkMission",
      icon: <PDFIcon />,
      onclick: () => null,
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
      onclick: onClickDuplicate,
    },
    {
      //condition: mission?.productionStatus === PStatus.IN_PROCESS,
      condition: true,
      name: "boardMissions.markAsReady",
      icon: <TaskAltOutlinedIcon style={classes.iconStyle} />,
      onclick: onClickMarksAsDone,
    },
    {
      condition: true,

      //condition: mission?.productionStatus === PStatus.DONE,
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