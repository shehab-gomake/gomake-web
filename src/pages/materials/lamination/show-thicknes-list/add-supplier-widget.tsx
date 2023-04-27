import { IconButton, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { useAddThickness } from "./use-add-thicknes";
import { useStyle } from "./style";
import { useEffect, useState } from "react";

const AddSupplierWidget = ({
  item,
  data,
  setData,
  categoryName,
  sizeId,
}: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangePrimaryState,
    addNewSupplierLamination,
  } = useAddThickness({ item, categoryName, sizeId });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();

  const [optionSuppliers, setOptionSuppliers] = useState([]);
  useEffect(() => {
    const arrayDisplay = [...item?.laminationSuppliers];
    const result = arrayDisplay.map((supplier) => supplier.supplierId);
    setOptionSuppliers(
      suppliers.filter((item) => !result.includes(item?.value))
    );
  }, [item]);
  return (
    <div style={clasess.inputDataContainer}>
      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={optionSuppliers}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.lamination.selectSupplier")}
          value={state.supplierId || ""}
          onChange={(e: any, item: any) =>
            onChangePrimaryState("supplierId", item)
          }
        />
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.lamination.unitPrice")}
            style={clasess.textInputStyle}
            value={state.priceUnit || ""}
            onChange={(e: any) =>
              onChangePrimaryState("priceUnit", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliersCurrencies}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.sheetPaper.selectCurrency")}
          value={state.currency || ""}
          onChange={(e: any, item: any) =>
            onChangePrimaryState("currency", item)
          }
        />
      </div>
      <div style={clasess.rowItemStyle}>
        <Switch
          key={`test_${item?.isDefault}`}
          style={clasess.switchStyle}
          defaultChecked
          checked={state?.isDefault}
          onChange={(e: any) =>
            onChangePrimaryState("isDefault", e.target.checked)
          }
        />
      </div>
      <div style={clasess.rowItemStyle}>
        <IconButton onClick={() => addNewSupplierLamination(data, setData)}>
          <SaveIcon />
        </IconButton>
      </div>
    </div>
  );
};
export { AddSupplierWidget };
