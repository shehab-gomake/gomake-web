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
import { GoMakeDeleteMaterialModal } from "@/widgets";

const ShowSupplierListWidgetForSheet = ({ item: _item }: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    selectedItem,
    openDeleteModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onChangeState,
    deleteSupplierSheet,
    updateSupplierSheet,
  } = useAddSupplier({ _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [suppliersData, setSuppliersData] = useState([]);

  useEffect(() => {
    setSuppliersData(_item.hardboardSuppliers);
  }, [_item.hardboardSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.hardboards.supplierModal.thickness")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={suppliersData?.map((item: any) => {
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
              pricePerSquareMeter: (
                <GomakeTextInput
                  type="number"
                  placeholder={t(
                    "materials.hardboards.supplierModal.pricePerSquareMeter"
                  )}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerSquareMeter-${supplierId}`] ||
                    item?.pricePerSquareMeter
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
                  placeholder={t(
                    "materials.hardboards.supplierModal.selectCurrency"
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
                  <GoMakeDeleteMaterialModal
                    isOpen={selectedItem === item}
                    openModal={openDeleteModal}
                    onOpen={() => onOpenDeleteModal(item)}
                    onClose={onCloseDeleteModal}
                    onClickDelete={() => {
                      deleteSupplierSheet(
                        item,
                        suppliersData,
                        setSuppliersData
                      );
                    }}
                    subTitle={t("deleteModal.deleteSupplier")}
                  />
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
