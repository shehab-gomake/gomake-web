import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RemoveSecondaryBtn } from "@/components/button/remove-secondary-btn";
import {
  IFormArrayInputsProps,
  IInput,
} from "@/components/form-inputs/interfaces";
import { FormInput } from "@/components/form-inputs/form-input";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { AddBankAccountModal } from "./add-bank-account-modal";

const BankAccountsArrayInput = ({
  name,
  inputs,
  updateState,
  parameterKey,
  value,
  isValid,
  newValue,
  disableUpdateValues,
  disabled,
  disableAddValue,
  containerStyle,
}: IFormArrayInputsProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddBankAccount = (data: {
    id: string;
    code: string;
    name: string;
    bankName: string;
    bankBranch: string;
    bankAccountNUM: string;
  }) => {
    // Create bank account object matching the expected structure
    const newBankAccount = {
      id: data.id,
      code: data.code,
      name: data.name,
      bankName: data.bankName || "",
      bankBranch: data.bankBranch || "",
      bankAccountNUM: data.bankAccountNUM || "",
    };

    updateState(parameterKey, [...value, newBankAccount]);

    // Auto scroll to the end after adding new bank account
    setTimeout(() => {
      if (lastItemRef.current) {
        lastItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 300);
  };

  const handleValuesChange = (key: string, newValue: any, index: number) => {
    const values = [...value];
    values[index] = { ...values[index], [key]: newValue };
    updateState(parameterKey, values);
  };

  const handleRemoveRow = (index: number) => {
    const newArray: any[] = [...value];
    newArray.splice(index, 1);
    updateState(parameterKey, newArray);
  };

  return (
    !disabled && (
      <div style={{ ...classes.bankAccountsContainer, ...containerStyle }}>
        {name && (
          <h3 style={{ ...classes.multiInputLabel, margin: "0 0 16px 0" }}>
            {t(name)}
          </h3>
        )}
        {!disableAddValue && (
          <div style={classes.stickyButtonContainer}>
            <SecondaryButton
              variant={"contained"}
              onClick={handleOpenModal}
              style={classes.addButton}
            >
              {t("profileSettings.addNewBankAccount")}
            </SecondaryButton>
          </div>
        )}
        <AddBankAccountModal
          openModal={openModal}
          onClose={handleCloseModal}
          addNewBankAccount={handleAddBankAccount}
        />
        <div
          ref={scrollContainerRef}
          style={classes.scrollableTransitionGroup}
          className="custom-scrollbar"
        >
          <TransitionGroup>
            {value?.map((v: Record<string, string>, index: number) => {
              const isLastItem = index === value.length - 1;
              return (
                <Collapse key={index}>
                  <div
                    ref={isLastItem ? lastItemRef : null}
                    style={classes.bankAccountItemContainer}
                  >
                    <div
                      key={"row" + index}
                      style={classes.bankAccountInputsRow}
                    >
                      {inputs.map((input) => {
                        let computedValue = "";
                        if (input.isCombinedField && input.combinedFields) {
                          // Combine values from multiple fields (e.g., "code - name")
                          const combinedValues = input.combinedFields
                            .map((field: string) => v[field] || "")
                            .filter((val: string) => val)
                            .join(" - ");
                          computedValue = combinedValues;
                        } else {
                          computedValue = input.secondValue
                            ? v[input.secondValue]
                            : v[input.parameterKey];
                        }

                        return (
                          <FormInput
                            key={`${input.parameterKey}-${index}`}
                            readonly={disableUpdateValues || input.readonly}
                            input={{
                              ...input,
                              value: computedValue,
                              disabled: false,
                              type:
                                disableUpdateValues || input.readonly
                                  ? "text"
                                  : input.type,
                            }}
                            error={false}
                            changeState={(key, value) => {
                              handleValuesChange(key, value, index);
                            }}
                          />
                        );
                      })}
                      <RemoveSecondaryBtn
                        onClick={() => handleRemoveRow(index)}
                      />
                    </div>
                  </div>
                </Collapse>
              );
            })}
          </TransitionGroup>
        </div>
      </div>
    )
  );
};

export { BankAccountsArrayInput };
