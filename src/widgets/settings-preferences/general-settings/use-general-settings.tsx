import { useTranslation } from "react-i18next";
import { GeneralSettingsMenu } from "./components/more-menu/more-menu";
import { useState } from "react";
import {
  getAllPreferencesApi,
  updatePreferencesApi,
} from "@/services/api-service/preferences/preferences-endpoint";
import { useGomakeAxios } from "@/hooks";

export enum PreferenceValueType {
  Number = 0,
  Select,
  Boolean,
}

const useGeneralSettings = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedSetting, setSelectedSetting] = useState<any>();
  const [allPreferences, setAllPreferences] = useState<any>();

  const handleOpenModal = (settingItem) => {
    setSelectedSetting(settingItem);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSetting(null);
    setOpenModal(false);
  };
  const tableHeaders = [
    t("documentingSettings.name"),
    t("documentingSettings.details"),
    t("documentingSettings.value"),
    t("properties.more"),
  ];

  const columnsWidth = ["20%", "50%", "20%", "10%"];

  const getAllPreferences = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const _data = res?.data;
        const mapData = _data?.map((item: any) => {
          let displayValue = "";

          if (item?.preferenceType === PreferenceValueType.Number) {
            displayValue = item?.value;
          }

          // Case 2: Boolean
          else if (item?.preferenceType === PreferenceValueType.Boolean) {
            const booleanOptions = [
              { label: t("modal.yes"), value: "true" },
              { label: t("modal.no"), value: "false" },
            ];
            displayValue =
              booleanOptions.find((opt) => opt.value === item?.value)?.label ||
              item?.value;
          }

          // Case 3: Select
          else if (item?.preferenceType === PreferenceValueType.Select) {
            displayValue =
              item?.preferenceValues?.find((opt) => opt.id === item?.value)
                ?.value || item?.value;
          }
          return [
            item?.name,
            item?.description,
            displayValue,
            <GeneralSettingsMenu
              preferenceItem={item}
              onClickEdit={handleOpenModal}
            />,
          ];
        });
        setAllPreferences(mapData);
      }
    };
    await getAllPreferencesApi(callApi, callBack);
  };

  const updatePreferences = async (updatedPreference) => {
    const callBack = (res) => {
      if (res?.success) {
      }
    };
    await updatePreferencesApi(callApi, callBack, updatedPreference);
  };

  return {
    tableHeaders,
    columnsWidth,
    handleCloseModal,
    openModal,
    selectedSetting,
    getAllPreferences,
    allPreferences,
    updatePreferences,
  };
};

export { useGeneralSettings };
