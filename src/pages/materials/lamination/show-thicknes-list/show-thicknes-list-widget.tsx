import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IconButton, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Table } from "@/widgets/table/table";

import { AddSupplierWidget } from "./add-supplier-widget";
import { useAddThickness } from "./use-add-thicknes";
import { useStyle } from "./style";
import { GoMakeDeleteMaterialModal } from "@/widgets";

const ShowThicknesListWidgetForLamination = ({
  item: _item,
  categoryName,
  sizeId,
}: any) => {
  const {
    headerTable,
    state,
    suppliers,
    suppliersCurrencies,
    openDeleteModal,
    selectedItem,
    onCloseDeleteModal,
    onChangeState,
    deleteSupplierLamination,
    updateSupplierLamination,
    onOpenDeleteModal,
  } = useAddThickness({ _item, categoryName, sizeId });
  const { clasess } = useStyle({ headerTable });
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(_item.laminationSuppliers);
  }, [_item.laminationSuppliers]);

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
                  placeholder={t("materials.lamination.unitPrice")}
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
                  placeholder={t("materials.lamination.selectCurrency")}
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
                    onClickDelete={() =>
                      deleteSupplierLamination(item, data, setData)
                    }
                    subTitle={t("deleteModal.deleteSupplier")}
                  />
                  <IconButton
                    style={clasess.updatedIcon}
                    onClick={() =>
                      updateSupplierLamination(item, setData, _item)
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
        data={data}
        setData={setData}
        categoryName={categoryName}
        sizeId={sizeId}
      />
    </div>
  );
};
export { ShowThicknesListWidgetForLamination };
