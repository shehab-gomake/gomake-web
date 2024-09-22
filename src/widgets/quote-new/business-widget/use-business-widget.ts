import {  useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { addressModalState } from "./address-widget/state";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";

const useBusinessWidget = ({ values, documentType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isConfirmation, setIsConfirmation] = useState();
  const { renderOptions, checkWhatRenderArray } = useQuoteWidget();
  const setOpenModal = useSetRecoilState<boolean>(addressModalState);
  const [purchaseNumber, setPurchaseNumber] = useState(values?.purchaseNumber || t("sales.quote.noPurchaseNumber"));
  const [quoteStateValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;
  const isExistReceipt = isReceipt && !router?.query?.isNewCreation;
  const [taxConfirmationNumber, setTaxConfirmationNumber] = useState(values?.taxConfirmationNumber || t("sales.quote.noTaxConfirmationNumber"));
  const [manuaLInvoiceNum, setManuaLInvoiceNum] = useState(values?.manualInvoiceNumber || null);

  const isInvoice = documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [isUpdateTaxNumber, setIsUpdateTaxNumber] = useState<number | null>(null);
  const [isUpdateManuaLInvoiceNum, setIsUpdateManuaLInvoiceNum] = useState<number | null>(null);

  const onBlurTaxNumber = async () => {
    setIsUpdateTaxNumber(null);
  };
  const onCustomerAdd=(customer)=>{
    setOpenCustomerModal(false)
  }
  const onBlurManualInvoiceNum = async () => {
    setIsUpdateManuaLInvoiceNum(null);
  };
  const mappedCustomers = renderOptions().map(customer => ({
    text: customer?.name,
    id: customer?.id,
    ...customer
  }));

  const {CheckDocumentPermission } = useUserPermission();
  const canEditDocument = router.query.isNewCreation ? true  : 
  quoteStateValue?.isEditable && CheckDocumentPermission(documentType, DocumentPermission.EDIT_DOCUMENT);
  const canEditPurchaseNumber = CheckDocumentPermission(documentType, DocumentPermission.EDIT_DOCUMENT);



  const [openChangeClientModal, setOpenChangeClientModal] = useState(false);
  const [openChangeClientModalFromInvoice, setOpenChangeClientModalFromInvoice] = useState(false)

  const [selectedClient, setSelectedClient] = useState({})

  const onClickCloseChangeClientModal = () => {
    setOpenChangeClientModal(false);
  }

  const onClickCloseChangeClientModalFromInvoice = () => {
    setOpenChangeClientModalFromInvoice(false);
  }

  const onClickOpenChangeClientModal = (value) => {
    setSelectedClient(value)
    if (router.query.orderId && documentType === DOCUMENT_TYPE.invoice)
      setOpenChangeClientModalFromInvoice(true)
    else
      setOpenChangeClientModal(true);
  }

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
    openCustomerModal, 
    setOpenCustomerModal,
    customer, 
    setCustomer,
    onCustomerAdd,
    canEditDocument,
    canEditPurchaseNumber,
    setQuoteItemValue,
    onClickOpenChangeClientModal,
    onClickCloseChangeClientModal,
    onClickCloseChangeClientModalFromInvoice,
    openChangeClientModalFromInvoice,
    openChangeClientModal,
    selectedClient,
    manuaLInvoiceNum,
    setManuaLInvoiceNum,
    isUpdateManuaLInvoiceNum,
    setIsUpdateManuaLInvoiceNum,
    onBlurManualInvoiceNum
  };
};

export { useBusinessWidget };