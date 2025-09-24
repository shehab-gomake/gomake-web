import { IRowData } from "@/widgets/materials-widget/interface";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import { GoMakeDeleteModal, SecondSwitch } from "@/components";
import { CurrencyInput } from "@/widgets/materials-widget/components/table-cell-data/currency";
import { ArrayInput } from "@/widgets/materials-widget/components/table-cell-data/array-input";
import { NumberStringInput } from "@/widgets/materials-widget/components/table-cell-data/number-string-input";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { ImageInput } from "./image-input";
import { MultiSelectInput } from "./multi-select-input";
import { SelectInput } from "./select-input";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { MultiSelectList } from "./multi-select-list";
import { materialCategorySuppliersState, materialsParametersState } from "../../state";
import { useTranslation } from "react-i18next";
import { MultiSelectClientsInput } from "./multi-select-clients-input";
import { SuppliersInput } from "./suppliers-input";
import { InventoryInput } from "./inventory-input";
import { PurchasePricingInput } from "./purchase-pricing-input";
import { LongTextInput } from "./long-text-input";
import { useState } from "react";
import { ModalType } from "@/enums";

const TableCellData = ({
  value,
  type,
  isEditable,
  parameterKey,
  id,
  values,
  isAdmin,
  onChangeRowCheckBox,
  unit,
  isInventoryTable,
  isPurchasePricingTable,
}: IRowData) => {
  const { updateCellData, machinesOptions, clientsOptions, } = useTableCellData(isAdmin, isInventoryTable, isPurchasePricingTable);
  const machinesCategories = useRecoilValue(machineCategoriesState);
  const parameterCategories = useRecoilValue<any>(materialsParametersState);
  const { t } = useTranslation()
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };
  const toggleIsActive = async () => {
    if (isHaveMorethanMaterialSuppliers) {
      onClickOpenDeleteTableRowModal()
    }
    else {
      await updateCellData(id, parameterKey, !value);

    }
  };
  switch (type) {

    case EDataTypeEnum.BOOLEAN:
      return (
        <>
          <SecondSwitch checked={(!value || value === "false" || value === "") ? false : true} onChange={toggleIsActive} />
          <GoMakeDeleteModal
            modalType={ModalType.EDIT}
            openModal={openDeleteTableRowModal}
            onClose={onClickCloseDeleteTableRowModal}
            hideIcon
            title={t("materials.modals.updateModalTitle")}
            yesBtn={t("documentingSettings.update")}
            onClickDelete={async () => {
              await updateCellData(id, parameterKey, !value);
            }}
          />
        </>
      )

    case EDataTypeEnum.CURRENCY:
      return (
        <CurrencyInput
          value={value as string}
          id={id}
          key={parameterKey}
          isAdmin={isAdmin}
          onChangeRowCheckBox={onChangeRowCheckBox}
        />
      );
    case EDataTypeEnum.ARRAY_INPUT:
      return (
        <ArrayInput
          valueArray={value as string[]}
          type={type}
          isEditable={isEditable}
          parameterKey={parameterKey}
          id={id}
          isAdmin={isAdmin}
          isInventoryTable={isInventoryTable}
          isPurchasePricingTable={isPurchasePricingTable}
        />
      );
    case EDataTypeEnum.IMAGE:
      return (
        <ImageInput
          parameterKey={parameterKey}
          id={id}
          value={value.toString()}
          isAdmin={isAdmin}
        />
      );
    case EDataTypeEnum.LIST:
      return (
        <SelectInput
          values={values}
          parameterKey={parameterKey}
          id={id}
          value={value as string}
          isAdmin={isAdmin}
        />
      );
    case EDataTypeEnum.MACHINES_LIST:
      return (
        <MultiSelectInput
          values={value as string[]}
          parameterKey={parameterKey}
          id={id}
          isAdmin={isAdmin}
          options={machinesOptions}
          placeHolder={t("materials.inputs.selectMachine")}
        />
      );
    case EDataTypeEnum.CLIENTS_LIST:
      return (
        <MultiSelectClientsInput
          values={values}
          parameterKey={parameterKey}
          id={id}
          isAdmin={isAdmin}
          options={clientsOptions}
          placeHolder={t("materials.inputs.selectClient")}
        />
      );
    case EDataTypeEnum.PRODUCTS_LIST:
      return (
        <SelectInput
          values={values}
          parameterKey={parameterKey}
          id={id}
          value={value as string}
          isAdmin={isAdmin}
        />
      );
    case EDataTypeEnum.MACHINES_CATEGORY_LIST:
      return (
        <SelectInput
          values={machinesCategories}
          parameterKey={parameterKey}
          id={id}
          value={value as string}
          isAdmin={isAdmin}
        />
      );
    case EDataTypeEnum.MULTI_SELECATION_LIST:
      return (
        <MultiSelectList
          values={value}
          parameterKey={parameterKey}
          id={id}
          isAdmin={isAdmin}
          options={values.map((item) => ({
            value: item.key,
            label: item.value,
          }))}
          placeHolder={t("materials.inputs.selectValue")}
        />
      );
    case EDataTypeEnum.NOTE_BOOK_TYPES:
      return (
        <MultiSelectInput
          values={value as string[]}
          parameterKey={parameterKey}
          id={id}
          isAdmin={isAdmin}
          options={parameterCategories?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          placeHolder={t("materials.inputs.selectNotebookType")}
        />
      );
    case EDataTypeEnum.INVENTORY:
      return (
        <InventoryInput
          value={value as string}
          isAdmin={isAdmin}
          id={id}
        />
      );
    case EDataTypeEnum.PURCHASE_PRICING:
      return (
        <PurchasePricingInput
          value={value as string}
          isAdmin={isAdmin}
          id={id}
        />
      );
    case EDataTypeEnum.LONG_TEXT:
      return (
        <LongTextInput
          value={value as string}
          isAdmin={isAdmin}
          id={id}
        />
      );
    default:
      return (
        <NumberStringInput
          type={type}
          isEditable={isEditable}
          parameterKey={parameterKey}
          id={id}
          value={value}
          isAdmin={isAdmin}
          unit={unit}
          isInventoryTable={isInventoryTable}
          isPurchasePricingTable={isPurchasePricingTable}
        />
      );
  }
};

export { TableCellData };