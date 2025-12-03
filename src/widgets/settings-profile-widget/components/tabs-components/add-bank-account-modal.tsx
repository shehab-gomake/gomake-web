import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";
import { Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useSnackBar } from "@/hooks";
import { useGomakeAxios } from "@/hooks";
import { createAccountCodeApi } from "@/services/api-service/generic-doc/deposits-api";

interface AddBankAccountModalProps {
  openModal: boolean;
  onClose: () => void;
  addNewBankAccount: (data: {
    id: string;
    code: string;
    name: string;
    bankName: string;
    bankBranch: string;
    bankAccountNUM: string;
  }) => void;
}

const AddBankAccountModal = ({
  openModal,
  onClose,
  addNewBankAccount,
}: AddBankAccountModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { alertRequiredFields, alertSuccessUpdate, alertFaultUpdate } =
    useSnackBar();
  const { callApi } = useGomakeAxios();
  const [accountState, setAccountState] = useState({
    code: "",
    name: "",
    bankName: "",
    bankBranch: "",
    bankAccountNUM: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!openModal) {
      setAccountState({
        code: "",
        name: "",
        bankName: "",
        bankBranch: "",
        bankAccountNUM: "",
      });
    }
  }, [openModal]);

  const handleInputChange = (
    field: keyof typeof accountState,
    value: string
  ) => {
    setAccountState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddBankAccount = async () => {
    const { name, code } = accountState;

    if (!name.trim() || !code.trim()) {
      alertRequiredFields();
      return;
    }

    setIsLoading(true);

    // Prepare data for API (mapping our field names to API expected names)
    const apiData = {
      code: accountState.code,
      name: accountState.name,
      bankName: accountState.bankName || "",
      branchNumber: accountState.bankBranch || "",
      bankAccountNumber: accountState.bankAccountNUM || "",
    };

    const callBack = (res: any) => {
      setIsLoading(false);
      if (res?.success) {
        // Map API response to our bank account structure
        const newBankAccount = {
          id: res?.data?.id,
          code: res?.data?.code || accountState.code,
          name: res?.data?.name || accountState.name,
          bankName: res?.data?.bankName || accountState.bankName || "",
          bankBranch: res?.data?.branchNumber || accountState.bankBranch || "",
          bankAccountNUM:
            res?.data?.bankAccountNumber || accountState.bankAccountNUM || "",
        };

        addNewBankAccount(newBankAccount);
        alertSuccessUpdate();
        onClose();
      } else {
        alertFaultUpdate();
      }
    };

    await createAccountCodeApi(callApi, callBack, apiData);
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("profileSettings.accountCode")}
        onClose={onClose}
        insideStyle={classes.modalInsideStyle}
        withRoundedCloseIcon={false}
      >
        <Stack gap={"20px"}>
          <div style={classes.modalTextInputContainer}>
            <Stack direction={"row"} gap={"5px"} width={"100%"}>
              <GomakeTextInput
                placeholder={t("profileSettings.accountName")}
                value={accountState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <span style={classes.required}>*</span>
            </Stack>
            <Stack direction={"row"} gap={"5px"} width={"100%"}>
              <GomakeTextInput
                placeholder={t("profileSettings.accountCode")}
                onChange={(e) => handleInputChange("code", e.target.value)}
                value={accountState.code}
              />
              <span style={classes.required}>*</span>
            </Stack>
          </div>

          <div style={classes.modalTextInputContainer}>
            <GomakeTextInput
              placeholder={t("profileSettings.bankName")}
              value={accountState.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
            />
            <GomakeTextInput
              placeholder={t("profileSettings.bankBranch")}
              value={accountState.bankBranch}
              onChange={(e) => handleInputChange("bankBranch", e.target.value)}
            />
            <GomakeTextInput
              placeholder={t("profileSettings.bankAccountNUM")}
              value={accountState.bankAccountNUM}
              onChange={(e) =>
                handleInputChange("bankAccountNUM", e.target.value)
              }
            />
          </div>
          <div style={classes.modalAddButtonContainer}>
            <PrimaryButton
              disabled={!accountState.code || !accountState.name || isLoading}
              variant="contained"
              onClick={handleAddBankAccount}
            >
              {isLoading
                ? "Loading..."
                : t("profileSettings.addNewBankAccount")}
            </PrimaryButton>
          </div>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { AddBankAccountModal };
