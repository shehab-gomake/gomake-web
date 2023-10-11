import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const useMoreCircle = () => {
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

  return {
    open,
    anchorEl,
    handleClose,
    handleClick,
    t,
    setSnackbarStateValue,
    navigate,
    callApi,
  };
};

export { useMoreCircle };
