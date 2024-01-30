import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate } from "@/components";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";

interface IProps {
  parameterKey: string;
  id: string;
  values: any[];
  value: string;
  isAdmin: boolean;
}

const SelectInput = ({ values, parameterKey, id, value, isAdmin }: IProps) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [productValue, setProductValues] = useState([]);
  const getAllProducts = useCallback(async () => {
    if (parameterKey === "productId" || parameterKey === "printed product")
      await getAllProductsForDropDownList(callApi, setProductValues);
  }, [parameterKey]);
  useEffect(() => {
    if (parameterKey === "productId" || parameterKey === "printed product")
      getAllProducts();
  }, []);
  const { updateCellData } = useTableCellData(isAdmin);
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

  const onSelectChange = async (event: SyntheticEvent, value) => {
    await updateCellData(id, parameterKey, value?.id);
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
          width:
            parameterKey === "productId" || parameterKey === "printed product"
              ? 200
              : 100,
        }}
        options={options}
      />
    </div>
  );
};

export { SelectInput };