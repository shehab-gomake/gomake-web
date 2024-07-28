import { IOptionsButtonProps } from "@/components/options-button/interface";
import { IconButton, Menu } from "@mui/material";
import { useStyle } from "@/components/options-button/style";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

const OptionsButton = ({ children, }: IOptionsButtonProps) => {
  const { classes } = useStyle();
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
        <MoreVertIcon sx={{ width: 13, height: 18 }}>M</MoreVertIcon>
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
        {children}
      </Menu>
    </>
  );
};

export { OptionsButton };