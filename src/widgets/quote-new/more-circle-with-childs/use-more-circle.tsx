import { useState } from "react";
import { AnalysisIcon } from "../more-circle-with-childs/icons/analysis";
import { DeleteMenuIcon } from "../more-circle-with-childs/icons/delete-menu";

const useMoreCircleWithChilds = ({ quoteItem, onClickDeleteQouteItem }) => {
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
      name: "Analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    {
      name: "Delete",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickDeleteQouteItem(quoteItem),
    },
  ];

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircleWithChilds };
