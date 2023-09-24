import { useCustomer, useGomakeRouter } from "@/hooks";
import { useState } from "react";

const useHeader = () => {
  const { navigate } = useGomakeRouter();
  const { user } = useCustomer();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return { user, open, anchorEl, handleClick, handleClose, navigate };
};

export { useHeader };
