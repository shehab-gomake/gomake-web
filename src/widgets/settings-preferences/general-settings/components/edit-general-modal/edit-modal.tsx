import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "../style";
import { Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PreferenceValueType } from "../../use-general-settings";

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

  const initialState = {
    name: selectedSetting?.name || "",
    value: selectedSetting?.value || "",
    description: selectedSetting?.description || "",
  };

  const [state, setState] = useState(initialState);

  const preferenceOptions =
    selectedSetting?.preferenceValues?.map(
      (item: { id: string | number; value: string }) => ({
        label: t(`preferences.${item?.value}`),
        value: item.id,
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
    const updatedSetting = {
      updatedValue: state?.value,
      preferenceId: selectedSetting?.preferenceId,
    };
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
