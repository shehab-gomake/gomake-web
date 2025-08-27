import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { addressModalState } from "./address-widget/state";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useCustomerDropDownList, useSnackBar } from "@/hooks";
import { Permissions } from "@/components/CheckPermission/enum";
import { CLIENT_TYPE } from "@/pages/customers/enums";

const useBusinessWidget = ({
  values,
  documentType,
  onChangeSelectBusiness,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alertFault } = useSnackBar();

  const [isConfirmation, setIsConfirmation] = useState();
  const isOutgoingPayments = router.query.isOutgoingPayments === "true";

  const isPurchaseDocument =
    documentType === DOCUMENT_TYPE.purchaseOrder ||
    documentType === DOCUMENT_TYPE.purchaseInvoice ||
    documentType === DOCUMENT_TYPE.purchaseInvoiceRefund ||
    isOutgoingPayments;

  const { renderOptions, checkWhatRenderArray, isFetching } =
    useCustomerDropDownList({
      clientType: isPurchaseDocument
        ? CLIENT_TYPE.SUPPLIER
        : CLIENT_TYPE.CUSTOMER,
    });

  const setOpenModal = useSetRecoilState<boolean>(addressModalState);
  const [purchaseNumber, setPurchaseNumber] = useState(
    values?.purchaseNumber || t("sales.quote.noPurchaseNumber")
  );

  const [documentTitle, setDocumentTitle] = useState(
    values?.title || t("sales.quote.noTitle")
  );

  const [quoteStateValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;
  const isQuote = documentType === DOCUMENT_TYPE.quote;
  const isOrder = documentType === DOCUMENT_TYPE.order;
  const isInvoice =
    documentType === DOCUMENT_TYPE.invoice ||
    documentType === DOCUMENT_TYPE.invoiceRefund;
  const isDeliveryNote =
    documentType === DOCUMENT_TYPE.deliveryNote ||
    documentType === DOCUMENT_TYPE.deliveryNoteRefund;

  const isExistReceipt = isReceipt && !router?.query?.isNewCreation;
  const [taxConfirmationNumber, setTaxConfirmationNumber] = useState(
    values?.taxConfirmationNumber || t("sales.quote.noTaxConfirmationNumber")
  );
  const [manuaLInvoiceNum, setManuaLInvoiceNum] = useState(
    values?.manualInvoiceNumber || null
  );

  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [isUpdateTaxNumber, setIsUpdateTaxNumber] = useState<number | null>(
    null
  );
  const [isUpdateManuaLInvoiceNum, setIsUpdateManuaLInvoiceNum] = useState<
    number | null
  >(null);

  const onBlurTaxNumber = async () => {
    setIsUpdateTaxNumber(null);
  };

  const onCustomerAdd = (customer) => {
    setOpenCustomerModal(false);
  };

  const onBlurManualInvoiceNum = async (value) => {
    const updatedQuoteItemValue = { ...quoteStateValue };
    updatedQuoteItemValue.manualInvoiceNumber = value;
    setQuoteItemValue(updatedQuoteItemValue);
    setIsUpdateManuaLInvoiceNum(null);
  };

  const mappedCustomers = renderOptions()?.map((customer) => ({
    text: customer?.name,
    id: customer?.id,
    ...customer,
  }));

  const mappedSuppliers = renderOptions()?.map((supplier) => ({
    text: supplier?.name,
    id: supplier?.id,
    ...supplier,
  }));

  // Basics Conditions
  const { CheckDocumentPermission, CheckPermission } = useUserPermission();
  const isNewCreation = router.query.isNewCreation;
  const isEditable = quoteStateValue?.isEditable;
  const hasEditPermission = CheckDocumentPermission(
    documentType,
    DocumentPermission.EDIT_DOCUMENT
  );

  const hasUpdateAgentPermission = CheckPermission(
    Permissions.UPDATE_DOCUMENT_AGENT
  );

  const canEditDocument = isNewCreation
    ? true
    : isEditable && hasEditPermission;

  const canUpdateAgent = isNewCreation
    ? true
    : isInvoice || isDeliveryNote
    ? hasUpdateAgentPermission
    : isEditable && hasEditPermission;

  const canEditAddress = isNewCreation ? true : hasEditPermission;
  const canEditPurchaseNumber = hasEditPermission;
  const canEditInvoiceNumber = !!isNewCreation;

  const [openChangeClientModal, setOpenChangeClientModal] = useState(false);
  const [
    openChangeClientModalFromInvoice,
    setOpenChangeClientModalFromInvoice,
  ] = useState(false);

  const [selectedClient, setSelectedClient] = useState({});

  const onClickCloseChangeClientModal = () => {
    setOpenChangeClientModal(false);
  };

  const onClickCloseChangeClientModalFromInvoice = () => {
    setOpenChangeClientModalFromInvoice(false);
  };

  const onClickOpenChangeClientModal = (value) => {
    // If the selected client is the same as the current one, do nothing
    if (quoteStateValue?.client?.id === value?.id) {
      return;
    }
    setSelectedClient(value);

    if (
      documentType === DOCUMENT_TYPE.invoice ||
      documentType === DOCUMENT_TYPE.purchaseInvoice
    ) {
      if (
        quoteStateValue?.documentItems &&
        quoteStateValue.documentItems.length > 0
      ) {
        setOpenChangeClientModalFromInvoice(true);
      } else {
        setOpenChangeClientModal(true);
      }
    } else {
      if (!quoteStateValue?.client) {
        onChangeSelectBusiness(value);
        return;
      }
      setOpenChangeClientModal(true);
    }
  };

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
    isDeliveryNote,
    isUpdateTaxNumber,
    setIsUpdateTaxNumber,
    onBlurTaxNumber,
    mappedCustomers,
    mappedSuppliers,
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
    onBlurManualInvoiceNum,
    canEditInvoiceNumber,
    isOrder,
    isQuote,
    documentTitle,
    setDocumentTitle,
    isFetching,
    canEditAddress,
    isPurchaseDocument,
    isOutgoingPayments,
    canUpdateAgent,
    alertFault,
  };
};

export { useBusinessWidget };
