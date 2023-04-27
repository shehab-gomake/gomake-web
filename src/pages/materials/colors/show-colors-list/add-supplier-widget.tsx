import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { IconButton, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import { useNewSupplier } from "./use-suppliers";
import { useStyle } from "./style";

const AddSupplierWidget = ({ item, supplierData, setNewSupplier }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangePrimaryState,
    addNewSupplier,
  } = useNewSupplier({ item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [optionSuppliers, setOptionSuppliers] = useState([]);
  useEffect(() => {
    const arrayDisplay = [...item?.colorSuppliers];
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
          placeholder={t("materials.colors.selectSupplier")}
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
            placeholder={t("materials.colors.pricePerLiter")}
            style={clasess.textInputStyle}
            value={state.pricePerLiter || ""}
            onChange={(e: any) =>
              onChangePrimaryState("pricePerLiter", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            disabled={true}
            type="number"
            placeholder={t("materials.colors.volumeInLiters")}
            style={clasess.textInputStyle}
            value={state.volumeInLiters || ""}
            onChange={(e: any) =>
              onChangePrimaryState("volumeInLiters", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            disabled={true}
            type="number"
            placeholder={t("materials.colors.literInSquareMeter")}
            style={clasess.textInputStyle}
            value={state.literInSquareMeter || ""}
            onChange={(e: any) =>
              onChangePrimaryState("literInSquareMeter", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.colors.pricePerContainer")}
            style={clasess.textInputStyle}
            value={state.pricePerContainer || ""}
            onChange={(e: any) =>
              onChangePrimaryState("pricePerContainer", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliersCurrencies}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.colors.selectCurrency")}
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
        <IconButton
          onClick={() => addNewSupplier(supplierData, setNewSupplier)}
        >
          <SaveIcon />
        </IconButton>
      </div>
    </div>
  );
};
export { AddSupplierWidget };
