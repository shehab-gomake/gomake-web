import { useState } from "react";
import { EditMenuIcon } from "./icons/edit-menu";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { DuplicateWithDifferentMenuIcon } from "./icons/duplicate-with-different-menu";
import { NegotiateRequestIcon } from "./icons/negotiate-request";
import { AnalysisIcon } from "./icons/analysis";
import { DeleteMenuIcon } from "./icons/delete-menu";
import { useRecoilValue } from "recoil";
import { quoteState } from "../../store/quote";

const useMoreCircle = () => {
  const quoteStateValue = useRecoilValue<any>(quoteState);

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
      name: "Edits",
      icon: <EditMenuIcon />,
      onclick: () => null,
    },
    {
      name: "Duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => null,
    },
    {
      name: "Duplicate with different QTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => null,
    },
    {
      name: "Negotiate request",
      icon: <NegotiateRequestIcon />,
      onclick: () => quoteStateValue.onOpenNegotiateRequest(),
    },
    {
      name: "Analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    {
      name: "Delete",
      icon: <DeleteMenuIcon />,
      onclick: () => null,
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

export { useMoreCircle };
