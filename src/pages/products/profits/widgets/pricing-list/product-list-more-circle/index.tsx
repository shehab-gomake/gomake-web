import { useProductListMoreCircle } from "./use-product-list-more-circle";

import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeDeleteModal, GoMakeMenu } from "@/components";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";

const ProductTestListMoreCircleWidget = ({ item }: any) => {
  const {
    open,
    anchorEl,
    openDeleteModal,
    t,
    handleClose,
    handleClick,
    onOpenDeleteModal,
    onCloseDeleteModal,
  } = useProductListMoreCircle();
  const profitsStateValue = useRecoilValue<any>(profitsState);

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            onOpenDeleteModal();
            handleClose();
            profitsStateValue?.setTestProductState(item?.id);
          }}
        >
          Delete
        </MenuItem>
      </GoMakeMenu>
      <GoMakeDeleteModal
        hideIcon={true}
        title={item?.item?.isBaseCase ? t("products.profits.deleteBaseProduct") : t("products.profits.deleteProduct")}
        yesBtn={t("products.profits.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={item?.item?.isBaseCase ? t('products.profits.subTitleDeleteBaseProduct') : `${t("products.profits.subTitleDeleteProduct", {
          name: `${item?.name}`,
        })}?`}
        onClickDelete={() => profitsStateValue?.deleteTestProductResult(item)}
      />
    </>
  );
};
export { ProductTestListMoreCircleWidget };
