import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IconButton, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Table } from "@/widgets/table/table";

import { AddSupplierWidget } from "./add-supplier-widget";
import { useAddSupplier } from "./use-add-supplier";
import { useStyle } from "./style";

const ShowSupplierListWidgetForSheet = ({ item: _item }: any) => {
  const {
    headerTable,
    sheetDirection,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    deleteSupplierSheet,
    updateSupplierSheet,
  } = useAddSupplier({ item: _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [suppliersData, setSuppliersData] = useState([]);
  useEffect(() => {
    setSuppliersData(_item.sheetSuppliers);
  }, [_item.sheetSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.sheetPaper.supplierSheet")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={suppliersData.map((item: any) => {
            const supplierId = item.supplierId;
            const currencyVal = item?.currency;
            const directionVal = item?.direction;
            return {
              supplierId: (
                <div style={clasess.supplierNameCointaner}>
                  {
                    suppliers.find((item: any) => item?.value === supplierId)
                      ?.label
                  }
                </div>
              ),
              pricePerUnit: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.sheetPaper.unitPrice")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerUnit-${supplierId}`] || item.pricePerUnit
                  }
                  onChange={(e: any) =>
                    onChangeState("pricePerUnit", supplierId, e.target.value)
                  }
                />
              ),
              pricePerTon: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.sheetPaper.pricePerTon")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerTon-${supplierId}`] || item.pricePerTon || ""
                  }
                  onChange={(e: any) =>
                    onChangeState("pricePerTon", supplierId, e.target.value)
                  }
                />
              ),
              currency: suppliersCurrencies?.length > 0 && (
                <GoMakeAutoComplate
                  options={suppliersCurrencies}
                  style={clasess.dropDownListContainer}
                  placeholder={t("materials.sheetPaper.selectCurrency")}
                  value={
                    state[`currency-${supplierId}`] ||
                    suppliersCurrencies.find(
                      (item: any) => item?.value === currencyVal
                    )
                  }
                  onChange={(e: any, item: any) =>
                    onChangeState("currency", supplierId, item)
                  }
                />
              ),
              direction: (
                <>
                  {sheetDirection?.length > 0 && (
                    <GoMakeAutoComplate
                      options={sheetDirection}
                      style={clasess.dropDownListContainer}
                      placeholder={t("materials.sheetPaper.selectDirection")}
                      value={
                        state[`direction-${supplierId}`] ||
                        sheetDirection.find(
                          (item: any) => item?.value === directionVal.toString()
                        )
                      }
                      onChange={(e: any, item: any) =>
                        onChangeState("direction", supplierId, item)
                      }
                    />
                  )}
                </>
              ),
              isDefault: (
                <Switch
                  key={`test_${item?.isDefault}`}
                  style={clasess.switchStyle}
                  defaultChecked={item?.isDefault}
                  checked={state[`isDefault-${supplierId}`]}
                  onChange={(e: any) =>
                    onChangeState("isDefault", supplierId, e.target.checked)
                  }
                />
              ),
              controls: (
                <>
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() =>
                      deleteSupplierSheet(item, suppliersData, setSuppliersData)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() =>
                      updateSupplierSheet(item, setSuppliersData, _item)
                    }
                  >
                    <SaveAsIcon />
                  </IconButton>
                </>
              ),
            };
          })}
        />
      </div>
      <AddSupplierWidget
        item={_item}
        suppliersData={suppliersData}
        setSuppliersData={setSuppliersData}
      />
    </div>
  );
};
export { ShowSupplierListWidgetForSheet };
