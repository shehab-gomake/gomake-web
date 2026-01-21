import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useProductListMoreCircle = () => {
  const { primaryColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };
  const { t } = useTranslation();
  return {
    open,
    anchorEl,
    openDeleteModal,
    t,
    handleClose,
    handleClick,
    onOpenDeleteModal,
    onCloseDeleteModal,
    primaryColor,
  };
};

export { useProductListMoreCircle };
