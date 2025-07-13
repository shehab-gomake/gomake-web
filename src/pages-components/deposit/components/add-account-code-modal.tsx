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
    code: "",
    name: "",
    bankName: "",
    branchNumber: "",
    bankAccountNumber: "",
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
            <Stack direction={"row"} gap={"5px"} width={"100%"}>
              <GomakeTextInput
                placeholder={t("products.addProduct.admin.enterName")}
                value={accountState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <span style={classes.required}>*</span>
            </Stack>
            <Stack direction={"row"} gap={"5px"} width={"100%"}>
              <GomakeTextInput
                placeholder={t("products.addProduct.admin.enterCode")}
                onChange={(e) => handleInputChange("code", e.target.value)}
                value={accountState.code}
              />
              <span style={classes.required}>*</span>
            </Stack>
          </div>

          <div style={classes.textInputContainer}>
            <GomakeTextInput
              placeholder={t("deposits.enterBankName")}
              value={accountState.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
            />
            <GomakeTextInput
              placeholder={t("deposits.enterBranchNumber")}
              value={accountState.branchNumber}
              onChange={(e) =>
                handleInputChange("branchNumber", e.target.value)
              }
            />
            <GomakeTextInput
              placeholder={t("deposits.enterBankAccountNumber")}
              value={accountState.bankAccountNumber}
              onChange={(e) =>
                handleInputChange("bankAccountNumber", e.target.value)
              }
            />
          </div>
          <div style={classes.addClientTypeBtnContainer}>
            <PrimaryButton
              disabled={!accountState.code || !accountState.name}
              variant="contained"
              onClick={handleAddAccountCode}
            >
              {t("deposits.addAccount")}
            </PrimaryButton>
          </div>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { AddAccountCodeModal };
