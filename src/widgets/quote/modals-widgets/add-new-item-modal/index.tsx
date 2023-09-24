import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages/quote/store/quote";
import { useCallback, useEffect, useState } from "react";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { quoteItemState } from "@/store";

const AddNewItemModal = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [productValue, setProductValues] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  useEffect(() => {
    getAllProducts();
  }, []);
  const onClcikCreateQuoteForCustomer = () => {
    navigate(
      `/products/digital-offset-price?clientTypeId=c5f8375b-6e96-42b2-9eb2-4c327b4c03b8&customerId=${quoteItemValue?.customerID}&productId=${selectedProduct?.id}`
    );
  };
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openAddNewItemModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={() => quoteStateValue?.onCloseNewItem()}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.autoComplateRowContainer}>
            <div style={{ width: "100%", marginTop: 15 }}>
              <GoMakeAutoComplate
                options={productValue}
                placeholder={t("home.admin.selectProduct")}
                style={clasess.selectTypeContainer}
                getOptionLabel={(option: any) => option.name}
                onChange={(e: any, value: any) => {
                  setSelectedProduct(value);
                }}
              />
            </div>
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={onClcikCreateQuoteForCustomer}
            >
              {t("sales.quote.add")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewItemModal };
