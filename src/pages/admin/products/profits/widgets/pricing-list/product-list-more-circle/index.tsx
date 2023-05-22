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
          onClick={
            (profitsStateValue?.setTestProductState(item?.id),
            profitsStateValue?.onClickTestProduct)
          }
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
        subTitle={`${t("products.profits.subTitleDeleteProduct", {
          name: `${item?.name}`,
        })}?`}
        onClickDelete={
          (profitsStateValue?.setTestProductState(item?.id),
          profitsStateValue?.deleteTestProductResult)
        }
      />
    </>
  );
};
export { ProductTestListMoreCircleWidget };
