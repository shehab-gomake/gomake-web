import { useState } from "react";
import { ReturnIcon } from "./icons/return";
import { CategoryIcon } from "./icons/category";
import { PaintIcon } from "./icons/format-paint";
import { MailIcon } from "./icons/mail";
import { BlockIcon } from "./icons/block";
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
      name: t("partners.Transfer to partial"),
      icon: <ReturnIcon />,
      onclick: () => null,
    },
    {
      name: t("partners.Connect with category"),
      icon: <CategoryIcon />,
      onclick: () => null,
    },
    {
      name: t("partners.Connect with machine"),
      icon: <PaintIcon/>,
      onclick: () => null,
    },
    {
      name: t("partners.Message"),
      icon: <MailIcon />,
      onclick: () => null,
    },
    {
      name: t("partners.Block"),
      icon: <BlockIcon />,
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
