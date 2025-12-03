import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "../style";
import { Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PreferenceValueType } from "../../use-general-settings";
import { useRecoilValue } from "recoil";
import { languageOptionsState } from "@/store/languages";

interface IEditModalProps {
  openModal: boolean;
  onClose: () => void;
  selectedSetting: any;
  onUpdate: (updatedSetting: any) => void;
}
const EditModal = ({
  openModal,
  onClose,
  selectedSetting,
  onUpdate,
}: IEditModalProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const languages = useRecoilValue(languageOptionsState);
  const initialState = {
    name: selectedSetting?.name || "",
    value: selectedSetting?.value || "",
    description: selectedSetting?.description || "",
    secondaryValue: selectedSetting?.secondaryValue || "",
  };

  const [state, setState] = useState(initialState);

  const preferenceOptions =
    selectedSetting?.preferenceValues?.map(
      (item: { id: string | number; value: string; isOpenSecondaryValue?: boolean }) => ({
        label: t(`preferences.${item?.value}`),
        value: item.id,
        isOpenSecondaryValue: item.isOpenSecondaryValue || false,
      })
    ) || [];

  const booleanOptions = [
    { label: t("modal.yes"), value: "true" },
    { label: t("modal.no"), value: "false" },
  ];

  const handleChange = (field: string, value: string | number) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    const updatedSetting: any = {
      updatedValue: state?.value,
      preferenceId: selectedSetting?.preferenceId,
    };

    // Include secondary value if it exists and the selected option requires it
    const selectedOption = preferenceOptions.find(
      (opt) => opt.value === state.value
    );
    if (
      selectedOption?.isOpenSecondaryValue &&
      state?.secondaryValue !== undefined &&
      state?.secondaryValue !== null &&
      state?.secondaryValue !== ""
    ) {
      updatedSetting.secondaryValue = state?.secondaryValue;
    }

    onUpdate(updatedSetting);
    onClose();
  };

  useEffect(() => {
    if (!openModal) {
      setState(initialState);
    } else {
      setState({
        name: selectedSetting?.name || "",
        value: selectedSetting?.value || "",
        description: selectedSetting?.description || "",
        secondaryValue: selectedSetting?.secondaryValue || "",
      });
    }
  }, [openModal, selectedSetting]);

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("preferences.editSetting", {
        preferenceName: t(`preferences.${selectedSetting?.name}`),
      })}
      withRoundedCloseIcon={false}
      modalTitleStyle={classes.modalTitleStyle}
      insideStyle={classes.editModalStyle}
    >
      <Stack gap={"20px"}>
        <Stack direction={"row"} gap={"24px"}>
          <div style={{ width: "50%" }}>
            <h3 style={classes.inputLabelStyle}>
              {t("documentingSettings.name")}
            </h3>
            <GomakeTextInput
              key={`name-${selectedSetting?.preferenceId}`}
              placeholder={t("documentingSettings.name")}
              // value={state?.name}
              value={t(`preferences.${state?.name}`)}
              disabled={true}
            />
          </div>
          <div style={{ width: "50%" }}>
            <h3 style={classes.inputLabelStyle}>
              {t("documentingSettings.value")}
            </h3>
            {selectedSetting?.preferenceType === PreferenceValueType.Number && (
              <GomakeTextInput
                key={`value-number-${selectedSetting?.preferenceId}`}
                placeholder={t("documentingSettings.value")}
                type="number"
                value={state?.value}
                onChange={(e) => handleChange("value", e.target.value)}
              />
            )}
            {selectedSetting?.preferenceType === PreferenceValueType.Select && (
              <GoMakeAutoComplate
                key={`value-select-${selectedSetting?.preferenceId}`}
                withArrow
                style={{ border: 0 }}
                placeholder={t("documentingSettings.value")}
                options={preferenceOptions}
                value={
                  preferenceOptions.find((opt) => opt.value === state.value) ||
                  null
                }
                onChange={(e: any, value: any) => {
                  handleChange("value", value?.value);
                  // Reset secondary value when option changes
                  if (!value?.isOpenSecondaryValue) {
                    handleChange("secondaryValue", "");
                  }
                }}
              />
            )}
            {selectedSetting?.preferenceType ===
              PreferenceValueType.Boolean && (
                <GoMakeAutoComplate
                  key={`value-select-boolean-${selectedSetting?.preferenceId}`}
                  withArrow
                  style={{ border: 0 }}
                  placeholder={t("documentingSettings.value")}
                  options={booleanOptions}
                  value={
                    booleanOptions.find((opt) => opt.value === state.value) ||
                    null
                  }
                  onChange={(e: any, value: any) => {
                    handleChange("value", value?.value);
                  }}
                />
              )}
          </div>
        </Stack>
        {selectedSetting?.preferenceType === PreferenceValueType.Select &&
          (() => {
            const selectedOption = preferenceOptions.find(
              (opt) => opt.value === state.value
            );
            const showSecondaryValue =
              selectedOption?.isOpenSecondaryValue === true &&
              selectedSetting?.secondaryValuePreferenceType !== undefined &&
              selectedSetting?.secondaryValuePreferenceType !== null;

            if (!showSecondaryValue) return null;

            return (
              <div>
                <h3 style={classes.inputLabelStyle}>
                  {t("documentingSettings.secondaryValue")}
                </h3>
                {selectedSetting?.secondaryValuePreferenceType ===
                  PreferenceValueType.Number && (
                    <GomakeTextInput
                      key={`secondary-value-number-${selectedSetting?.preferenceId}`}
                      placeholder={t("documentingSettings.secondaryValue")}
                      type="number"
                      value={state?.secondaryValue}
                      onChange={(e) =>
                        handleChange("secondaryValue", e.target.value)
                      }
                    />
                  )}
                {selectedSetting?.secondaryValuePreferenceType ===
                  PreferenceValueType.Select && (
                    <GoMakeAutoComplate
                      key={`secondary-value-select-${selectedSetting?.preferenceId}`}
                      withArrow
                      style={{ border: 0 }}
                      placeholder={t("documentingSettings.secondaryValue")}
                      options={
                        selectedSetting?.secondaryPreferenceValues?.map(
                          (item: { id: string | number; value: string }) => ({
                            label: t(`preferences.${item?.value}`),
                            value: item.id,
                          })
                        ) || []
                      }
                      value={
                        selectedSetting?.secondaryPreferenceValues?.find(
                          (opt: { id: string | number }) =>
                            opt.id === state.secondaryValue
                        )
                          ? {
                            label: t(
                              `preferences.${selectedSetting?.secondaryPreferenceValues?.find(
                                (opt: { id: string | number }) =>
                                  opt.id === state.secondaryValue
                              )?.value || ""
                              }`
                            ),
                            value: state.secondaryValue,
                          }
                          : null
                      }
                      onChange={(e: any, value: any) => {
                        handleChange("secondaryValue", value?.value || "");
                      }}
                    />
                  )}
                {selectedSetting?.secondaryValuePreferenceType ===
                  PreferenceValueType.Boolean && (
                    <GoMakeAutoComplate
                      key={`secondary-value-boolean-${selectedSetting?.preferenceId}`}
                      withArrow
                      style={{ border: 0 }}
                      placeholder={t("documentingSettings.secondaryValue")}
                      options={booleanOptions}
                      value={
                        booleanOptions.find(
                          (opt) => opt.value === state.secondaryValue
                        ) || null
                      }
                      onChange={(e: any, value: any) => {
                        handleChange("secondaryValue", value?.value);
                      }}
                    />
                  )}
                {selectedSetting?.secondaryValuePreferenceType ===
                  PreferenceValueType.Language && (
                    <GoMakeAutoComplate
                      key={`secondary-value-language-${selectedSetting?.preferenceId}`}
                      withArrow
                      style={{ border: 0 }}
                      placeholder={t("documentingSettings.secondaryValue")}
                      options={languages.map((lang) => ({
                        label: lang.text,
                        value: lang.value,
                      }))}
                      value={
                        languages.find(
                          (lang) => lang.value === state.secondaryValue
                        )
                          ? {
                            label: languages.find(
                              (lang) => lang.value === state.secondaryValue
                            )?.text || "",
                            value: state.secondaryValue,
                          }
                          : null
                      }
                      onChange={(e: any, value: any) => {
                        handleChange("secondaryValue", value?.value || "");
                      }}
                    />
                  )}
              </div>
            );
          })()}
        <div>
          <h3 style={classes.inputLabelStyle}>
            {t("usersSettings.description")}
          </h3>
          <GomakeTextInput
            key={`description-${selectedSetting?.preferenceId}`}
            placeholder={t("preferences.enterDescription")}
            multiline
            style={classes.descriptionStyle}
            // value={state?.description}
            value={t(`preferences.${state?.description.trim()}`)}
            disabled={true}
          />
        </div>
        <PrimaryButton variant="contained" onClick={handleUpdate}>
          {t("usersSettings.update")}
        </PrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};
export { EditModal };
