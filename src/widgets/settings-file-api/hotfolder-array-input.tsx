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
import { GomakePrimaryButton } from "@/components";
import { EFileDeliveryMode } from "./enums";

const HotfolderArrayInput = ({
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

  const addParameter = () => {
    // Add empty section without validation
    const emptyState = {
      hotFolderName: "",
      remoteName: "",
      fileType: [],
      fileDeliveryMode: "",
      folderPath: "",
      fileInternalStructure: "",
      username: "",
      password: "",
    };

    updateState(parameterKey, [...value, emptyState]);

    // Auto scroll to the end after adding new hotfolder
    setTimeout(() => {
      if (lastItemRef.current) {
        // Scroll the last item into view
        lastItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 300); // Increased delay to ensure the new item is fully rendered
  };

  const handleValuesChange = (key: string, newValue: any, index: number) => {
    const values = [...value];
    values[index] = { ...values[index], [key]: newValue };
    updateState(parameterKey, values);
  };

  const handleRemoveRow = (index: number) => {
    const newArray: any[] = [...value];

    // Don't allow removing the last hotfolder if it's the only one
    if (newArray.length === 1) {
      return;
    }

    newArray.splice(index, 1);
    updateState(parameterKey, newArray);
  };

  return (
    !disabled && (
      <div style={{ ...classes.container, ...containerStyle }}>
        {name && (
          <h3 style={{ ...classes.multiInputLabel, margin: "0 0 16px 0" }}>
            {t(name)}
          </h3>
        )}
        {!disableAddValue && (
          <div style={classes.stickyButtonContainer}>
            <GomakePrimaryButton
              variant={"contained"}
              onClick={addParameter}
              style={classes.button}
            >
              {t("fileApiSettings.addNewHotfolder")}
            </GomakePrimaryButton>
          </div>
        )}
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
                    style={classes.hotfolderItemContainer}
                  >
                    <h4 style={classes.hotfolderLabel}>
                      {t("fileApiSettings.hotfolder")} {index + 1}:
                    </h4>
                    <div key={"row" + index} style={classes.hotfolderInputsRow}>
                      {inputs.map((input) => (
                        <FormInput
                          key={index}
                          readonly={disableUpdateValues}
                          input={{
                            ...input,
                            value: input.secondValue
                              ? v[input.secondValue]
                              : v[input.parameterKey],
                            disabled: false,
                            type: disableUpdateValues ? "text" : input.type,
                          }}
                          error={false}
                          changeState={(key, value) => {
                            handleValuesChange(key, value, index);
                          }}
                        />
                      ))}
                      {value.length > 1 && (
                        <RemoveSecondaryBtn
                          onClick={() => handleRemoveRow(index)}
                        />
                      )}
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

export { HotfolderArrayInput };
