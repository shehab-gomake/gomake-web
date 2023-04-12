import { IconButton, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { useAddSupplier } from "./use-add-supplier";
import { useStyle } from "./style";

const AddSupplierWidget = ({ item, suppliersData, setSuppliersData }: any) => {
  const {
    headerTable,
    applicationDirection,
    state,
    suppliers,
    suppliersCurrencies,
    onChangePrimaryState,
    addNewSupplierSheet,
  } = useAddSupplier({ item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  return (
    <div style={clasess.inputDataContainer}>
      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.encapsulationRoll.selectSupplier")}
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
            placeholder={t("materials.encapsulationRoll.pricePerSquareMeter")}
            style={clasess.textInputStyle}
            value={state.pricePerSquareMeter || ""}
            onChange={(e: any) =>
              onChangePrimaryState("pricePerSquareMeter", e.target.value)
            }
          />
        </div>
      </div>

      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliersCurrencies}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.encapsulationRoll.selectCurrency")}
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
          onClick={() => addNewSupplierSheet(suppliersData, setSuppliersData)}
        >
          <SaveIcon />
        </IconButton>
      </div>
    </div>
  );
};
export { AddSupplierWidget };
