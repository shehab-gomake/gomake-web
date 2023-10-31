import React from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { useStyle } from './style';




const DropdownMenuUpward = ({ title , items, placement }) =>{
    const {classes} = useStyle();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <Button
          aria-controls="dropdown-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={classes.redButton}
        >
         <span style={classes.redTitle}>{title}</span> 
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top', 
            horizontal: 'right', 
          }}
          transformOrigin={{
            vertical: 'bottom', 
            horizontal: 'right',
          }}
          PaperProps={{
            style :  classes.customMenu, 
          }}
        >
          {items.map((item, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );

}
export {DropdownMenuUpward};