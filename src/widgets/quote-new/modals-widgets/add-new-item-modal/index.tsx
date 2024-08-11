import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { addItemApi } from "@/services/api-service/generic-doc/documents-api";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useAddNewItem } from "./use-add-new-item";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";

const AddNewItemModal = ({ openModal, onClose, documentType, getQuote }) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const router = useRouter();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const { handleProductChange, combinedData, selectedProduct, addDocumentItemFromMaterial } = useAddNewItem({ onClose, getQuote, documentType });

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

  const { alertFaultAdded } = useSnackBar();

  const addItemForQuotes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
        onClose();
      } else {
        alertFaultAdded();
      }
    };

    await addItemApi(callApi, callBack, {
      item: {
        itemId: router?.query?.Id,
        productId: selectedProduct?.id,
        unitPrice: 0,
        amount: 0,
        jobDetails: "",
      },
      documentType: documentType,
    });
  };

  const onClickCreateQuoteForCustomer = () => {
    if (router.query.isNewCreation) {
      if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
        addDocumentItemFromMaterial()
      }
      else {
        const updatedQuoteItemValue = { ...quoteItemValue };
        const newItem = { ...item, id: uuidv4() };
        updatedQuoteItemValue.documentItems = [
          ...updatedQuoteItemValue.documentItems,
          newItem
        ];
        setQuoteItemValue(updatedQuoteItemValue);
        onClose();
      }
    }
    else {
      if (documentType === DOCUMENT_TYPE.purchaseOrder) {
        if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
          addDocumentItemFromMaterial()
        }
        else
          addItemForQuotes()
      }
      else {
        if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
          addDocumentItemFromMaterial()
        }
        else navigate(
          `/products/create?clientTypeId=${quoteItemValue?.client?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${selectedProduct?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
        );
      }
    }
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "100%", marginTop: 15 }}>
              {/* <GoMakeAutoComplate
                options={productValue}
                placeholder={t("home.admin.selectProduct")}
                style={classes.selectTypeContainer}
                getOptionLabel={(option: any) => option.name}
                onChange={(e: any, value: any) => {
                  setSelectedProduct(value);
                }}
              /> */}
              <GoMakeTreeSelect
                value={selectedProduct}
                options={combinedData}
                onChange={handleProductChange}
                placeholder={t("home.admin.selectProductOrMaterial")}
              />
            </div>
          </div>
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.sendBtn}
              onClick={onClickCreateQuoteForCustomer}
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
