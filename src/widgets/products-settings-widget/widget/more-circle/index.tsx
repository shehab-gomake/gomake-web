import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";

const MoreMenuWidget = ({ item, updatedProduct }: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    open,
    anchorEl,
    handleClose,
    handleClick,
    navigate,
    updatedProductInside,
  } = useMoreCircle({
    updatedProduct,
  });

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => navigate(`/settings/products/edit/${item?.id}`)}
        >
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>{t("remainWords.editing")}</div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => updatedProductInside(item)}>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div style={clasess.rowTextStyle}>
              {item?.status
                ? t("remainWords.convertToInactive")
                : t("remainWords.convertToActive")}
            </div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
