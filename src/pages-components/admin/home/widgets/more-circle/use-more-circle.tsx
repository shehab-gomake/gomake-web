import { useState } from "react";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { DuplicateWithDifferentMenuIcon } from "./icons/duplicate-with-different-menu";
import { LoggerIcon } from "./icons/logger";
import { useTranslation } from "react-i18next";

const useMoreCircle = () => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = [
    {
      name: t("home.duplicate"),
      icon: <DuplicateMenuIcon />,
      onclick: () => null,
    },
    {
      name: t("home.documents"),
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => null,
    },
    {
      name: t("home.loggers"),
      icon: <LoggerIcon />,
      onclick: () => null,
    }
  ];

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
