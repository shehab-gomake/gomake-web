import { useRecoilState, useRecoilValue } from "recoil";
import {
  depositState,
  newDepositState,
} from "@/pages-components/deposits/components/states";
import { Stack } from "@mui/material";
import { DepositInputs, newDepositInputs } from "./deposit-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { DEPOSIT_ACTIONS } from "../enums";
import { PlusIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "../style";
import { AddAccountCodeModal } from "./add-account-code-modal";
import { useState } from "react";

interface IFiltersSection {
  actionType: DEPOSIT_ACTIONS;
  accountsOptions?: any;
  depositAccountsOptions?: any;
  addNewAccountCode: (data) => void;
}

const DepositFilterSection = ({
  actionType,
  accountsOptions,
  depositAccountsOptions,
  addNewAccountCode,
}: IFiltersSection) => {
  const deposit = useRecoilValue<any>(depositState);
  const { t } = useTranslation();
  const { classes } = useStyle();

  const [newDeposit, setNewDeposit] = useRecoilState<any>(newDepositState);

  const onChangeDepositInputs = (key: string, value: any) => {
    setNewDeposit((prev) => {
      if (key === "depositAccount") {
        const selectedAccount = depositAccountsOptions?.find(
          (account) => account.id === value?.id
        );

        if (selectedAccount) {
          return {
            ...prev,
            depositAccount: {
              ...value,
              code: selectedAccount?.code,
            },
            bankName: selectedAccount?.bankName || "",
            bankBranch: selectedAccount?.bankBranch || "",
            bankAccountNUM: selectedAccount?.bankAccountNUM || "",
          };
        }
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const [openAccountCode, setOpenAccountCode] = useState(false);
  const onClickOpenAccountCode = () => {
    setOpenAccountCode(true);
  };
  const onClickCloseAccountCode = () => {
    setOpenAccountCode(false);
  };

  return (
    <Stack direction="column" gap="20px">
      <Stack direction="row" gap="10px">
        {(actionType === DEPOSIT_ACTIONS.Create
          ? newDepositInputs(
              newDeposit,
              accountsOptions,
              depositAccountsOptions
            ).slice(0, 1)
          : DepositInputs(deposit).slice(0, 2)
        ).map((item) => (
          <FormInput
            input={item as IInput}
            changeState={onChangeDepositInputs}
            error={false}
            key={item.name}
            readonly={actionType === DEPOSIT_ACTIONS.Show}
          />
        ))}

        {actionType === DEPOSIT_ACTIONS.Create && (
          <div style={classes.inputContainer}>
            <div style={classes.inputLbl}>
              <span>{t("deposits.accountCode")}</span>
              <span
                style={{ cursor: "pointer" }}
                onClick={onClickOpenAccountCode}
              >
                <PlusIcon />
              </span>
            </div>
            <div style={classes.inputs}>
              <GoMakeAutoComplate
                disableClearable={true}
                style={{
                  width: 180,
                  border: 0,
                  height: 40,
                  overflow: "scroll",
                }}
                options={depositAccountsOptions?.map((depAccount) => ({
                  label: `${depAccount.name} - ${depAccount.code}`,
                  id: depAccount.id,
                }))}
                value={newDeposit?.depositAccount}
                onChange={(e: any, value: any) =>
                  onChangeDepositInputs("depositAccount", value)
                }
                placeholder={t("deposits.accountCode")}
              />
            </div>
          </div>
        )}
      </Stack>

      <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
        {(actionType === DEPOSIT_ACTIONS.Create
          ? newDepositInputs(
              newDeposit,
              accountsOptions,
              depositAccountsOptions
            )
          : DepositInputs(deposit)
        )
          .slice(2, 9)
          .map((item) => (
            <FormInput
              input={item as IInput}
              changeState={onChangeDepositInputs}
              error={false}
              key={item.name}
              readonly={!!item.readOnly}
            />
          ))}
      </Stack>
      <AddAccountCodeModal
        openModal={openAccountCode}
        onClose={onClickCloseAccountCode}
        addNewAccountCode={addNewAccountCode}
      />
    </Stack>
  );
};
export { DepositFilterSection };
