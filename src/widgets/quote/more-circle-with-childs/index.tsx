import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircleWithChilds } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidgetWithChilds = ({ quoteItem, onClickDeleteQouteItem }) => {
  const { clasess } = useStyle();
  const { open, anchorEl, menuList, handleClose, handleClick } =
    useMoreCircleWithChilds({
      quoteItem,
      onClickDeleteQouteItem,
    });
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
                style={clasess.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                {item?.icon}
                <div style={clasess.menuTitleStyle}>{item?.name}</div>
              </MenuItem>
              {index != menuList?.length - 1 ? (
                <div style={clasess.lineStyle} />
              ) : null}
            </>
          );
        })}
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidgetWithChilds };
