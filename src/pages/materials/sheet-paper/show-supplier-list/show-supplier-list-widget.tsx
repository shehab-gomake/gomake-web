import { IconButton, Switch } from "@mui/material";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Table } from "@/widgets/table/table";
import SaveIcon from "@mui/icons-material/Save";
import { useStyle } from "./style";
import { useAddSupplier } from "./use-add-supplier";

const ShowSupplierListWidgetForSheet = ({ item }: any) => {
  const {
    headerTable,
    sheetDirection,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    addNewSupplierSheet,
  } = useAddSupplier({ item });
  const { clasess } = useStyle({ headerTable });
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>Supplier Sheet</div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={item.sheetSuppliers.map((item: any) => {
            return {
              supplierId: (
                <GoMakeAutoComplate
                  options={suppliers}
                  // style={clasess.dropDownListContainer}
                  placeholder="Select Supplier"
                  value={state.supplierId || ""}
                  onChange={(e: any, item: any) =>
                    onChangeState("supplierId", item)
                  }
                />
              ),
              pricePerUnit: (
                <GomakeTextInput
                  type="number"
                  placeholder="Unit price"
                  style={clasess.textInputStyle}
                  value={state.pricePerUnit || ""}
                  onChange={(e: any) =>
                    onChangeState("pricePerUnit", e.target.value)
                  }
                />
              ),
              pricePerTon: (
                <GomakeTextInput
                  type="number"
                  placeholder="Price Per Ton"
                  style={clasess.textInputStyle}
                  value={state.pricePerTon || ""}
                  onChange={(e: any) =>
                    onChangeState("pricePerTon", e.target.value)
                  }
                />
              ),
              currency: (
                <GoMakeAutoComplate
                  options={suppliersCurrencies}
                  style={clasess.dropDownListContainer}
                  placeholder="Select Currency"
                  value={state.currency || ""}
                  onChange={(e: any, item: any) =>
                    onChangeState("currency", item)
                  }
                />
              ),
              direction: (
                <GoMakeAutoComplate
                  options={sheetDirection}
                  style={clasess.dropDownListContainer}
                  placeholder="Select Direction"
                  value={state.direction || ""}
                  onChange={(e: any, item: any) =>
                    onChangeState("direction", item)
                  }
                />
              ),
              isDefault: (
                <Switch
                  style={clasess.switchStyle}
                  defaultChecked
                  checked={true}
                  onChange={(e: any) =>
                    onChangeState("isDefault", e.target.checked)
                  }
                />
                // <IconButton
                //   style={clasess.iconStyle}
                //   onClick={addNewSupplierSheet}
                // >
                //   <SaveIcon />
                // </IconButton>
              ),
            };
          })}
        />
      </div>
      <div style={clasess.inputDataContainer}>
        <div style={clasess.rowItemStyle}>
          <GoMakeAutoComplate
            options={suppliers}
            style={clasess.dropDownListContainer}
            placeholder="Select Supplier"
            value={state.supplierId || ""}
            onChange={(e: any, item: any) => onChangeState("supplierId", item)}
          />
        </div>
        <div style={clasess.rowItemStyle}>
          <div style={{ width: "80%" }}>
            <GomakeTextInput
              type="number"
              placeholder="Unit price"
              style={clasess.textInputStyle}
              value={state.pricePerUnit || ""}
              onChange={(e: any) =>
                onChangeState("pricePerUnit", e.target.value)
              }
            />
          </div>
        </div>
        <div style={clasess.rowItemStyle}>
          <div style={{ width: "80%" }}>
            <GomakeTextInput
              type="number"
              placeholder="Price Per Ton"
              style={clasess.textInputStyle}
              value={state.pricePerTon || ""}
              onChange={(e: any) =>
                onChangeState("pricePerTon", e.target.value)
              }
            />
          </div>
        </div>
        <div style={clasess.rowItemStyle}>
          <GoMakeAutoComplate
            options={suppliersCurrencies}
            style={clasess.dropDownListContainer}
            placeholder="Select Currency"
            value={state.currency || ""}
            onChange={(e: any, item: any) => onChangeState("currency", item)}
          />
        </div>
        <div style={clasess.rowItemStyle}>
          <GoMakeAutoComplate
            options={sheetDirection}
            style={clasess.dropDownListContainer}
            placeholder="Select Direction"
            value={state.direction || ""}
            onChange={(e: any, item: any) => onChangeState("direction", item)}
          />
        </div>
        <div style={clasess.rowItemStyle}>
          <Switch
            style={clasess.switchStyle}
            defaultChecked
            checked={true}
            onChange={(e: any) => onChangeState("isDefault", e.target.checked)}
          />
          <IconButton style={clasess.iconStyle} onClick={addNewSupplierSheet}>
            <SaveIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
export { ShowSupplierListWidgetForSheet };
