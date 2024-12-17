import { useTranslation } from "react-i18next";
import { GeneralSettingsMenu } from "./components/more-menu/more-menu";
import { useState } from "react";

const useGeneralSettings = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedSetting, setSelectedSetting] = useState<any>();

  const handleOpenModal = (settingName) => {
    setSelectedText(settingName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedText("");
    setOpenModal(false);
  };
  const tableHeaders = [
    t("documentingSettings.name"),
    t("documentingSettings.details"),
    t("documentingSettings.value"),
    t("properties.more"),
  ];

  const columnsWidth = ["20%", "50%", "20%", "10%"];
  const mockData = [
    [
      "test 1",
      "Hello world!",
      10,
      <GeneralSettingsMenu name="test1" onClickEdit={handleOpenModal} />,
    ],
    [
      "test 2",
      "nooo ",
      20,
      <GeneralSettingsMenu name="test2" onClickEdit={handleOpenModal} />,
    ],
  ];

  //get all func..

  //edit func

  return {
    tableHeaders,
    columnsWidth,
    mockData,
    handleCloseModal,
    openModal,
    selectedText,
    selectedSetting,
  };
};

export { useGeneralSettings };
