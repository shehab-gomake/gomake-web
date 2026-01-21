import { MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";

const AdditinalProfitMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickOpenDeleteAdditionalRowModal,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const menuList = [
    {
      name: t("navigationButtons.delete"),
      onclick: () => {
        onClickOpenDeleteAdditionalRowModal();
        handleClose();
      },
    },
  ];
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      {menuList?.map((item, index) => {
        return (
          <>
            <MenuItem
              style={classes.menuItemContainer}
              key={index}
              onClick={item?.onclick}
            >
              <div style={classes.menuTitleStyle}>{item?.name}</div>
            </MenuItem>
            {index != menuList?.length - 1 ? (
              <div style={classes.lineStyle} />
            ) : null}
          </>
        );
      })}
    </GoMakeMenu>
  );
};
export { AdditinalProfitMenu };
