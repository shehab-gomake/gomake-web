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

const ShowSizesListWidgetForPrintingMaterials = ({ item: _item }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    deleteSupplierPrintingMaterials,
    updateSupplierPrintingMaterials,
  } = useAddSupplier({ _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(_item.materialRollPrintingSuppliers);
  }, [_item.materialRollPrintingSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.lamination.modal.thickness")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={data?.map((item: any) => {
            const supplierId = item.supplierId;
            const currencyVal = item?.currency;
            return {
              supplierId: (
                <div style={clasess.supplierNameCointaner}>
                  {
                    suppliers.find((item: any) => item?.value === supplierId)
                      .label
                  }
                </div>
              ),
              pricePerUnit: (
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
                <>
                  <Switch
                    key={`test_${item?.isDefault}`}
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
                      deleteSupplierPrintingMaterials(item, data, setData)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() =>
                      updateSupplierPrintingMaterials(item, setData, _item)
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
      <AddSupplierWidget item={_item} data={data} setData={setData} />
    </div>
  );
};
export { ShowSizesListWidgetForPrintingMaterials };
