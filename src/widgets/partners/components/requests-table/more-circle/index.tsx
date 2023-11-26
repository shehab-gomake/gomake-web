import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidget = () => {
  const { classes } = useStyle();
  const { open, anchorEl, menuList, handleClose, handleClick } = useMoreCircle();
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {menuList?.map((item, index) => {
          return (
            <>
              <MenuItem
                style={classes.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                {item?.icon}
                <div style={index == 4 ? classes.menuBlockTitleStyle : classes.menuTitleStyle}>{item?.name}</div>
              </MenuItem>
              {index != menuList?.length - 1 ? (
                <div style={classes.lineStyle} />
              ) : null}
            </>
          );
        })}
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
