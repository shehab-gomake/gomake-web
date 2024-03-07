import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllSubProducts } from "@/services/hooks/admin-side/products/get-all-sub-products";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = ({ updatedProduct, item, getActions }) => {
  const [anchorElPopover, setAnchorElPopover] =
    useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorElPopover);
  const idPopover = openPopover ? "simple-popover" : undefined;
  const handleClosePopover = () => {
    setAnchorElPopover(null);
    handleClose();
  };
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPopover(event.currentTarget);
  };
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { t } = useTranslation();
  const { setSnackbarStateValue, alertFaultAdded, alertSuccessAdded, alertSuccessDelete, alertFaultDelete } =
    useSnackBar();
  const [selectProduct, setSelectProduct] = useState<any>();
  const [setAllProducts, setSetAllProducts] = useState<any>([]);

  const { navigate } = useGomakeRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSelectProduct(item);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectProduct(null);
  };
  const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
  const onClickCloseDeleteRowModal = () => {
    setOpenDeleteRowModal(false);
    handleClose();

  };
  const onClickOpenDeleteRowModal = () => {
    setOpenDeleteRowModal(true);
    handleClose();

  };

  const updatedProductInside = useCallback(async (product: any) => {
    const res: any = await updatedProduct(product);
    if (res) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, []);
  const createSubProduct = useCallback(async (item) => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/products/create-sub-product`,
      {
        productId: item?.id,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      handleClose();
      navigate(`/settings/products/edit/${res?.data?.data?.data}`);
    } else {
      alertFaultAdded();
      handleClose();
    }
  }, []);

  const getSubProducts = useCallback(async () => {
    if (selectProduct?.id && !router.query.productId) {
      await getAllSubProducts(callApi, setSetAllProducts, {
        productId: selectProduct?.id,
      });
    }
  }, [selectProduct]);
  useEffect(() => {
    getSubProducts();
  }, [selectProduct]);

  const deleteProductById = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.DELETE,
        `/v1/printhouse-config/products/delete-product-by-id?Id=${item?.id}`
      );
      if (res?.success) {
        handleClose()
        alertSuccessDelete();
        onClickCloseDeleteRowModal()
        getActions()
      } else {
        alertFaultDelete();
      }
    },
    [item]
  );


  return {
    open,
    anchorEl,
    router,
    handleClose,
    handleClick,
    t,
    setSnackbarStateValue,
    navigate,
    callApi,
    updatedProductInside,
    createSubProduct,
    setAllProducts,
    openPopover,
    anchorElPopover,
    idPopover,
    handleClosePopover,
    handleClickPopover,
    openDeleteRowModal,
    onClickCloseDeleteRowModal,
    onClickOpenDeleteRowModal,
    deleteProductById
  };
};

export { useMoreCircle };
