import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { getAllProductsForDropDownList } from "@/services/hooks";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

const AddNewItemModal = ({ openModal, onClose, documentType }) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const router = useRouter();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [productValue, setProductValues] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  const item = {
    id: uuidv4(),
    code: null,
    details: "",
    price: 0,
    workName: "",
    discount: 0,
    finalPrice: 0,
    quantity: 0,
    productName: selectedProduct?.name,
    isSelected: false,
    productType: 0,
    productID: selectedProduct?.id,
  }
  useEffect(() => {
    getAllProducts();
  }, []);
  const onClcikCreateQuoteForCustomer = () => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const newItem = { ...item, id: uuidv4() };
      updatedQuoteItemValue.documentItems = [
        ...updatedQuoteItemValue.documentItems,
        newItem
      ];
      setQuoteItemValue(updatedQuoteItemValue);
      onClose()
    }
    else {
      navigate(
        `/products/create?clientTypeId=${quoteItemValue?.client?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${selectedProduct?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
      );
    }

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
