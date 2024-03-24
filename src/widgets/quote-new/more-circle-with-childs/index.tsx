import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircleWithChilds } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const MoreMenuWidgetWithChilds = ({ quoteItem, onClickDeleteQouteItem }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
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
                style={classes.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                {item?.icon}
                <div style={classes.menuTitleStyle}>{t(`sales.quote.${item?.name}`)}</div>
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
export { MoreMenuWidgetWithChilds };
