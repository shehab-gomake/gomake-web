import { useState } from "react";

const useMoreCircle = () => {
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
    anchorEl,

    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
