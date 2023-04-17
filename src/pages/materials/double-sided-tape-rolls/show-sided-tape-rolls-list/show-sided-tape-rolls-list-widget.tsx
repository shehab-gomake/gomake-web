import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IconButton, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Table } from "@/widgets/table/table";

import { AddSupplierWidget } from "./add-supplier-widget";
import { useNewSupplier } from "./use-suppliers";
import { useStyle } from "./style";

const ShowListWidgetForDoubleSidedTapeRolls = ({ item: _item }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    onChangeState,
    deleteSupplier,
    updateSupplier,
  } = useNewSupplier({ item: _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [supplierData, setNewSupplier] = useState([]);

  useEffect(() => {
    setNewSupplier(_item.doubleSidedTapeRollSuppliers);
  }, [_item.doubleSidedTapeRollSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.doubleSidedTapeRolls.selectSupplier")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={supplierData?.map((item: any) => {
            const supplierId = item.supplierId;
            const currencyVal = item?.currency;
            return {
              supplierId: (
                <>
                  {
                    suppliers.find((item: any) => item?.value === supplierId)
                      .label
                  }
                </>
              ),
              pricePerUnit: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.doubleSidedTapeRolls.pricePerUnit")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerUnit-${supplierId}`] || item.pricePerUnit
                  }
                  onChange={(e: any) =>
                    onChangeState("pricePerUnit", supplierId, e.target.value)
                  }
                />
              ),
              width: (
                <GomakeTextInput
                  disabled={true}
                  type="number"
                  placeholder={t("materials.doubleSidedTapeRolls.width")}
                  style={clasess.textInputStyle}
                  value={state[`width-${supplierId}`] || item.width}
                  onChange={(e: any) =>
                    onChangeState("width", supplierId, e.target.value)
                  }
                />
              ),
              height: (
                <GomakeTextInput
                  disabled={true}
                  type="number"
                  placeholder={t("materials.doubleSidedTapeRolls.height")}
                  style={clasess.textInputStyle}
                  value={state[`height-${supplierId}`] || item.height}
                  onChange={(e: any) =>
                    onChangeState("height", supplierId, e.target.value)
                  }
                />
              ),
              currency: suppliersCurrencies?.length > 0 && (
                <GoMakeAutoComplate
                  options={suppliersCurrencies}
                  style={clasess.dropDownListContainer}
                  placeholder={t(
                    "materials.doubleSidedTapeRolls.selectCurrency"
                  )}
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
                      deleteSupplier(item, setNewSupplier, supplierData)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() => updateSupplier(item, setNewSupplier, _item)}
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
        supplierData={supplierData}
        setNewSupplier={setNewSupplier}
      />
    </div>
  );
};
export { ShowListWidgetForDoubleSidedTapeRolls };
