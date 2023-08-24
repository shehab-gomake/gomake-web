import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = ({ updatedProduct }) => {
  const { callApi } = useGomakeAxios();

  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
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

  return {
    open,
    anchorEl,
    handleClose,
    handleClick,
    t,
    setSnackbarStateValue,
    navigate,
    callApi,
    updatedProductInside,
  };
};

export { useMoreCircle };
