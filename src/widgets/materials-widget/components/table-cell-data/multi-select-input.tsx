import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "@/widgets/materials-widget/state";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeMultiSelect, GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { ModalType } from "@/enums";

interface IProps {
  parameterKey: string;
  values: string[];
  id: string;
  isAdmin: boolean;
  options: { label: string; value: string }[];
  placeHolder?: string;
}

const MultiSelectInput = ({
  values,
  parameterKey,
  id,
  isAdmin,
  options,
  placeHolder,
}: IProps) => {
  const { updateCellData } = useTableCellData(isAdmin);
  const { t } = useTranslation();

  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
  const [pendingValues, setPendingValues] = useState<string[]>([]);

  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
    setPendingValues([]);
  };

  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1;

  const onChangeInputs = async (key: string, value: string[]) => {
    await updateCellData(id, key, value as any);
  };

  const handleChange = (newValues: string[]) => {
    if (isHaveMorethanMaterialSuppliers) {
      // Show modal for confirmation
      setPendingValues(newValues);
      setOpenDeleteTableRowModal(true);
    } else {
      // Direct update
      onChangeInputs(parameterKey, newValues);
    }
  };

  const handleConfirmUpdate = () => {
    onChangeInputs(parameterKey, pendingValues);
    onClickCloseDeleteTableRowModal();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoMakeMultiSelect
        options={options}
        value={values || []}
        onChange={handleChange}
        placeholder={placeHolder}
        isSearchable={true}
        isClearable={false}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        minWidth={200}
        maxWidth={200}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={handleConfirmUpdate}
      />
    </div>
  );
};

export { MultiSelectInput };
