import { usePricingListMenu } from "./use-menu-modal";
import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import {  useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { useTranslation } from "react-i18next";

const PricingListMenuWidget = ({ item }: any) => {
  const { t } = useTranslation();
  const { open, handleClose, handleClick, anchorEl , primaryColor } = usePricingListMenu();
  const profitsStateValue = useRecoilValue<any>(profitsState);

  return (
    <>
      <IconButton disabled={!!item?.isBaseCaseQuantity} onClick={handleClick}>
        <MoreCircleIcon color={primaryColor(500)}/>
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            profitsStateValue?.deleteActionProfitRow(item?.id);
            handleClose();
          }}
        >
          {t("products.profits.delete")}
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { PricingListMenuWidget };
