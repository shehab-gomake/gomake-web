import { IconButton, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

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
  return (
    <div style={clasess.inputDataContainer}>
      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.sheetEncapsulation.selectSupplier")}
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
            placeholder={t("materials.sheetEncapsulation.pricePerUnit")}
            style={clasess.textInputStyle}
            value={state.pricePerUnit || ""}
            onChange={(e: any) =>
              onChangePrimaryState("pricePerUnit", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.sheetEncapsulation.height")}
            style={clasess.textInputStyle}
            value={state.height || ""}
            onChange={(e: any) =>
              onChangePrimaryState("height", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.sheetEncapsulation.width")}
            style={clasess.textInputStyle}
            value={state.width || ""}
            onChange={(e: any) => onChangePrimaryState("width", e.target.value)}
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.sheetEncapsulation.weight")}
            style={clasess.textInputStyle}
            value={state.weight || ""}
            onChange={(e: any) =>
              onChangePrimaryState("weight", e.target.value)
            }
          />
        </div>
      </div>
      <div style={clasess.rowItemStyle}>
        <div style={{ width: "80%" }}>
          <GomakeTextInput
            type="number"
            placeholder={t("materials.sheetEncapsulation.thickness")}
            style={clasess.textInputStyle}
            value={state.thickness || ""}
            onChange={(e: any) =>
              onChangePrimaryState("thickness", e.target.value)
            }
          />
        </div>
      </div>

      <div style={clasess.rowItemStyle}>
        <GoMakeAutoComplate
          options={suppliersCurrencies}
          style={clasess.dropDownListContainer}
          placeholder={t("materials.sheetEncapsulation.selectCurrency")}
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
