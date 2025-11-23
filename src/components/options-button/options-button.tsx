import { IOptionsButtonProps } from "@/components/options-button/interface";
import { IconButton, Menu } from "@mui/material";
import { useStyle } from "@/components/options-button/style";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

const OptionsButton = ({ children, withCircle = true }: IOptionsButtonProps) => {
  const { classes } = useStyle({ withCircle });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClose2Menu = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        onClick={handleMoreOptionIconClick}
        sx={classes.button}
        size={"small"}
      >
        <MoreVertIcon sx={classes?.iconStyle} />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose2Menu}
        PaperProps={classes.menuItem}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        {typeof children === 'function' ? children(handleCloseMenu) : children}
      </Menu>
    </>
  );
};

export { OptionsButton };