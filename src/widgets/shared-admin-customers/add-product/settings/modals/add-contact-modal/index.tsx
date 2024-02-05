import { useTranslation } from "react-i18next";
import {
  GoMakeDeleteModal,
  GoMakeModal,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { AddNewIcon, DeleteMaterial } from "@/icons";
import { IconButton, Tooltip } from "@mui/material";

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
  deleteProductSKURow
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
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
                key={allProductSKU}
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
                key={allProductSKU}
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
            <Tooltip title={t("products.addProduct.admin.modalProductSKUTitle")}>
              <IconButton onClick={() => createNewProductSKU()}>
                <AddNewIcon />
              </IconButton>
            </Tooltip>
          </div>
          {allProductSKU?.map((item, index) => {
            return (
              <div key={`${index}-${item?.id}`} style={clasess.productMappingContainer}>
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
                <IconButton onClick={() => onClickOpenDeleteRowModal(item?.id)}>
                  <DeleteMaterial stroke="red" />
                </IconButton>
              </div>
            )
          })}
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
