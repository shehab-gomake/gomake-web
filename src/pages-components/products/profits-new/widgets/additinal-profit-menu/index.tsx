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
  const { clasess } = useStyle();
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
              style={clasess.menuItemContainer}
              key={index}
              onClick={item?.onclick}
            >
              <div style={clasess.menuTitleStyle}>{item?.name}</div>
            </MenuItem>
            {index != menuList?.length - 1 ? (
              <div style={clasess.lineStyle} />
            ) : null}
          </>
        );
      })}
    </GoMakeMenu>
  );
};
export { AdditinalProfitMenu };
