import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

interface IProps {
  document?: any;
  documentType?: any;
  onClickDuplicate?: ()=>void;
  onClickLoggers?:()=>void;
}
const MoreMenuWidget = ({ document, documentType ,onClickDuplicate , onClickLoggers}: IProps) => {
  const { classes } = useStyle();
  const { open, anchorEl, menuList, handleClose, handleClick } = useMoreCircle();
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl} >
        {menuList?.map((item, index) => {
          return (
            <>
              <MenuItem
                style={classes.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                {item?.icon}
                <div style={classes.menuTitleStyle}>{item?.name}</div>
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
