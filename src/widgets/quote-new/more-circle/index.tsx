import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const MoreMenuWidget = ({
  quoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  documentType,
  onClickUndoItemIntake,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, menuList, handleClose, handleClick } = useMoreCircle({
    quoteItem,
    onClickDuplicateWithDifferentQTY,
    onClickQuickDuplicate,
    onClickDeleteQouteItem,
    documentType,
    onClickUndoItemIntake,
  });

  return (
    <>
      {menuList?.length !== 0 && (
        <IconButton onClick={handleClick}>
          <MoreCircleIcon />
        </IconButton>
      )}
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {menuList?.map((item, index) => {
          return (
            <div key={index}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    item.onclick();
                  }}
                >
                  <MenuItem style={classes.menuItemContainer}>
                    {item.icon}
                    <div style={classes.menuTitleStyle}>
                      {t(`sales.quote.${item?.name}`)}
                    </div>
                  </MenuItem>
                </a>
              ) : (
                <MenuItem
                  style={classes.menuItemContainer}
                  onClick={item.onclick}
                >
                  {item.icon}
                  <div style={classes.menuTitleStyle}>
                    {t(`sales.quote.${item?.name}`)}
                  </div>
                </MenuItem>
              )}
              {index !== menuList?.length - 1 ? (
                <div style={classes.lineStyle} />
              ) : null}
            </div>
          );
        })}
      </GoMakeMenu>
    </>
  );
};

export { MoreMenuWidget };
