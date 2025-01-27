import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "../style";
import { PrimaryButton } from "@/components/button/primary-button";
import { Stack } from "@mui/material";
import { useState } from "react";
import { useSnackBar } from "@/hooks";

interface AddAccountCodeModalProps {
  openModal: boolean;
  onClose: () => void;
  addNewAccountCode: (data) => void;
}
const AddAccountCodeModal = ({
  openModal,
  onClose,
  addNewAccountCode,
}: AddAccountCodeModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { alertRequiredFields } = useSnackBar();
  const [accountState, setAccountState] = useState({
    id: "",
    code: "",
    name: "",
    isDefault: false,
    balance: null,
    openBalance: null,
    isDepositAccount: null,
    bankName: "",
    branchNumber: "",
    bankAccountNumber: "",
    type: null,
  });

  const handleInputChange = (
    field: keyof typeof accountState,
    value: string
  ) => {
    setAccountState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddAccountCode = async () => {
    const { name, code } = accountState;

    if (!name.trim() || !code.trim()) {
      alertRequiredFields();
      return;
    }

    await addNewAccountCode(accountState);
    onClose();
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={"Account code"}
        onClose={onClose}
        insideStyle={classes.insideStyle}
        withRoundedCloseIcon={false}
      >
        <Stack gap={"20px"}>
          <div style={classes.textInputContainer}>
            <GomakeTextInput
              placeholder={t("products.addProduct.admin.enterName")}
              value={accountState.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <GomakeTextInput
              placeholder={t("products.addProduct.admin.enterCode")}
              onChange={(e) => handleInputChange("code", e.target.value)}
              value={accountState.code}
            />
          </div>
          <div style={classes.addClientTypeBtnContainer}>
            <PrimaryButton variant="contained" onClick={handleAddAccountCode}>
              {t("deposits.addAccount")}
            </PrimaryButton>
          </div>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { AddAccountCodeModal };
