import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { addressModalState } from "./address-widget/state";

const useBusinessWidget = ({ values, documentType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isConfirmation, setIsConfirmation] = useState();
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget({ documentType });
  const setOpenModal = useSetRecoilState<boolean>(addressModalState);
  const [purchaseNumber, setPurchaseNumber] = useState(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;
  const isExistReceipt = isReceipt && !router?.query?.isNewCreation;
  const [taxConfirmationNumber, setTaxConfirmationNumber] = useState(values?.taxConfirmationNumber || t("sales.quote.noTaxConfirmationNumber"));
  const isInvoice = documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;

  const [isUpdateTaxNumber, setIsUpdateTaxNumber] = useState<number | null>(null);
  const onBlurTaxNumber = async () => {
    setIsUpdateTaxNumber(null);
  };

  const mappedCustomers = renderOptions().map(customer => ({
    text: customer?.name,
    id: customer?.id,
    ...customer
  }));

  return {
    t,
    router,
    isConfirmation,
    setIsConfirmation,
    renderOptions,
    checkWhatRenderArray,
    setOpenModal,
    purchaseNumber,
    setPurchaseNumber,
    quoteStateValue,
    quoteConfirm,
    isReceipt,
    isExistReceipt,
    taxConfirmationNumber,
    setTaxConfirmationNumber,
    isInvoice,
    isUpdateTaxNumber,
    setIsUpdateTaxNumber,
    onBlurTaxNumber,
    mappedCustomers,
  };
};

export { useBusinessWidget };