import { useEffect, useState } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IconButton, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Table } from "@/widgets/table/table";

import { AddSupplierWidget } from "./add-supplier-widget";
import { useAddSupplier } from "./use-add-supplier";
import { useStyle } from "./style";
import { GoMakeDeleteMaterialModal } from "@/widgets";

const ShowSizesListWidgetForTubes = ({ item: _item }: any) => {
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
    deleteSupplierTubes,
    updateSupplierTubes,
  } = useAddSupplier({ _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(_item.tubeSuppliers);
  }, [_item.tubeSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.envelops.supplierTitle")}
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
                  <GoMakeDeleteMaterialModal
                    isOpen={selectedItem === item}
                    openModal={openDeleteModal}
                    onOpen={() => onOpenDeleteModal(item)}
                    onClose={onCloseDeleteModal}
                    onClickDelete={() => {
                      deleteSupplierTubes(item, data, setData);
                    }}
                    subTitle={t("deleteModal.deleteSupplier")}
                  />
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() => updateSupplierTubes(item, setData, _item)}
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
export { ShowSizesListWidgetForTubes };
