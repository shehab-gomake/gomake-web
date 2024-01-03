import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = ({ updatedProduct }) => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { t } = useTranslation();
  const { setSnackbarStateValue, alertFaultAdded, alertSuccessAdded } =
    useSnackBar();
  const { navigate } = useGomakeRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
  };
};

export { useMoreCircle };
