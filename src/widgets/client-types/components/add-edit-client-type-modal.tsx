import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { useStyle } from "../style";
import { useClientType } from "./use-client-type-modal";
import { Stack } from "@mui/material";

interface ClientTypeModalProps {
  openModal: boolean;
  onClose: () => void;
  modalTitle: string;
  cardTypeId: any;
  selectedClientTypeId?: string;
  actionType: "add" | "edit";
}

const ClientTypeModal = ({
  openModal,
  onClose,
  modalTitle,
  cardTypeId,
  selectedClientTypeId,
  actionType,
}: ClientTypeModalProps) => {
  const {
    editedValues,
    handleInputChange,
    updateClientType,
    selectedItem,
    addClientType,
  } = useClientType(cardTypeId, selectedClientTypeId);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const isAddMode = actionType === "add";

  if (!isAddMode && !selectedItem) return null;

  const renderInputField = (
    label: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <Stack direction={"column"} style={classes.textInputContainer}>
      <span style={classes.inputLbl}>{label}</span>
      <GomakeTextInput
        style={classes.textInputStyle}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Stack>
  );

  const renderPercentageInput = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <Stack direction={"column"} style={classes.textInputContainer}>
      <span style={classes.inputLbl}>{label}</span>
      <div style={classes.divWithPer}>
        <GomakeTextInput
          style={{ ...classes.textInputStyle, width: 100 }}
          value={value}
          type="number"
          onChange={onChange}
        />
        %
      </div>
    </Stack>
  );

  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void
  ) => (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={"8px"}
      style={classes.textInputContainer}
    >
      <PrimaryCheckbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span style={classes.inputLbl}>{label}</span>
    </Stack>
  );

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={modalTitle}
      onClose={onClose}
      insideStyle={classes.insideStyle}
      withRoundedCloseIcon={false}
      modalTitleStyle={classes.modalTitle}
    >
      <div style={classes.optionStyle}>
        {renderInputField(
          t("customers.name"),
          t("products.addProduct.admin.enterName"),
          editedValues?.clientTypeName ?? selectedItem.label,
          (e) => handleInputChange("clientTypeName", e.target.value)
        )}
        {renderPercentageInput(
          t("customers.modal.additionProfits"),
          editedValues?.additionProfits ?? selectedItem.additionProfits,
          (e) => handleInputChange("additionProfits", e.target.value)
        )}
        {renderPercentageInput(
          t("sales.quote.discount"),
          editedValues?.discount ?? selectedItem.discount,
          (e) => handleInputChange("discount", e.target.value)
        )}
        {renderCheckbox(
          t("customers.modal.excludeOutsourceJobs"),
          editedValues?.excludeOutsourceJobs ??
            selectedItem?.excludeOutsourceJobs ??
            false,
          (checked) => handleInputChange("excludeOutsourceJobs", checked)
        )}
      </div>
      <Stack
        direction={"row"}
        gap={"10px"}
        alignSelf={"flex-end"}
        width={"100%"}
      >
        <PrimaryButton
          variant="contained"
          sx={classes.cancelBtnStyle}
          onClick={onClose}
        >
          {t("modal.cancel")}
        </PrimaryButton>

        <PrimaryButton
          variant="contained"
          sx={classes.btnStyle}
          onClick={() => {
            if (isAddMode) {
              addClientType(
                editedValues?.clientTypeName,
                editedValues?.additionProfits,
                editedValues?.discount,
                editedValues?.excludeOutsourceJobs
              );
            } else {
              updateClientType();
            }
            onClose();
          }}
        >
          {isAddMode ? t("sales.quote.add") : t("modal.update")}
        </PrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { ClientTypeModal };
