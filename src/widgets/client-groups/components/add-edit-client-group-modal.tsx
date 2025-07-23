import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "../style";
import { useClientGroup } from "./use-client-group-modal";
import { Stack } from "@mui/material";

interface ClientTypeModalProps {
  openModal: boolean;
  onClose: () => void;
  modalTitle: string;
  selectedClientGroupId?: string;
  actionType: "add" | "edit";
}

const ClientGroupModal = ({
  openModal,
  onClose,
  modalTitle,
  selectedClientGroupId,
  actionType,
}: ClientTypeModalProps) => {
  const {
    editedValues,
    handleInputChange,
    selectedItem,
    addClientGroup,
    updateClientGroup,
  } = useClientGroup(selectedClientGroupId);

  const { t } = useTranslation();
  const { classes } = useStyle();
  const isAddMode = actionType === "add";

  if (!isAddMode && !selectedItem) return null;

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
        <Stack direction={"column"} style={classes.textInputContainer}>
          <span style={classes.inputLbl}>{t("messenger.groupName")}</span>
          <GomakeTextInput
            style={classes.textInputStyle}
            placeholder={t("products.addProduct.admin.enterName")}
            value={editedValues?.groupName ?? selectedItem?.groupName}
            onChange={(e) => handleInputChange("groupName", e.target.value)}
          />
        </Stack>
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
              addClientGroup(editedValues?.groupName);
            } else {
              updateClientGroup();
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

export { ClientGroupModal };
