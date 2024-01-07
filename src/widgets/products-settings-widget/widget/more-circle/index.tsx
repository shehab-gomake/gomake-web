import { IconButton, MenuItem, Popover } from "@mui/material";
import { MoreCircleIcon, PlusIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { DocumentIcon } from "./icons/document";

const MoreMenuWidget = ({ item, updatedProduct }: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    open,
    anchorEl,
    router,
    handleClose,
    handleClick,
    navigate,
    updatedProductInside,
    createSubProduct,
    setAllProducts,
    idPopover,
    openPopover,
    anchorElPopover,
    handleClosePopover,
    handleClickPopover,
  } = useMoreCircle({
    updatedProduct,
    item,
  });
  return (
    <>
      <PermissionCheck userPermission={Permissions.EDIT_PRODUCT}>
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
          {!router.query.productId && (
            <>
              <MenuItem onClick={() => createSubProduct(item)}>
                <div style={clasess.menuRowStyle}>
                  <PlusIcon stroke="#8283BE" />
                  <div style={clasess.rowTextStyle}>
                    {t("remainWords.createSubProduct")}
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={clasess.menuRowStyle}
                  onClick={(e: any) =>
                    setAllProducts?.length > 0
                      ? navigate(
                          `/settings/products/sub-product/${item?.id}?productName=${item?.name}`
                        )
                      : handleClickPopover(e)
                  }
                >
                  <DocumentIcon />
                  <div style={clasess.rowTextStyle}>
                    {t("remainWords.goToSubProducts")}
                  </div>
                </div>
              </MenuItem>
            </>
          )}
        </GoMakeMenu>
      </PermissionCheck>
      <Popover
        id={idPopover}
        open={openPopover}
        anchorEl={anchorElPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={clasess.errorMsgStyle}>no sub products founded</div>
      </Popover>
    </>
  );
};
export { MoreMenuWidget };
