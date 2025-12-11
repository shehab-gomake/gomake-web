import React, { SyntheticEvent, useState } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { productsForDropDownList } from "@/store";
import { materialCategorySuppliersState } from "../../state";
import { ModalType } from "@/enums";

interface IProps {
  parameterKey: string;
  id: string;
  values: any[];
  value: string;
  isAdmin: boolean;
}

const SelectInput = ({ values, parameterKey, id, value, isAdmin }: IProps) => {
  const { t } = useTranslation();
  const productValue = useRecoilValue(productsForDropDownList)
  const { updateCellData } = useTableCellData(isAdmin);
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1;
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };

  const options = values
    ? parameterKey === "productId" || parameterKey === "printed product"
      ? productValue?.map((inputValue) => ({
        ...inputValue,
        id: inputValue.id,
        label: inputValue.name,
      }))
      :
      parameterKey === "machineCategory" ? values.map((inputValue) => ({
        id: inputValue.id,
        label: t(inputValue.name),
      }))
        :
        values.map((inputValue) => ({
          id: inputValue.key,
          label: inputValue.value,
        }))
    : [];
  const [selectedValue, setSelectedValue] = useState<any>()
  const onSelectChange = async (event: SyntheticEvent, value) => {
    setSelectedValue(value)
    await updateCellData(id, parameterKey, value?.id);
    // if (isHaveMorethanMaterialSuppliers) {
    //   onClickOpenDeleteTableRowModal()
    // }
    // else {
    //   await updateCellData(id, parameterKey, value?.id);

    // }
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
        key={options.find((x) => x.id == value)?.label}
        onChange={onSelectChange}
        placeholder={
          value ? options.find((x) => x.id == value)?.label : "select a value"
        }
        value={value ? options.find((x) => x.id == value)?.label : undefined}
        style={{
          border: 0,
          minWidth:
            parameterKey === "productId" || parameterKey === "printed product"
              ? 200
              : 150,
        }}
        options={options}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={async () => {
          await updateCellData(id, parameterKey, selectedValue?.id);
        }}
      />
    </div>
  );
};

export { SelectInput };