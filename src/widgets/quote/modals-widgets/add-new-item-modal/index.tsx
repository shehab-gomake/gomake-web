import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { quoteItemState } from "@/store";

const AddNewItemModal = ({ openModal, onClose , documentType}) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
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
      `/products/create?clientTypeId=${quoteItemValue?.client?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${selectedProduct?.id}&documentType=${documentType}`
    );
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={onClose}
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
