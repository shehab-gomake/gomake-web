import React, { SyntheticEvent, useState, useEffect } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "../../state";
import { ModalType } from "@/enums";

interface IProps {
  parameterKey: string;
  id: string;
  values: any[];
  value: string;
  isAdmin: boolean;
}

const SelectInputWithAddValue = ({ values, parameterKey, id, value, isAdmin }: IProps) => {
  const { t } = useTranslation();
  const { updateCellData } = useTableCellData(isAdmin);
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1;
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [localValues, setLocalValues] = useState<any[]>(values || []);

  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };

  // Sync local values when props change
  useEffect(() => {
    setLocalValues(values || []);
  }, [values]);

  const addNewParameterValue = async (newValue: string) => {
    if (isHaveMorethanMaterialSuppliers) {
      // For multiple suppliers, just set the selected value and open modal
      // Don't add to local values yet
      setSelectedValue({
        id: "new_temp",
        label: newValue,
        isNew: true
      });
      onClickOpenDeleteTableRowModal();
    } else {
      // For single supplier, add immediately
      try {
        await updateCellData(id, parameterKey, newValue);
        // The useEffect will sync the new values from props when the backend responds
      } catch (error) {
        console.error("Failed to add new value:", error);
      }
    }
  };

  const baseOptions = localValues
    ?
    localValues.map((inputValue) => ({
      id: inputValue.key,
      label: inputValue.value,
    }))
    : [];

  // Check if input value already exists in the list (case-insensitive, trimmed)
  const valueAlreadyExists = inputValue && baseOptions.some(option =>
    option.label.toLowerCase().trim() === inputValue.toLowerCase().trim()
  );

  // Add "Add new value" option only if user is typing something not in the list
  const options = inputValue && !valueAlreadyExists && inputValue.trim() !== ""
    ? [
      {
        id: "new",
        label: `${t("materials.addNew", "Add")} "${inputValue}"`,
      },
      ...baseOptions,
    ]
    : baseOptions;

  const [selectedValue, setSelectedValue] = useState<any>()

  const onSelectChange = async (event: SyntheticEvent, value) => {
    setSelectedValue(value);

    if (value?.id === "new") {
      // Add new value to the list - send only the inputValue, not the "Add" text
      await addNewParameterValue(inputValue);
      setInputValue("");
    } else {
      if (isHaveMorethanMaterialSuppliers) {
        onClickOpenDeleteTableRowModal();
      } else {
        // Always send the label (actual value), never the id (UUID)
        await updateCellData(id, parameterKey, value?.label);
      }
    }
  };

  return (
    <div
      style={{
        padding: "0px 20px 0px 20px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        width: "100%",
      }}
    >
      <GoMakeAutoComplate
        key={baseOptions.find((x) => x.id == value)?.label || `${parameterKey}_${value}`}
        onChange={onSelectChange}
        onInputChange={(event: any, newInputValue: string) => {
          setInputValue(newInputValue);
        }}
        placeholder={t("materials.selectValue", "Select a value")}
        defaultValue={value ? baseOptions.find((x) => x.id == value) || { id: value, label: value } : null}
        style={{
          border: 0,
          width: 150,
        }}
        options={options}
        getOptionLabel={(option: any) => option?.label || ""}
        isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={async () => {
          // Always send the label (actual value), never the id (UUID key)
          const valueToSend = selectedValue?.label;
          await updateCellData(id, parameterKey, valueToSend);
          setInputValue("");
          onClickCloseDeleteTableRowModal();
        }}
      />
    </div>
  );
};

export { SelectInputWithAddValue };