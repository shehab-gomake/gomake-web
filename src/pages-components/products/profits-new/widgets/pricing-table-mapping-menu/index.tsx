import { MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";
import { ETypeException } from "../../enums/profites-enum";

const PricingTableMappingMenu = ({
  handleClose,
  open,
  anchorEl,
  selectedPricingTableItems,
  onClickOpenDeleteRowModal,
  onClickOpenAddNewRuleModal,
  setTypeExceptionSelected,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const isDefaultException =
    selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT;
  const menuList = [
    {
      name: t("home.duplicate"),
      onclick: () => {
        onClickOpenAddNewRuleModal();
        setTypeExceptionSelected(ETypeException.EDITBASE);
        handleClose();
      },
      hidden: false,
    },
    // {
    //   name: t("materials.buttons.edit"),
    //   onclick: handleClose,
    //   hidden: false,
    // },
    {
      name: t("navigationButtons.delete"),
      onclick: () => {
        onClickOpenDeleteRowModal();
        handleClose();
      },
      hidden: isDefaultException,
    },
  ];
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      {menuList?.map((item, index) => {
        return (
          <>
            {item.hidden ? null : (
              <MenuItem
                style={clasess.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                <div style={clasess.menuTitleStyle}>{item?.name}</div>
              </MenuItem>
            )}
            {index != menuList?.length - 1 ? (
              <div style={clasess.lineStyle} />
            ) : null}
          </>
        );
      })}
    </GoMakeMenu>
  );
};
export { PricingTableMappingMenu };
