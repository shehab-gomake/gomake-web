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
  Language,
}

const useGeneralSettings = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedSetting, setSelectedSetting] = useState<any>();
  const [allPreferences, setAllPreferences] = useState<any>();
  const [groups, setGroups] = useState<any[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
        const groupMap = new Map();
        _data.forEach((item: any) => {
          const tabKey = item?.tabKey;
          const groupName = tabKey || "Others";

          if (!groupMap.has(groupName)) {
            groupMap.set(groupName, {
              id: tabKey || "Others",
              name: t(`preferences.groups.${groupName}`),
            });
          }
        });

        let generatedGroups = Array.from(groupMap.values());
        // Move "Others" to the last position
        const othersIndex = generatedGroups.findIndex((g) => g.id === "others");
        if (othersIndex !== -1) {
          const [others] = generatedGroups.splice(othersIndex, 1);
          generatedGroups.push(others); // push to end
        }
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
            // t(`preferences.${EPreferences[item?.code]}`),
            t(`preferences.${item?.name}`),
            t(`preferences.${item?.description.trim()}`),
            item?.preferenceType === PreferenceValueType.Select
              ? t(`preferences.${displayValue}`)
              : displayValue,
            <GeneralSettingsMenu
              preferenceItem={item}
              onClickEdit={handleOpenModal}
            />,
          ];
        });
        setAllPreferences(mapData);
        setGroups(generatedGroups);
      }
    };
    await getAllPreferencesApi(callApi, callBack);
  };

  const updatePreferences = async (updatedPreference: {
    updatedValue: any;
    preferenceId: string;
    secondaryValue?: any;
  }) => {
    const { updatedValue, preferenceId, secondaryValue } = updatedPreference;
    const callBack = (res: { success: boolean }) => {
      if (res?.success) {
        // getAllPreferences(); //old
        setAllPreferences((prevPreferences) =>
          prevPreferences.map((row) => {
            const [name, description, , menu] = row;
            const item = menu.props.preferenceItem;

            if (item.preferenceId === preferenceId) {
              let displayValue = updatedValue;

              if (item.preferenceType === PreferenceValueType.Boolean) {
                const booleanOptions = [
                  { label: t("modal.yes"), value: "true" },
                  { label: t("modal.no"), value: "false" },
                ];
                displayValue =
                  booleanOptions.find((opt) => opt.value === updatedValue)
                    ?.label || updatedValue;
              } else if (item.preferenceType === PreferenceValueType.Select) {
                displayValue =
                  item.preferenceValues?.find((opt) => opt.id === updatedValue)
                    ?.value || updatedValue;
              }

              return [
                name,
                description,
                item?.preferenceType === PreferenceValueType.Select
                  ? t(`preferences.${displayValue}`)
                  : displayValue,
                <GeneralSettingsMenu
                  preferenceItem={{
                    ...item,
                    value: updatedValue,
                    ...(secondaryValue !== undefined && {
                      secondaryValue: secondaryValue,
                    }),
                  }}
                  onClickEdit={handleOpenModal}
                />,
              ];
            }
            return row;
          })
        );
      }
    };

    try {
      await updatePreferencesApi(callApi, callBack, updatedPreference);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
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
    activeTabIndex,
    setActiveTabIndex,
    groups,
  };
};

export { useGeneralSettings };
