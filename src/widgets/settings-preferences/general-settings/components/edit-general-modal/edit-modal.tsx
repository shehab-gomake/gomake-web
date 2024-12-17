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

interface IEditModalProps {
  openModal: boolean;
  onClose: () => void;
  selectedText: string;
  selectedSetting: any;
  inputType: "text" | "number" | "select";
  selectOptions?: { label: string; value: string | number }[];
  onUpdate: (updatedSetting: any) => void;
}
const EditModal = ({
  openModal,
  onClose,
  selectedText,
  selectedSetting,
  inputType,
  selectOptions = [],
  onUpdate,
}: IEditModalProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const initialState = {
    name: selectedText,
    value: selectedSetting?.value || "",
    description: selectedSetting?.description || "",
  };
  const [state, setState] = useState(initialState);

  const handleChange = (field: string, value: string | number) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    const updatedSetting = { ...selectedSetting, ...state };
    onUpdate(updatedSetting);
    onClose();
  };

  useEffect(() => {
    if (!openModal) {
      setState(initialState);
    }
  }, [openModal, selectedText, selectedSetting]);

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={`Edit setting - ${selectedText}`}
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
              placeholder={t("documentingSettings.enterName")}
              value={state.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div style={{ width: "50%" }}>
            <h3 style={classes.inputLabelStyle}>
              {t("documentingSettings.value")}
            </h3>
            {inputType === "text" && (
              <GomakeTextInput
                placeholder={t("documentingSettings.enterText")}
                value={state.value}
                onChange={(e) => handleChange("value", e.target.value)}
              />
            )}
            {inputType === "number" && (
              <GomakeTextInput
                placeholder={t("documentingSettings.enterNumber")}
                type="number"
                value={state.value}
                onChange={(e) => handleChange("value", e.target.value)}
              />
            )}
            {inputType === "select" && (
              <GoMakeAutoComplate
                withArrow
                style={{ border: 0 }}
                placeholder={t("documentingSettings.selectOption")}
                options={selectOptions}
                value={state.value}
                onChange={(selected) =>
                  handleChange("value", selected?.value || "")
                }
              />
            )}
          </div>
        </Stack>

        <div>
          <h3 style={classes.inputLabelStyle}>{t("reports.description")}</h3>
          <GomakeTextInput
            placeholder={t("documentingSettings.enterDescription")}
            multiline
            style={classes.descriptionStyle}
            value={state.description}
            onChange={(e) => handleChange("description", e.target.value)}
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
