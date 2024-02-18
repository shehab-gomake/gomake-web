import { DeleteMenuIcon } from "@/widgets/quote/more-circle/icons/delete-menu";
import { DuplicateMenuIcon } from "@/widgets/quote/more-circle/icons/duplicate-menu";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = ({onClickDuplicate , onClickDelete }:any) => {
  
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
      onclick: onClickDuplicate,
    },
    {
      name: t("customers.buttons.delete"),
     icon: <DeleteMenuIcon />,
      onclick:  onClickDelete,
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
