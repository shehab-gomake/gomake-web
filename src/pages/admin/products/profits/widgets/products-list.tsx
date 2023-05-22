import { useRecoilValue } from "recoil";

import { useStyle } from "../style";
import { profitsState } from "../store/profits";
import { AddIcon } from "@/icons";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AddTestProductModal } from "./add-test-product-modal";

const ProductList = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  return (
    <div style={clasess.mainContainerForProductTable}>
      <div style={clasess.titleHeadersTale}>
        <div style={clasess.titleHederTextStyle}>
          {t("products.profits.itemName")}
        </div>
        {/* <div style={clasess.titleHederTextStyle}>
          {t("products.profits.details")}
        </div> */}
        <div style={clasess.titleHederTextStyle}>
          {t("products.profits.more")}
        </div>
      </div>
      <div style={{ width: "100%" }}>
        {profitsStateValue?.testProductsState.length > 0 ? (
          <>
            {profitsStateValue?.testProductsState?.map(
              (item: any, index: any) => {
                return (
                  <div
                    style={
                      index & 1
                        ? clasess.bodyTableEvenContainer
                        : clasess.bodyTableOddContainer
                    }
                  >
                    <div style={clasess.nameStyle}>{item?.name}</div>
                    <div style={clasess.detailsStyle}>{item?.details}</div>
                    <div style={clasess.moreStyle}>{item?.more}</div>
                  </div>
                );
              }
            )}
          </>
        ) : (
          <>
            {!profitsStateValue?.istimeOutForProductsTest ? (
              <>
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={68}
                  style={clasess.skeletonRowStyle}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={68}
                  style={clasess.skeletonRowStyle}
                />
              </>
            ) : (
              <div style={clasess.noDataContainer}> {t("skeleton.noData")}</div>
            )}
          </>
        )}
      </div>
      <div
        style={clasess.addNewProductContainer}
        onClick={() => profitsStateValue.setOpenAddTestProductModal(true)}
      >
        <AddIcon />
        <div style={clasess.addProductStyle}>
          {t("products.profits.addTestProduct")}
        </div>
      </div>
      <AddTestProductModal />
    </div>
  );
};
export { ProductList };
