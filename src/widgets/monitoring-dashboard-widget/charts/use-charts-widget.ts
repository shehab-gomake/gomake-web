import { useState } from "react";
import { useTranslation } from "react-i18next";

const useChartsWidget = () => {
  const { t } = useTranslation();
  const [anchorElSetting, setAnchorElSetting] = useState<null | HTMLElement>(
    null
  );
  const openSetting = Boolean(anchorElSetting);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSetting(event.currentTarget);
  };

  const handleCloseSetting = () => {
    setAnchorElSetting(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [modalType, setModalType] = useState<"actual" | "target" | null>(null);

  const openModal = (type: "actual" | "target") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setModalType(null);
  };

  return {
    t,
    anchorElSetting,
    openSetting,
    handleOpen,
    handleCloseSetting,
    isModalOpen,
    inputValue,
    setInputValue,
    modalType,
    openModal,
    closeModal,
  };
};

export { useChartsWidget };
