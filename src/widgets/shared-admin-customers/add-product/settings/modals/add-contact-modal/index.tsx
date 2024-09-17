import { useTranslation } from "react-i18next";
import {
  GoMakeDeleteModal,
  GoMakeModal,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { AddNewIcon, DeleteMaterial } from "@/icons";
import { IconButton, Tooltip } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useMemo } from "react";

const AddProductSkuModal = ({
  openModal,
  modalTitle,
  onClose,
  onChangeStateProductSKU,
  createNewProductSKU,
  errorName,
  errorCode,
  allProductSKU,
  openDeleteRowModal,
  onClickOpenDeleteRowModal,
  onClickCloseDeleteRowModal,
  deleteProductSKURow,
  productSKUState
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();



  const ProductItem = useMemo(() => {
    return ({ key, item, onClickOpenDeleteRowModal }) => (
      <div key={key} style={clasess.productMappingContainer}>
        <div>
          <GomakeTextInput
            style={clasess.textInputStyle}
            value={`${item?.name}`}
          />
        </div>
        <div>
          <GomakeTextInput
            style={clasess.textInputStyle}
            value={`${item.code}`}
          />
        </div>
        <div style={clasess.colorInputStyle}>
          <MuiColorInput
            value={
              productSKUState?.productionFloorJobColor ??
              "#2e3092"
            }
            format="hex"
            disabled
          />
        </div>
        <IconButton onClick={() => onClickOpenDeleteRowModal(item?.id)}>
          <DeleteMaterial stroke="red" />
        </IconButton>
      </div>
    );
  }, []);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.modalMainContainer}>
          <div style={clasess.productMappingContainer}>
            <div>
              <GomakeTextInput
                value={productSKUState?.name}
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterName")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("name", e.target.value);
                }}
              />
              {errorName && (
                <div style={clasess.errorlabelStyle}>
                  {t("login.thisFieldRequired")}
                </div>
              )}
            </div>
            <div>
              <GomakeTextInput
                value={productSKUState?.code}
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterCode")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("code", e.target.value);
                }}
              />
              {errorCode && (
                <div style={clasess.errorlabelStyle}>
                  {t("login.thisFieldRequired")}
                </div>
              )}
            </div>
            <div style={clasess.colorInputStyle}>
              <MuiColorInput
                value={productSKUState?.productionFloorJobColor}
                format="hex"
                onChange={(value: any) => {
                  onChangeStateProductSKU("productionFloorJobColor", value);
                }}
              />
            </div>
            <Tooltip title={t("products.addProduct.admin.modalProductSKUTitle")}>
              <IconButton onClick={() => createNewProductSKU()}>
                <AddNewIcon />
              </IconButton>
            </Tooltip>
          </div>
          {allProductSKU?.map((item, index) => (
            <ProductItem key={`${index}-${item?.id}`} item={item} onClickOpenDeleteRowModal={onClickOpenDeleteRowModal} />
          ))}
        </div>
      </GoMakeModal>
      <GoMakeDeleteModal
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={deleteProductSKURow}
      />
    </>
  );
};
export { AddProductSkuModal };
