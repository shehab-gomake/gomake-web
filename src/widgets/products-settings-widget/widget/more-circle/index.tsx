import { IconButton, MenuItem, Popover } from "@mui/material";
import { MoreCircleIcon, PlusIcon } from "@/icons";
import { GoMakeDeleteModal, GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { DocumentIcon } from "./icons/document";
import { DeleteMenuIcon } from "@/widgets/quote-new/more-circle/icons/delete-menu";
import { DuplicateIcon } from "@/components/icons/icons";
import { ModalType } from "@/enums";

const MoreMenuWidget = ({
  item,
  updatedProduct,
  getActions,
  isSubProduct,
}: any) => {
  const { classes } = useStyle();
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
    idPopover,
    openPopover,
    anchorElPopover,
    handleClosePopover,
    handleClickPopover,
    openDeleteRowModal,
    onClickCloseDeleteRowModal,
    onClickOpenDeleteRowModal,
    deleteProductById,
    onClickDuplicateProduct,
    openDuplicateRowModal,
    onClickCloseDuplicateRowModal,
    onClickOpenDuplicateRowModal,
    primarySecondaryBlend,
  } = useMoreCircle({
    updatedProduct,
    item,
    getActions,
  });
  return (
    <>
      <PermissionCheck userPermission={Permissions.EDIT_PRODUCT}>
        <IconButton onClick={handleClick}>
          <MoreCircleIcon />
        </IconButton>
        <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();

              const url = router?.query?.isSubProducts
                ? `/settings/products/edit/${
                    item?.id
                  }?productName=${encodeURIComponent(
                    item?.name
                  )}&isSubProducts=true`
                : `/settings/products/edit/${
                    item?.id
                  }?productName=${encodeURIComponent(item?.name)}`;

              // Force navigation using window.location to ensure clean state
              // This ensures the page fully reloads and clears any search state
              window.location.href = url;
            }}
          >
            <div style={classes.menuRowStyle}>
              <EditingIcon />
              <div style={classes.rowTextStyle}>{t("remainWords.editing")}</div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => updatedProductInside(item)}>
            <div style={classes.menuRowStyle}>
              <ConvertIcon />
              <div style={classes.rowTextStyle}>
                {item?.status
                  ? t("remainWords.convertToInactive")
                  : t("remainWords.convertToActive")}
              </div>
            </div>
          </MenuItem>
          {!router.query.productId &&
            !router.query.isSubProducts &&
            !isSubProduct && (
              <>
                <MenuItem onClick={() => createSubProduct(item)}>
                  <div style={classes.menuRowStyle}>
                    <PlusIcon stroke={primarySecondaryBlend(500)} />
                    <div style={classes.rowTextStyle}>
                      {t("remainWords.createSubProduct")}
                    </div>
                  </div>
                </MenuItem>
              </>
            )}
          <MenuItem>
            <div
              style={classes.menuRowStyle}
              onClick={onClickOpenDuplicateRowModal}
            >
              <DuplicateIcon />
              <div style={classes.rowTextStyle}>
                {t("navigationButtons.duplicate")}
              </div>
            </div>
          </MenuItem>
          <MenuItem>
            <div
              style={classes.menuRowStyle}
              onClick={onClickOpenDeleteRowModal}
            >
              <DeleteMenuIcon />
              <div style={classes.rowTextStyle}>
                {t("navigationButtons.delete")}
              </div>
            </div>
          </MenuItem>
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
        <div style={classes.errorMsgStyle}>no sub products founded</div>
      </Popover>
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={deleteProductById}
      />

      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.DUPLICATE}
        title="Duplicate Product"
        subTitle="do you want to duplicate this product?"
        yesBtn={t("navigationButtons.duplicate")}
        openModal={openDuplicateRowModal}
        onClose={onClickCloseDuplicateRowModal}
        onClickDelete={onClickDuplicateProduct}
      />
    </>
  );
};
export { MoreMenuWidget };
