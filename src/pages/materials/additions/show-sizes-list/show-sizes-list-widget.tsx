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

const ShowSizesListWidgetForAdditions = ({ item: _item }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    deleteSupplierAdditions,
    updateSupplierAdditions,
  } = useAddSupplier({ item: _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [additionsData, setAdditionsData] = useState([]);
  useEffect(() => {
    setAdditionsData(_item.additionSuppliers);
  }, [_item.additionSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.additions.selectSupplier")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={additionsData?.map((item: any) => {
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
                      placeholder={t("materials.additions.selectSupplier")}
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
                  placeholder={t("materials.additions.unitPrice")}
                  style={clasess.textInputStyle}
                  value={state[`priceUnit-${supplierId}`] || item.price}
                  onChange={(e: any) =>
                    onChangeState("priceUnit", supplierId, e.target.value)
                  }
                />
              ),
              currency: suppliersCurrencies?.length > 0 && (
                <GoMakeAutoComplate
                  options={suppliersCurrencies}
                  style={clasess.dropDownListContainer}
                  placeholder={t("materials.additions.selectCurrency")}
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
                      deleteSupplierAdditions(
                        item,
                        setAdditionsData,
                        additionsData
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() =>
                      updateSupplierAdditions(item, setAdditionsData, _item)
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
        additionsData={additionsData}
        setAdditionsData={setAdditionsData}
      />
    </div>
  );
};
export { ShowSizesListWidgetForAdditions };
