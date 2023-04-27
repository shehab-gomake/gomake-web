import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { GoMakeDeleteMaterialModal } from "@/widgets";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IconButton, Switch } from "@mui/material";
import { Table } from "@/widgets/table/table";

import { AddSupplierWidget } from "./add-supplier-widget";
import { useNewSupplier } from "./use-suppliers";
import { useStyle } from "./style";

const ShowListWidgetForColors = ({ item: _item }: any) => {
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
    deleteSupplier,
    updateSupplier,
  } = useNewSupplier({ item: _item });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [supplierData, setNewSupplier] = useState([]);

  useEffect(() => {
    setNewSupplier(_item.colorSuppliers);
  }, [_item.colorSuppliers]);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerTitle}>
        {t("materials.colors.selectSupplier")}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={headerTable}
          tableRows={supplierData?.map((item: any) => {
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
                  placeholder={t("materials.colors.pricePerLiter")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerLiter-${supplierId}`] || item.pricePerLiter
                  }
                  onChange={(e: any) =>
                    onChangeState("pricePerLiter", supplierId, e.target.value)
                  }
                />
              ),
              volumeInLiters: (
                <GomakeTextInput
                  disabled={true}
                  type="number"
                  placeholder={t("materials.colors.volumeInLiters")}
                  style={clasess.textInputStyle}
                  value={
                    state[`volumeInLiters-${supplierId}`] || item.volumeInLiters
                  }
                  onChange={(e: any) =>
                    onChangeState("volumeInLiters", supplierId, e.target.value)
                  }
                />
              ),
              literInSquareMeter: (
                <GomakeTextInput
                  disabled={true}
                  type="number"
                  placeholder={t("materials.colors.literInSquareMeter")}
                  style={clasess.textInputStyle}
                  value={
                    state[`literInSquareMeter-${supplierId}`] ||
                    item.literInSquareMeter
                  }
                  onChange={(e: any) =>
                    onChangeState(
                      "literInSquareMeter",
                      supplierId,
                      e.target.value
                    )
                  }
                />
              ),
              pricePerContainer: (
                <GomakeTextInput
                  type="number"
                  placeholder={t("materials.colors.pricePerContainer")}
                  style={clasess.textInputStyle}
                  value={
                    state[`pricePerContainer-${supplierId}`] ||
                    item.pricePerContainer
                  }
                  onChange={(e: any) =>
                    onChangeState(
                      "pricePerContainer",
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
                  placeholder={t("materials.colors.selectCurrency")}
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
                      deleteSupplier(item, setNewSupplier, supplierData);
                    }}
                    subTitle={t("deleteModal.deleteSupplier")}
                  />
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
export { ShowListWidgetForColors };
