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

const ShowSupplierListWidgetForWildPrintingMatieral = ({ item }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    deleteSupplierSheet,
    updateSupplierSheet,
  } = useAddSupplier({ item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [suppliersData, setSuppliersData] = useState([]);
  useEffect(() => {
    setSuppliersData(item.wideFormatMaterialSuppliers);
  }, [item.wideFormatMaterialSuppliers]);

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
            return {
              supplierId: (
                <>
                  {suppliers?.length > 0 && (
                    <GoMakeAutoComplate
                      options={suppliers}
                      style={clasess.dropDownListContainer}
                      placeholder={t("materials.sheetPaper.selectSupplier")}
                      value={suppliers.find(
                        (item: any) => item?.value === supplierId
                      )}
                      disabled={true}
                    />
                  )}
                </>
              ),
              pricePerUnit: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.sheetPaper.unitPrice")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerMeterSquare-${supplierId}`] ||
                    item.pricePerMeterSquare
                  }
                  onChange={(e: any) =>
                    onChangeState(
                      "pricePerMeterSquare",
                      supplierId,
                      e.target.value
                    )
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
              isDefault: (
                <>
                  <Switch
                    style={clasess.switchStyle}
                    defaultChecked={item?.isDefault}
                    checked={state[`isDefault-${supplierId}`]}
                    onChange={(e: any) =>
                      onChangeState("isDefault", supplierId, e.target.checked)
                    }
                  />
                </>
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
                    onClick={() => updateSupplierSheet(item)}
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
        item={item}
        suppliersData={suppliersData}
        setSuppliersData={setSuppliersData}
      />
    </div>
  );
};
export { ShowSupplierListWidgetForWildPrintingMatieral };
