import {Button, Menu} from "@mui/material";
import { useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const MenuButton = ({ children }) => {
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
      <Button
        onClick={handleMoreOptionIconClick}
        sx={{
            backgroundColor: '#FFF',
            borderRadius: '4px',
            minWidth: 'fit-content',
            color: '#667085'
        }}
        size={"small"}
      >
      <MoreHorizIcon/>
     </Button>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose2Menu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        {children}
      </Menu>
    </>
  );
};

export { MenuButton };