import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { Skeleton } from "@mui/material";
import { AddIcon } from "@/icons";

import { AddTestProductModal } from "./add-test-product-modal";
import { profitsState } from "../store/profits";

import { useStyle } from "../style";
import { productTestState } from "@/store/product-test";

const ProductList = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const productTest = useRecoilValue<any>(productTestState);
  console.log("productTest", productTest);
  return (
    <>
      {profitsStateValue?.testProductsState?.length > 0 ? (
        <div style={clasess.mainContainerForProductTable}>
          <div style={clasess.titleHeadersTale}>
            <div style={clasess.titleHederTextStyle}>
              {t("products.profits.itemName")}
            </div>
            <div style={clasess.titleHederTextStyle}>
              {t("products.profits.more")}
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <>
              {profitsStateValue?.testProductsState?.map(
                (item: any, index: any) => {
                  return (
                    <div
                      style={
                        item?.id === productTest?.id
                          ? clasess.bodyTableOddContainer
                          : clasess.bodyTableEvenContainer
                      }
                      onClick={() =>
                        profitsStateValue?.onCklickActionProfitTestResultsByActionId(
                          item?.id
                        )
                      }
                    >
                      <div style={clasess.nameStyle}>{item?.name}</div>
                      <div style={clasess.moreStyle}>{item?.more}</div>
                    </div>
                  );
                }
              )}
            </>
          </div>
          <div
            style={clasess.addNewProductContainer2}
            onClick={() => profitsStateValue.setOpenAddTestProductModal(true)}
          >
            <AddIcon />
            <div style={clasess.addProductStyle}>
              {t("products.profits.addTestProduct")}
            </div>
          </div>
        </div>
      ) : (
        <div style={clasess.noDataContainer}>
          <div
            style={clasess.addNewProductContainer}
            onClick={() => profitsStateValue.setOpenAddTestProductModal(true)}
          >
            <AddIcon />
            <div style={clasess.addProductStyle}>
              {t("products.profits.addTestProduct")}
            </div>
          </div>
        </div>
      )}

      <AddTestProductModal />
    </>
  );
};
export { ProductList };
