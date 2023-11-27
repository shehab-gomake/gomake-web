import { useState } from "react";
import { SmallCubeIcon } from "./icons/small-cube";
import { DollarIcon } from "./icons/dollar";
import { MailIcon } from "./icons/mail";
import { BlockIcon } from "./icons/block";
import { CubeIcon } from "./icons/cube";
import { CartIcon } from "./icons/cart";
import {  useSetRecoilState} from "recoil";
import { blockModalState, partnerInfoModalState } from "../../states";
import { useTranslation } from "react-i18next";

const useMoreCircle = () => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setOpenModal = useSetRecoilState<boolean>(blockModalState);
  const setOpenPartnerModal = useSetRecoilState<boolean>(partnerInfoModalState);
  const { t } = useTranslation();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = [
    {
      name: t("partners.Partner info"),
      icon: <CubeIcon />,
      onclick: () => {setAnchorEl(null) , setOpenPartnerModal(true) },
    },
    {
      name: t("partners.Go to quotes"),
      icon: <SmallCubeIcon />,
      onclick: () => null,
    },
    {
      name: t("partners.Cart"),
      icon: <CartIcon />,
      onclick: () => null,
    },
    {
      name: t("partners.Payments"),
      icon: <DollarIcon />,
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
      onclick: () => setOpenModal(true),
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
