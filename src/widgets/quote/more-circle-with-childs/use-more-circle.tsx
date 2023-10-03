import { useState } from "react";
import { AnalysisIcon } from "../more-circle-with-childs/icons/analysis";
import { DeleteMenuIcon } from "../more-circle-with-childs/icons/delete-menu";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";

const useMoreCircleWithChilds = ({ quoteItem }) => {
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
      name: "Analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    {
      name: "Delete",
      icon: <DeleteMenuIcon />,
      onclick: () => quoteStateValue.onClickDeleteQouteItem(quoteItem),
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
