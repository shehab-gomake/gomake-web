import { useState } from "react";
import { AnalysisIcon } from "../more-circle-with-childs/icons/analysis";
import { DeleteMenuIcon } from "../more-circle-with-childs/icons/delete-menu";
import { useRouter } from "next/router";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

const useMoreCircleWithChilds = ({ quoteItem, onClickDeleteQouteItem }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { CheckPermission } = useUserPermission();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = [
    {
      name: "analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
      condition: !router.query.isNewCreation && quoteItem.productType === 0
    }, 
    {
      name: "delete",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickDeleteQouteItem(quoteItem),
      condition: router.query.isNewCreation || (quoteItem?.isDeletable && CheckPermission(Permissions.DELETE_QUOTE_ITEM))
    }
  ].filter(item => item.condition);

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircleWithChilds };
