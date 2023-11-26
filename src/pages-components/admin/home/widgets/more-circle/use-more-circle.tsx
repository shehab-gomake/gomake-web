import { useState } from "react";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { DuplicateWithDifferentMenuIcon } from "./icons/duplicate-with-different-menu";
import { LoggerIcon } from "./icons/logger";

const useMoreCircle = () => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = [
    {
      name: "duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => null,
    },
    {
      name: "documents",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => null,
    },
    {
      name: "loggers",
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
