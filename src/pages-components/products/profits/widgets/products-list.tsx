import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { AddIcon } from "@/icons";

import { AddTestProductModal } from "./add-test-product-modal";
import { profitsState } from "../store/profits";

import { productTestState } from "@/store/product-test";
import { useEffect } from "react";
import { useStyle } from "../style";
import { permissionsState } from "@/store/permissions";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import { useUserPermission } from "@/hooks/use-permission";

const ProductList = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const productTest = useRecoilValue<any>(productTestState);
  const { CheckPermission } = useUserPermission();

  useEffect(() => {
    if (!productTest && profitsStateValue?.testProductsState?.length > 0) {
      profitsStateValue?.onCklickActionProfitTestResultsByActionId(
        profitsStateValue?.testProductsState[0]?.item?.productId,
        profitsStateValue?.testProductsState[0]?.name,
        profitsStateValue?.testProductsState[0]?.item?.id,
        true
      );
    }
  }, [profitsStateValue?.testProductsState, productTest]);
  return (
    <>
      {profitsStateValue?.testProductsState?.length > 0 ? (
        <div style={clasess.mainContainerForProductTable}>
          <div style={clasess.titleHeadersTale}>
            <div style={clasess.titleHederTextStyle}>
              {t("products.profits.itemName")}
            </div>
            <div style={clasess.titleHederTextStyle}>
              {t("products.profits.details")}
            </div>
            <div style={clasess.titleHederTextStyle}>
              {t("products.profits.more")}
            </div>
          </div>
          <div style={{ width: "100%", maxHeight: 135, overflow: "scroll" }}>
            <>
              {profitsStateValue?.testProductsState?.map((item: any) => {
                return (
                  <div
                    style={
                      item?.id === productTest?.id &&
                      item?.item?.id === productTest?.actionProductId
                        ? clasess.bodyTableOddContainer
                        : clasess.bodyTableEvenContainer
                    }
                    onClick={() => {
                      !(
                        item?.id === productTest?.id &&
                        item?.item?.id === productTest?.actionProductId
                      ) &&
                        profitsStateValue?.onCklickActionProfitTestResultsByActionId(
                          item?.item?.productId,
                          item?.name,
                          item?.item?.id,
                          !!item?.item?.isBaseCase
                        );
                    }}
                  >
                    <div style={clasess.nameStyle}>{item?.name}</div>
                    <div style={clasess.detailsStyle} className="scrollBlue">
                      {item?.details}
                    </div>
                    <div style={clasess.moreStyle}>{item?.more}</div>
                  </div>
                );
              })}
            </>
          </div>
          <PermissionCheck userPermission={Permissions.EDIT_PROFITS}>
              <div
                style={clasess.addNewProductContainer2}
                onClick={() => profitsStateValue.setOpenAddTestProductModal(true)}
              >
                <AddIcon />
                <div style={clasess.addProductStyle}>
                  { CheckPermission(Permissions.EDIT_PROFITS) ? t("products.profits.addNewProduct") : null}
                </div>
              </div>
          </PermissionCheck>
        
        </div>
      ) : (
       
           <PermissionCheck userPermission={Permissions.EDIT_PROFITS}>
                <div style={clasess.noDataContainer}></div>
                  <div
                    style={clasess.addNewProductContainer}
                    onClick={() => profitsStateValue.setOpenAddTestProductModal(true)}
                  >
                    <AddIcon />
                    <div style={clasess.addProductStyle}>
                    {CheckPermission(Permissions.EDIT_PROFITS) ? t("products.profits.addNewProduct") : null}
                    </div>
                  </div>
           </PermissionCheck>
       
       
      )}

      <AddTestProductModal />
    </>
  );
};
export { ProductList };
