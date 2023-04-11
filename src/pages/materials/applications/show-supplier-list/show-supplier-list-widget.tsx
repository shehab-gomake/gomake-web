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

const ShowSupplierListInsideApplication = ({ item: _item }: any) => {
  const {
    headerTable,
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
    setSuppliersData(_item.applicationSuppliers);
  }, [_item.applicationSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.applications.supplier")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={suppliersData?.map((item: any) => {
            const supplierId = item.supplierId;
            const currencyVal = item?.currency;
            const directionVal = item?.direction;
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
              pricePerSquareMeter: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.sheetPaper.unitPrice")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerSquareMeter-${supplierId}`] ||
                    item.pricePerSquareMeter
                  }
                  onChange={(e: any) =>
                    onChangeState(
                      "pricePerSquareMeter",
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
                <Switch
                  style={clasess.switchStyle}
                  defaultChecked={item?.isDefault}
                  checked={state[`isDefault-${supplierId}`]}
                  onChange={(e: any) =>
                    onChangeState("isDefault", supplierId, e.target.checked)
                  }
                  key={`test_${item?.isDefault}`}
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
export { ShowSupplierListInsideApplication };
