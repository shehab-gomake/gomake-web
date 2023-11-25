import { useState } from "react";
import { SmallCubeIcon } from "./icons/small-cube";
import { DollarIcon } from "./icons/dollar";
import { MailIcon } from "./icons/mail";
import { BlockIcon } from "./icons/block";
import { CubeIcon } from "./icons/cube";
import { CartIcon } from "./icons/cart";

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
      name: "Go to orders",
      icon: <CubeIcon />,
      onclick: () => null,
    },
    {
      name: "Go to quotes",
      icon: <SmallCubeIcon />,
      onclick: () => null,
    },
    {
      name: "Cart",
      icon: <CartIcon />,
      onclick: () => null,
    },
    {
      name: "Payments",
      icon: <DollarIcon />,
      onclick: () => null,
    },
    {
      name: "Message",
      icon: <MailIcon />,
      onclick: () => null,
    },
    {
      name: "Block",
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
