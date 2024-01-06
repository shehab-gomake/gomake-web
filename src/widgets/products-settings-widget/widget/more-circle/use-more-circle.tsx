import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getAllSubProducts } from "@/services/hooks/admin-side/products/get-all-sub-products";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = ({ updatedProduct, item }) => {
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
  const { setSnackbarStateValue, alertFaultAdded, alertSuccessAdded } =
    useSnackBar();
  const [selectProduct, setSelectProduct] = useState<any>();
  const [setAllProducts, setSetAllProducts] = useState<any>([]);

  console.log("setAllProducts", setAllProducts);
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
  };
};

export { useMoreCircle };
