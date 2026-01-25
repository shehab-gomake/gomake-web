import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useState } from "react";

const usePricingListMenu = () => {
  const { primaryColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return {
    open,
    handleClose,
    handleClick,
    anchorEl,
    primaryColor,
  };
};

export { usePricingListMenu };
