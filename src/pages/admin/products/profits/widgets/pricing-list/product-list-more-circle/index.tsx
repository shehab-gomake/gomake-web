import { useProductListMoreCircle } from "./use-product-list-more-circle";

import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeDeleteModal, GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { editPriceListState } from "../../../store/edit-price-list";

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
  console.log(
    "profitsStateValue.testProductsState",
    profitsStateValue.testProductsState
  );

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            console.log("resend");
          }}
        >
          {t("products.profits.testAgain")}
        </MenuItem>
        <MenuItem onClick={() => onOpenDeleteModal()}>Delete</MenuItem>
      </GoMakeMenu>
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("products.profits.deleteProduct")}
        yesBtn={t("products.profits.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "products.profits.subTitleDeleteProduct"
          //{ name: `${item?.name}`,}
        )}?`}
        onClickDelete={""}
      />
    </>
  );
};
export { ProductTestListMoreCircleWidget };
