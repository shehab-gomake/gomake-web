import React, { SyntheticEvent, useState, useEffect } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { productsForDropDownList } from "@/store";
import { materialCategorySuppliersState } from "../../state";
import { ModalType } from "@/enums";
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { FONT_FAMILY } from "@/utils/font-family";

interface IProps {
  parameterKey: string;
  id: string;
  values: any[];
  value: string;
  isAdmin: boolean;
}

const SelectInputWithAddValue = ({ values, parameterKey, id, value, isAdmin }: IProps) => {
  console.log("values", { values, parameterKey, id, value, isAdmin });
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const { materialCategory } = query;
  const productValue = useRecoilValue(productsForDropDownList)
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
    // Create temporary option for immediate UI feedback
    const tempOption = {
      key: `temp_${Date.now()}`,
      value: newValue,
    };
    setLocalValues(prevValues => [...prevValues, tempOption]);

    if (isHaveMorethanMaterialSuppliers) {
      setSelectedValue(tempOption);
      onClickOpenDeleteTableRowModal();
    } else {
      try {
        // Call updateCellData and let the backend response update the real values
        await updateCellData(id, parameterKey, newValue);
        // The useEffect will sync the new values from props when the backend responds
      } catch (error) {
        // If update fails, remove the temporary option
        setLocalValues(prevValues => prevValues.filter(v => v.key !== tempOption.key));
      }
    }
  };

  const baseOptions = localValues
    ? parameterKey === "productId" || parameterKey === "printed product"
      ? productValue?.map((inputValue) => ({
        ...inputValue,
        id: inputValue.id,
        label: inputValue.name,
      }))
      :
      parameterKey === "machineCategory" ? localValues.map((inputValue) => ({
        id: inputValue.id,
        label: t(inputValue.name),
      }))
        :
        localValues.map((inputValue) => ({
          id: inputValue.key,
          label: inputValue.value,
        }))
    : [];

  // Add "Add new value" option if user is typing something not in the list
  const options = inputValue && !baseOptions.find(option =>
    option.label.toLowerCase() === inputValue.toLowerCase()
  ) && inputValue.trim() !== ""
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
        await updateCellData(id, parameterKey, value?.id);
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
          // For new values, send the actual value, for existing values send the id
          const valueToSend = selectedValue?.key?.startsWith('temp_')
            ? selectedValue?.value
            : selectedValue?.id || selectedValue?.key;
          await updateCellData(id, parameterKey, valueToSend);
        }}
      />
    </div>
  );
};

export { SelectInputWithAddValue };