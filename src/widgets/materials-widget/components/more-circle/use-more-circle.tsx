import { useState } from "react";

const useMoreCircle = ({ onChangeRowCheckBox, dataRow }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    //onChangeRowCheckBox(dataRow.id, true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    //onChangeRowCheckBox(dataRow.id, false);
  };

  return {
    open,
    anchorEl,

    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
