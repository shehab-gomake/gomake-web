import { useCallback, useEffect, useRef, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getAndSetAllEmployees } from "@/services/hooks";
import { v4 as uuidv4 } from "uuid";
import {
  IContactData,
  agentListsState,
  clientContactsState,
  loadingWithShadowState,
  quoteConfirmationState,
  quoteItemState,
  openReceiptCreationModalState,
  systemVATState,
  selectedFirstMaterialState,
} from "@/store";
import { useQuoteGetData } from "./use-quote-get-data";
import {
  acceptDocumentApi,
  addDeliveryApi,
  addDocumentContactApi,
  calculateDocumentApi,
  calculateDocumentItemApi,
  cancelDocumentApi,
  changeDocumentClientApi,
  createDocumentApi,
  deleteDeliveryItemApi,
  deleteDocumentAddressApi,
  deleteDocumentContactApi,
  deleteDocumentItemApi,
  duplicateWithAnotherQuantityApi,
  getAllClientActiveBudgetsApi,
  getDocumentDeliveryDateApi,
  getWhatsAppMessageApi,
  getWhatsAppMessageForReceiptApi,
  moveOrderToReadyApi,
  reCalculateItemApi,
  refreshExchangeRateApi,
  rejectDocumentApi,
  removeDraftDocumentApi,
  saveDocumentApi,
  saveDraftDocumentApi,
  sendDocumentToClientApi,
  sendReceiptToClientApi,
  sortDocumentItemsApi,
  updateAgentApi,
  updateDiscountTypeApi,
  updateDocuementItemSelectApi,
  updateDocumentContactApi,
  updateDocumentCurrencyApi,
  updateDocumentPreferenceApi,
  updateDocumentTitleApi,
  updateDocumentVatStatusApi,
  updateDueDateApi,
  updateExchangeRateApi,
  updateOccasionalClientNameApi,
  updatePurchaseNumberApi,
  updateQuoteItemQuantityApi,
} from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";
import {
  getAllCreditTransactionsApi,
  getClientPaymentItemsApi,
} from "@/services/api-service/generic-doc/receipts-api";
import {
  checkedItemsIdsState,
  creditTransactionsState,
  transactionOptionsData,
} from "@/widgets/quote-new/buttons-container/states";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { isSelectedCLoseAsDeliveryNoteState } from "@/pages/customers/customer-states";
import {
  checkArrayNotEmptyOrEmailNotEmpty,
  checkArrayNotEmptyOrPhoneNotEmpty,
  isAtLeastOneSelected,
} from "@/utils/helpers";
import { useWhatsAppWeb } from "@/pages-components/quote-new/use-whats-app-web";
import { EAddressType } from "@/widgets/quote-new/business-widget/address-widget/state";
import { ClientChangeSource } from "./store/quote";
import { validateDocument } from "@/utils/validators";
import { EnumVATStatus } from "@/enums/accounting-enums";
import { useClientTypesList } from "@/hooks/use-client-types";
import { useModal } from "@/hooks/use-modal";
import { printHouseProfile } from "@/store/print-house-profile";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { useDocumentTitle } from "@/pages-components/quote-new/use-document-title";
import cloneDeep from "lodash.clonedeep";
import { Button } from "@mui/material";
import { PlusIcon } from "../quotes/widgets/icons/header-section-icons";
import { useStyle } from "./style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ShowDocumentDetailsEnum, ShowPricesEnum } from "@/enums";

export enum MessageType {
  Email = 0,
  SMS = 1,
  Both = 2,
}

interface IQuoteProps {
  docType: DOCUMENT_TYPE;
  isQuoteConfirmation?: boolean;
  isPrePaymentPage?: boolean;
}
const useQuoteNew = ({
  docType,
  isQuoteConfirmation = false,
  isPrePaymentPage = false,
}: IQuoteProps) => {
  const documentPath = DOCUMENT_TYPE[docType];
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { classes } = useStyle(false);

  const {
    alertSuccessUpdate,
    alertFaultUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessDelete,
    alertFaultDelete,
    alertFault,
    alertSuccessSend,
    alertFaultSend,
    alertWarning,
  } = useSnackBar();
  const systemVAT = useRecoilValue<number>(systemVATState);
  const AddCustomerModal = useModal();

  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { primaryColor } = useGomakeTheme();
  const { openWhatsAppWebLink } = useWhatsAppWeb();
  const { navigate } = useGomakeRouter();
  const { getQuote, getAllClientContacts } = useQuoteGetData(docType);
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(
    quoteConfirmationState
  );
  const [openReceiptCreationModal, setOpenReceiptCreationModal] =
    useRecoilState(openReceiptCreationModalState);

  const isOutgoingPayments = router.query.isOutgoingPayments === "true";
  const isSupplierPayments = docType === DOCUMENT_TYPE.supplierPayments;
  const isPurchaseOrder = docType === DOCUMENT_TYPE.purchaseOrder;
  const isPurchaseInvoice = docType === DOCUMENT_TYPE.purchaseInvoice;
  const isPurchaseInvoiceRefund =
    docType === DOCUMENT_TYPE.purchaseInvoiceRefund;

  const isPurchaseDocument =
    isPurchaseOrder ||
    isPurchaseInvoice ||
    isPurchaseInvoiceRefund ||
    isSupplierPayments ||
    isOutgoingPayments;

  const [creationDate, setCreationDate] = useState(
    isQuoteConfirmation
      ? quoteConfirm?.creationDate
      : quoteItemValue?.creationDate
  );
  const [taxDate, setTaxDate] = useState(
    isQuoteConfirmation ? quoteConfirm?.taxDate : quoteItemValue?.taxDate
  );

  const [selectDate, setSelectDate] = useState<string | null>(null); // Represents the Delivery Date for Quotes and Orders, and the Due Date for other documents

  // const [selectDate, setSelectDate] = useState(
  //   isQuoteConfirmation ? quoteConfirm?.dueDate : quoteItemValue?.dueDate
  // );

  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<
    number | null
  >(null);
  const [isUpdatePurchaseNumber, setIsUpdatePurchaseNumber] = useState<
    number | null
  >(null);
  const [isUpdateDocumentTitle, setIsUpdateDocumentTitle] = useState<
    number | null
  >(null);
  const [isUpdateClientName, setIsUpdateClientName] = useState<number | null>(
    null
  );
  const [clientName, setClientName] = useState(
    quoteItemValue?.occasionalClientName
  );

  const [isUpdateExchangeRate, setIsUpdateExchangeRate] = useState<
    number | null
  >(null);

  const [isUpdateCurrency, setIsUpdateCurrency] = useState<string>(null);
  const [isUpdateVatStatus, setIsUpdateVatStatus] = useState<number | null>(
    null
  );
  const [, setIsUpdateBusinessCode] = useState<number | null>(null);
  const [isUpdateAddress, setIsUpdateAddress] = useState<number | null>(null);
  const [isUpdateAgent, setIsUpdateAgent] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const [agentListValue, setAgentListValue] =
    useRecoilState<{ text: string; value: string }[]>(agentListsState);
  const [isDisplayWidget, setIsDisplayWidget] = useState(false);
  const [items, setItems] = useState([]);
  const [reasonText, setReasonText] = useState("");
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);
  const [isUpdateContactName1, setIsUpdateContactName1] = useState(null);
  const [isUpdateContactEmail1, setIsUpdateContactEmail1] = useState(null);
  const [isUpdateContactMobile1, setIsUpdateContactMobile1] = useState(null);
  const [clientContactsValue, setClientContactsValue] =
    useRecoilState<IContactData[]>(clientContactsState);
  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
  const [openAddNewItemModal, setOpenAddNewItemModal] = useState(false);
  const [openAddNewContactModal, setOpenAddNewContactModal] = useState(false);
  const [openCopyFromOrderModal, setOpenCopyFromOrderModal] = useState(false);
  const [quoteItemId, setQuateItemId] = useState();
  const [quoteItem, setQuoteItem] = useState();
  const [
    openDuplicateWithDifferentQTYModal,
    setOpenDuplicateWithDifferentQTYModal,
  ] = useState(false);
  const [isAddQuantity, setIsAddQuantity] = useState(false);

  const [openQuickDuplicateModal, setOpenQuickDuplicateModal] = useState(false);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [amountValue, setAmountValue] = useState();
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
  const [documentItems, setPriceListItems] = useState<any>([]);
  const [quoteItems, setQuoteItems] = useState<any>([]);
  const [anchorElCancelBtn, setAnchorElCancelBtn] =
    useState<null | HTMLElement>(null);
  const [anchorElSendBtn, setAnchorElSendBtn] = useState<null | HTMLElement>(
    null
  );
  const [anchorElSettingMenu, setAnchorElSettingMenu] =
    useState<null | HTMLElement>(null);
  const [anchorElSettingMenuForVat, setAnchorElSettingMenuForVat] =
    useState<null | HTMLElement>(null);
  const [displayedItems, setDisplayedItems] = useState<number>(2);
  const openSendBtn = Boolean(anchorElSendBtn);
  const openCancelBtn = Boolean(anchorElCancelBtn);
  const openSettingMenu = Boolean(anchorElSettingMenu);
  const openNewSttingMenuForVat = Boolean(anchorElSettingMenuForVat);
  const isQuote = docType === DOCUMENT_TYPE.quote;
  const isOrder = docType === DOCUMENT_TYPE.order;
  const isDeliveryNote =
    docType === DOCUMENT_TYPE.deliveryNote ||
    docType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice =
    docType === DOCUMENT_TYPE.invoice ||
    docType === DOCUMENT_TYPE.invoiceRefund;
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isNewCreation = router.query.isNewCreation === "true";

  const [openWhatsAppModal, setOpenWatsAppModal] = useState(false);
  const [isSelectedAtLeastOne, setIsSelectedAtLeastOne] = useState(null);
  const [openNewItemNotesModal, setOpenNewItemNotesModal] = useState(false);
  const [openRelatedDocumentsModal, setOpenRelatedDocumentsModal] =
    useState(false);
  const [openInvoiceCreationModal, setOpenInvoiceCreationModal] =
    useState(false);

  const onClickOpenInvoiceCreation = () => {
    setOpenInvoiceCreationModal(true);
  };
  const onClickCloseInvoiceCreation = () => {
    setOpenInvoiceCreationModal(false);
  };

  const onClickOpenRelatedDocumentsModal = () => {
    setOpenRelatedDocumentsModal(true);
  };
  const onClickCloseRelatedDocumentsModal = () => {
    setOpenRelatedDocumentsModal(false);
  };

  const onClickOpenNewItemNotesModal = () => {
    setOpenNewItemNotesModal(true);
  };
  const onClickCloseNewItemNotesModal = () => {
    setOpenNewItemNotesModal(false);
  };

  useEffect(() => {
    if (
      quoteItemValue?.client?.newItemNotes &&
      quoteItemValue?.client?.newItemNotes.trim() !== "" &&
      quoteItemValue?.client?.newItemNotes.trim() !== null &&
      docType === DOCUMENT_TYPE.quote
    ) {
      onClickOpenNewItemNotesModal();
    }
  }, [quoteItemValue]);

  useEffect(() => {
    const data = isAtLeastOneSelected(quoteItemValue?.documentItems);
    setIsSelectedAtLeastOne(data);
  }, [quoteItemValue]);

  const onClickOpenWhatsAppModal = (includeInvoices = false) => {
    setSendWithInvoices(includeInvoices);
    setOpenWatsAppModal(true);
  };
  const onClickCloseWhatsAppModal = () => {
    setSendWithInvoices(false);
    setOpenWatsAppModal(false);
  };

  const handleSettingMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSettingMenu(event.currentTarget);
  };
  const handleSettingMenuClose = () => {
    setAnchorElSettingMenu(null);
  };
  const handleSettingMenuClickForVat = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElSettingMenuForVat(event.currentTarget);
  };
  const handleSettingMenuCloseForVat = () => {
    setAnchorElSettingMenuForVat(null);
  };
  const handleCancelBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCancelBtn(event.currentTarget);
  };
  const handleCancelBtnClose = () => {
    setAnchorElCancelBtn(null);
  };

  const handleSendBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSendBtn(event.currentTarget);
  };

  const handleSendBtnClose = () => {
    setAnchorElSendBtn(null);
  };

  const [openAddDeliveryModal, setOpenAddDeliveryModal] = useState(false);
  const [openUpdateDeliveryModal, setOpenUpdateDeliveryModal] = useState(false);
  const [openAddAttachmentsModal, setOpenAddAttachmentsModal] = useState(false);
  const [openAddAttachmentsPurchaseModal, setOpenAddAttachmentsPurchaseModal] = useState(false);
  const [openDeleteDeliveryModal, setOpenDeleteDeliveryModal] = useState(false);
  const onClickOpenDeleteDeliveryModal = () => {
    setOpenDeleteDeliveryModal(true);
  };
  const onClickCloseDeleteDeliveryModal = () => {
    setOpenDeleteDeliveryModal(false);
  };
  const onOpenAddAttachmentsModal = () => {
    setOpenAddAttachmentsModal(true);
  };

  const onCloseAddAttachmentsModal = () => {
    setOpenAddAttachmentsModal(false);
  };
  const onOpenAddAttachmentsPurchaseModal = () => {
    setOpenAddAttachmentsPurchaseModal(true);
  };
  const onCloseAddAttachmentsPurchaseModal = () => {
    setOpenAddAttachmentsPurchaseModal(false);
  };
  const onOpenDeliveryModal = () => {
    setOpenAddDeliveryModal(true);
  };
  const onCloseDeliveryModal = () => {
    setOpenAddDeliveryModal(false);
  };

  const onOpenUpdateDeliveryModal = () => {
    setOpenUpdateDeliveryModal(true);
  };
  const onCloseUpdateDeliveryModal = () => {
    setOpenUpdateDeliveryModal(false);
  };

  const [isOpenRelatedDocuments, setIsOpenRelatedDocuments] = useState(true);
  const [isMoveToReady, setIsMoveToReady] = useState(false);
  const [moveToReadyOption, setMoveToReadyOption] = useState<
    "withMessage" | "withoutMessage"
  >("withoutMessage");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoveToReadyOption(
      event.target.value as "withMessage" | "withoutMessage"
    );
  };

  const handleCheckboxChange = () => {
    const newValue = !isMoveToReady;
    setIsMoveToReady(newValue);

    if (newValue) {
      setMoveToReadyOption("withoutMessage"); // default to "without message" when checked
    }
  };

  const [openChangeProductionStatusModal, setOpenChangeProductionStatusModal] =
    useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>({});
  const isSelectedCLoseAsDeliveryNote = useRecoilValue(
    isSelectedCLoseAsDeliveryNoteState
  );
  const onClickCloseChangeProductionStatusModal = () => {
    setOpenChangeProductionStatusModal(false);
    setIsMoveToReady(false);
  };
  const onClickOpenChangeProductionStatusModal = (order) => {
    setSelectedDocument(order);
    setOpenChangeProductionStatusModal(true);
  };
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const source = isQuoteConfirmation ? quoteConfirm : quoteItemValue;
  const showDetails =
    source?.showDetails !== ShowDocumentDetailsEnum.HideDetails;

  const showPrices = source?.showPrices !== ShowPricesEnum.HidePrices;

  const tableHeaders = [
    "#",
    isDeliveryNote || isInvoice ? t("products.profits.documentNumber") : null,
    !CheckPreferenceValue(EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART) &&
    t("sales.quote.itemCode"),
    !CheckPreferenceValue(EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART) &&
    t("products.profits.itemName"),
    CheckPreferenceValue(EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART) &&
    t("products.profits.itemName"),
    showDetails ? t("products.profits.details") : null,
    t("sales.quote.amount"),
    showPrices ? t("products.profits.pricingListWidget.unitPrice") : null,
    showPrices ? t("sales.quote.discount") : null,
    showPrices ? t("products.offsetPrice.admin.finalPrice") : null,
    t("products.profits.more"),
  ].filter(Boolean);

  const columnWidths = [
    "5%", // "#"
    isDeliveryNote || isInvoice ? "10%" : null, // Document Number
    !CheckPreferenceValue(EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART)
      ? "10%"
      : null, // Item Code
    "12%", // Item Name
    source?.showDetails === ShowDocumentDetailsEnum.All
      ? "25%"
      : source?.showDetails === ShowDocumentDetailsEnum.ShowJobNameOnly
        ? "10%"
        : null, // Details column (optional)
    "10%", // Amount
    showPrices ? "10%" : null, // Unit Price
    showPrices ? "10%" : null, // Discount
    showPrices ? "10%" : null, // Final Price
    "8%", // More
  ].filter(Boolean);

  // const columnWidths = ["5%", "10%", "12%", "25%", "10%", "10%", "10%", "10%"];
  const headerHeight = "44px";

  const updateDueDate = async () => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.dueDate = selectDate;
      updatedQuoteItemValue.taxDate = taxDate;
      updatedQuoteItemValue.creationDate = creationDate;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessAdded();
          getQuote();
        } else {
          alertFaultAdded();
          setSelectDate(quoteItemValue?.dueDate);
          // setCreationDate(quoteItemValue?.creationDate)
          // setTaxDate(quoteItemValue?.taxDate)
        }
      };
      await updateDueDateApi(callApi, callBack, {
        DocumentType: docType,
        Date: {
          documentId: quoteItemValue?.id,
          dueDate: selectDate,
        },
      });
    }
  };

  const getQuoteDeliveryDate = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setSelectDate(res?.data ?? null);
      }
    };

    await getDocumentDeliveryDateApi(callApi, callBack);
  };

  const updateOccasionalClientName = async (value) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.occasionalClientName = value;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
        } else {
          alertFaultUpdate();
        }
      };

      await updateOccasionalClientNameApi(callApi, callBack, {
        documentType: docType,
        document: {
          documentId: quoteItemValue?.id,
          occasionalClientName: clientName,
        },
      });
    }
  };

  const onBlurTitle = async (value) => {
    updateDocumentTitle(value);
    setIsUpdateDocumentTitle(null);
  };

  const onBlurClientName = async (value) => {
    updateOccasionalClientName(value);
    setIsUpdateClientName(null);
  };

  const onBlurBusinessCode = async () => {
    setIsUpdateBusinessCode(null);
  };

  const onBlurAddress = async () => {
    setIsUpdateAddress(null);
  };

  const onBlurAgent = async () => {
    setIsUpdateAgent(null);
  };

  const onBlurBusinessName = async () => {
    setIsUpdateBusinessName(null);
  };

  const onBlurExchangeRate = async (value: number) => {
    updateExchangeRate(value);
    setIsUpdateExchangeRate(null);
  };

  const onBlurCurrency = async () => {
    setIsUpdateCurrency(null);
  };

  const onBlurVatStatus = async () => {
    setIsUpdateVatStatus(null);
  };

  const getAllEmployees = useCallback(async () => {
    await getAndSetAllEmployees(callApi, setAgentListValue, {
      isAgent: true,
    });
  }, []);

  const updateAgent = async (item: any) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.agentId = item.value;
      updatedQuoteItemValue.agent = {
        firstname: item?.text,
        id: item?.value,
        lastname: item?.text,
      };
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateAgent(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await updateAgentApi(callApi, callBack, {
        documentType: docType,
        document: {
          documentId: quoteItemValue?.id,
          agentId: item?.value,
        },
      });
    }
  };

  const updateExchangeRate = async (value: number) => {
    if (docType === DOCUMENT_TYPE.receipt && isNewCreation) {
      updateCurrency(quoteItemValue.currency, value).then();
      return;
    }

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateExchangeRate(null);
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await updateExchangeRateApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        exchangeRate: value,
      },
    });
  };

  const refreshExchangeRate = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await refreshExchangeRateApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      },
    });
  };

  const updateCurrency = async (
    currency: string,
    exchangeRate: number = null
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateCurrency(null);
        if (!isNewCreation) getQuote();
      } else {
        alertFaultUpdate();
      }
    };

    const callBackIsNewReceipt = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateCurrency(null);
        const newData = res.data;
        const updatedQuoteItemValue = cloneDeep(quoteItemValue);
        updatedQuoteItemValue.currency = newData.currency;
        updatedQuoteItemValue.systemCurrency = newData.systemCurrency;
        updatedQuoteItemValue.exchangeRate = newData.exchangeRate;
        for (let i = 0; i < updatedQuoteItemValue.receiptItems.length; i++) {
          const newItem = newData.receiptItems.find(
            (ri) =>
              ri.docEntry === updatedQuoteItemValue.receiptItems[i].docEntry &&
              ri.docLine === updatedQuoteItemValue.receiptItems[i].docLine
          );
          if (newItem != null) {
            updatedQuoteItemValue.receiptItems[i].sumApplied =
              newItem.sumApplied;
          }
        }

        setQuoteItemValue(updatedQuoteItemValue);
      } else {
        alertFaultUpdate();
      }
    };

    if (isReceipt && isNewCreation) {
      await getClientPaymentItemsApi(
        callApi,
        callBackIsNewReceipt,
        {
          clientId: quoteItemValue?.customerID,
          documentNumber: router?.query?.documentNumber,
          currency: currency,
          exchangeRate: exchangeRate,
        },
        false
      );
    } else if ((isInvoice || isDeliveryNote) && isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.fromCurrency = quoteItemValue.currency;
      updatedQuoteItemValue.currency = currency;

      setQuoteItemValue(updatedQuoteItemValue);
      setIsUpdateCurrency(null);

      // if (
      //   !quoteItemValue?.documentItems ||
      //   quoteItemValue.documentItems.length === 0
      // ) {
      //   return; // Skip the API call
      // }

      getCalculateQuoteItem(
        updatedQuoteItemValue,
        4,
        quoteItemValue.price,
        updatedQuoteItemValue
      );
    } else {
      await updateDocumentCurrencyApi(callApi, callBack, {
        documentType: docType,
        document: {
          documentId: quoteItemValue?.id,
          currency: currency,
        },
      });
    }
  };

  const changeVatValueForVatStatus = (vatStatus: number) => {
    switch (vatStatus) {
      case EnumVATStatus.MustXPercents:
        return systemVAT;
      case EnumVATStatus.Exempt:
        return 0;
      default:
        return 0.18;
    }
  };

  const updateVatStatus = async (vatStatus: number) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.vatStatus = vatStatus;
      updatedQuoteItemValue.vat = changeVatValueForVatStatus(vatStatus);
      setQuoteItemValue(updatedQuoteItemValue);
      setIsUpdateVatStatus(null);
      getCalculateQuoteItem(
        updatedQuoteItemValue,
        2,
        quoteItemValue.discount,
        updatedQuoteItemValue
      );
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateVatStatus(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await updateDocumentVatStatusApi(callApi, callBack, {
        documentType: docType,
        document: {
          documentId: quoteItemValue?.id,
          vatStatus: vatStatus,
        },
      });
    }
  };

  const updateDocumentTitle = async (value: string) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.title = value;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateDocumentTitle(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await updateDocumentTitleApi(callApi, callBack, {
        documentType: docType,
        document: {
          documentId: quoteItemValue?.id,
          title: value,
        },
      });
    }
  };

  const alertExistPurchaseNumber = useModal();

  const [originalPurchaseNumber, setOriginalPurchaseNumber] = useState(null);
  const [pendingPurchaseNumber, setPendingPurchaseNumber] = useState(null);

  const onBlurPurchaseNumber = async (value) => {
    await updatePurchaseNumber(value);
    setIsUpdatePurchaseNumber(null);
  };

  const updatePurchaseNumber = async (value: string, forceUpdate = false) => {
    if (isNewCreation) {
      setQuoteItemValue({ ...quoteItemValue, purchaseNumber: value });
      return;
    }
    const originalValue = Number(quoteItemValue?.purchaseNumber);

    if (!forceUpdate) {
      setOriginalPurchaseNumber(originalValue);
      setPendingPurchaseNumber(value);
    }

    const callBack = (res) => {
      if (res?.success) {
        if (res?.data === false && !forceUpdate) {
          alertExistPurchaseNumber.open();
        } else {
          alertSuccessUpdate();
          setIsUpdatePurchaseNumber(null);
          getQuote();
        }
      } else {
        alertFaultUpdate();
        setQuoteItemValue({ ...quoteItemValue, purchaseNumber: originalValue });
      }
    };

    await updatePurchaseNumberApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        purchaseNumber: value,
        ...(forceUpdate && { forceUpdate: true }),
      },
    });
  };

  useEffect(() => {
    if (
      router?.query?.isNewCreation &&
      docType === DOCUMENT_TYPE.receipt &&
      router?.query?.documentNumber &&
      router?.query?.ClientId
    ) {
      const clientId = { id: router.query.ClientId };
      onChangeSelectBusiness(clientId);
    }
  }, []);

  const [routerChangedFromClientSelect, setRouterChangedFromClientSelect] =
    useState(false);

  const onChangeSelectBusiness = async (
    item: any,
    clientChangeSource: ClientChangeSource = ClientChangeSource.REGULAR_CHANGE,
    prevDocumentItem: any | null = null //in case we change client and click "save and change client"
  ) => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
      setLoadingWithShadow(true);
      const callBack = (res) => {
        setLoadingWithShadow(false);
        if (res?.success) {
          const _data = res?.data || {};
          if (
            router?.query?.isNewCreation &&
            router?.query?.documentNumber &&
            router?.query?.ClientId
          ) {
            const documentNumber = router.query.documentNumber;
            if (documentNumber) {
              const foundRow = _data?.receiptItems?.find(
                (row) => row.docNum === documentNumber
              );
              if (foundRow) {
                foundRow.isChecked = true;
              } else {
                // When changing the client from the page, we need to reset the router after changing from the payment button on the invoice cart page.
                const { documentNumber, ClientId, ...newQuery } = router.query;
                router.replace(
                  {
                    pathname: router.pathname,
                    query: { ...newQuery },
                  },
                  undefined,
                  { shallow: true }
                );
                setRouterChangedFromClientSelect(true);
              }
            }
          }
          setQuoteItemValue(_data);
          setIsUpdateBusinessName(null);
        } else {
          alertFaultAdded();
        }
        getAllCreditCardTransactions(item?.id);
      };
      await getClientPaymentItemsApi(
        callApi,
        callBack,
        { clientId: item?.id, documentNumber: router?.query?.documentNumber },
        false
      );
    } else if (router?.query?.isNewCreation) {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/get-new-document-data`,
        {
          documentType: docType,
          clientId: item?.id,
          ...(router?.query?.budgetId
            ? { budgetId: router.query.budgetId }
            : {}),
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.result || {};

        if (clientChangeSource === ClientChangeSource.SAVE_AND_START_NEW_DOC) {
          const {
            orderId,
            deliveryNoteId,
            documentId,
            documentToDuplicateId,
            ...newQuery
          } = router.query;

          router.replace(
            {
              pathname: router.pathname,
              query: { ...newQuery },
            },
            undefined,
            { shallow: true }
          );

          setRouterChangedFromClientSelect(true);
        }
        if (
          clientChangeSource === ClientChangeSource.SAVE_AND_CHANGE_CLIENT &&
          prevDocumentItem
        ) {
          setQuoteItemValue({
            ..._data,
            documentItems: prevDocumentItem?.documentItems,
            totalPrice: prevDocumentItem?.totalPrice,
            totalPayment: prevDocumentItem?.totalPayment,
            discount: prevDocumentItem?.discount,
            discountAmount: prevDocumentItem?.discountAmount,
            totalVAT: prevDocumentItem?.totalVAT,
          });
        } else {
          setQuoteItemValue(_data);
        }
        setIsUpdateBusinessName(null);
      } else {
        alertFaultAdded();
      }
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateBusinessName(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await changeDocumentClientApi(callApi, callBack, {
        documentType: docType,
        client: {
          documentID: quoteItemValue?.id,
          clientId: item?.id,
        },
      });
    }
  };

  const onBlurContactName = async () => {
    setIsUpdateContactName(null);
    //  setIsDisplayWidget(false);
  };

  const onBlurContactEmail = async () => {
    setIsUpdateContactEmail(null);
  };

  const onBlurContactMobile = async () => {
    setIsUpdateContactMobile(null);
  };

  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };

  const onClickAddNewContact = async () => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      if (!Array.isArray(updatedQuoteItemValue.documentContacts)) {
        updatedQuoteItemValue.documentContacts = [];
      }
      const newContact = {
        id: uuidv4(),
        contactID: selectedContactById?.id,
        contactName: selectedContactById?.name,
        contactMail: selectedContactById?.mail,
        contactPhone: selectedContactById?.phone,
        documentID: quoteItemValue?.id,
      };
      updatedQuoteItemValue.documentContacts = [
        ...updatedQuoteItemValue.documentContacts,
        newContact,
      ];
      setQuoteItemValue(updatedQuoteItemValue);
      setIsDisplayWidget(false);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessAdded();
          setIsDisplayWidget(false);
          getQuote();
        } else {
          alertFaultAdded();
        }
      };
      await addDocumentContactApi(callApi, callBack, {
        documentType: docType,
        contact: {
          contactID: selectedContactById?.id,
          contactName: selectedContactById?.name,
          contactMail: selectedContactById?.mail,
          contactPhone: selectedContactById?.phone,
          documentID: quoteItemValue?.id,
        },
      });
    }
  };

  const updateClientContact = async (item: any) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedContacts = updatedQuoteItemValue.documentContacts.map(
        (contact: any) => {
          if (contact.id === item.id) {
            return item;
          }
          return contact;
        }
      );

      updatedQuoteItemValue.documentContacts = updatedContacts;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateContactEmail(null);
          setIsUpdateContactName(null);
          setIsUpdateContactMobile(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await updateDocumentContactApi(callApi, callBack, {
        documentType: docType,
        contact: {
          id: item?.id,
          contactID: item?.contactID,
          contactName: item?.contactName,
          contactMail: item?.contactMail,
          contactPhone: item?.contactPhone,
          documentID: quoteItemValue?.id,
        },
      });
    }
  };

  const onClickDeleteContact = async (item: any) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedContacts = updatedQuoteItemValue.documentContacts.filter(
        (contact: any) => {
          return contact.id !== item.id;
        }
      );
      updatedQuoteItemValue.documentContacts = updatedContacts;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          onCloseDeleteModalContact();
          getQuote();
        } else {
          alertFaultDelete();
        }
      };
      await deleteDocumentContactApi(callApi, callBack, {
        documentType: docType,
        documentContactId: item?.id,
      });
    }
  };

  const contactsListRef = useRef<HTMLDivElement>(null);

  const handleShowMore = () => {
    setDisplayedItems(items.length); // or whatever logic you have
    setTimeout(() => {
      contactsListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100); // small timeout to allow the new items to render
  };

  const handleShowLess = () => {
    setDisplayedItems(2);
  };

  const onChangeUpdateClientContact = useCallback(
    (filedName: string, value: any) => {
      setSelectedContactById((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [selectedContactById]
  );

  const onInputChangeMail = (v: any) => {
    onChangeUpdateClientContact("mail", v);
  };

  const onInputChangePhone = (v: any) => {
    onChangeUpdateClientContact("phone", v);
  };

  const onOpenDeleteModalContact = (item) => {
    setSelectedContact(item);
    setOpenDeleteModalContact(true);
  };
  const onCloseDeleteModalContact = () => {
    setOpenDeleteModalContact(false);
  };

  const onOpenNewItem = () => {
    setOpenAddNewItemModal(true);
  };
  const onOpenNewContact = () => {
    setOpenAddNewContactModal(true);
  };
  const onCloseCopyFromOrder = () => {
    setOpenCopyFromOrderModal(false);
  };

  const [copyFromDocumentType, setCopyFromDocumentType] =
    useState<DOCUMENT_TYPE>();

  const onOpenCopyFromOrder = (documentNum: DOCUMENT_TYPE) => {
    setCopyFromDocumentType(documentNum);
    setOpenCopyFromOrderModal(true);
  };

  const onCloseNewItem = () => {
    setOpenAddNewItemModal(false);
  };
  const onCloseNewContact = () => {
    setOpenAddNewContactModal(false);
  };
  const [selectedFirstMaterial, setSelectedFirstMaterial] = useRecoilState<any>(
    selectedFirstMaterialState
  );
  const getCalculateQuoteItem = async (
    quoteItem: any,
    calculationType: number,
    data: number,
    newUpdatedQuoteItemValue?: any,
    isPrintHouseMaterialItem?: boolean
  ) => {
    if (isNewCreation) {
      const newQuoteItemValue = newUpdatedQuoteItemValue ?? quoteItemValue;
      const quoteItemEdit = newQuoteItemValue.documentItems.find(
        (item) => item.id === quoteItem.id
      );
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/calculate-item`,
        {
          documentType: docType,
          document: {
            exchangeRate:
              newQuoteItemValue?.exchangeRate == 0
                ? 1
                : newQuoteItemValue?.exchangeRate,
            price: quoteItem?.price,
            discount: quoteItem?.discount,
            isPrintHouseMaterialItem:
              quoteItem?.printHouseMaterialId &&
                (isPrintHouseMaterialItem || selectedFirstMaterial)
                ? true
                : false,
            finalPrice: quoteItemEdit?.finalPrice,
            quantity: quoteItem?.quantity,
            roundPrices: newQuoteItemValue?.client?.roundPrices,
            document: {
              totalPrice: newQuoteItemValue?.totalPrice,
              totalPriceAfterDiscount:
                newQuoteItemValue?.totalPriceAfterDiscount,
              discount: +newQuoteItemValue?.discount,
              discountAmount: newQuoteItemValue?.discountAmount,
              totalPayment: newQuoteItemValue?.totalPayment,
              vat: newQuoteItemValue?.vat,
              vatStatus: newQuoteItemValue?.vatStatus,
              totalVAT: newQuoteItemValue?.totalVAT,
            },
            data: data,
            calculationType: calculationType,
            currency: newQuoteItemValue?.currency,
            fromCurrency: newQuoteItemValue?.fromCurrency,
          },
        },
        false
      );
      if (res?.success) {
        const _data = res?.data?.data?.data;
        // if is request to change the currency in document in creation mode just multiple the prices with exchange rate
        if (calculationType === 4) {
          let exchangeRate = _data.exchangeRate;
          const updatedQuoteItemValue = {
            ...newQuoteItemValue,
            discount: _data?.document?.discount,
            discountAmount: _data?.document?.discountAmount,
            totalPayment: _data?.document?.totalPayment,
            totalPrice: _data?.document?.totalPrice,
            totalPriceAfterDiscount: _data?.document?.totalPriceAfterDiscount,
            totalVAT: _data?.document?.totalVAT,
            vat: _data?.document?.vat,
            exchangeRate,
            documentItems: newQuoteItemValue.documentItems.map(
              (documentItem) => {
                return {
                  ...documentItem,
                  finalPrice: (documentItem.finalPrice * exchangeRate).toFixed(
                    3
                  ),
                  price: (documentItem.price * exchangeRate).toFixed(3),
                  discount: (documentItem.discount * exchangeRate).toFixed(3),
                };
              }
            ),
          };
          setQuoteItemValue(updatedQuoteItemValue);
        } else {
          const updatedQuoteItemValue = {
            ...newQuoteItemValue,
            discount: _data?.document?.discount,
            discountAmount: _data?.document?.discountAmount,
            totalPayment: _data?.document?.totalPayment,
            totalPrice: _data?.document?.totalPrice,
            totalPriceAfterDiscount: _data?.document?.totalPriceAfterDiscount,
            totalVAT: _data?.document?.totalVAT,
            vat: _data?.document?.vat,
            documentItems: newQuoteItemValue.documentItems.map(
              (documentItem) => {
                if (documentItem.id === quoteItem.id) {
                  return {
                    ...documentItem,
                    finalPrice: _data.finalPrice,
                    price: _data.price,
                    quantity: _data.quantity,
                    discount: _data.discount,
                  };
                } else {
                  return documentItem;
                }
              }
            ),
          };
          setQuoteItemValue(updatedQuoteItemValue);
          setSelectedFirstMaterial(false);
        }
      } else {
        setSelectedFirstMaterial(false);
      }
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
        } else {
          if (res?.message === "amount_greater_budget") {
            alertFault(`${t("sales.quote.errorUpdateBudget")}`);
          } else {
            alertFaultUpdate();
          }
          getQuote();
        }
      };
      await calculateDocumentItemApi(callApi, callBack, {
        documentType: docType,
        ItemId: quoteItem?.id,
        data,
        calculationType,
      });
    }
  };

  const getCalculateQuoteConfirmationItem = async (
    printHouseId: string,
    ItemId: string,
    quantity?: number
  ) => {
    const documentItemIds = quoteConfirm?.documentItems
      ?.filter((x) => x.isChecked)
      ?.map((x) => x.id);
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        const newQuote = res?.data;
        newQuote.documentItems = newQuote.documentItems.map((item) => {
          item.isChecked = documentItemIds.includes(item.id);
          return item;
        });
        setQuoteConfirm(newQuote);
      } else {
        alertFaultUpdate();
        getQuote();
      }
    };
    await updateQuoteItemQuantityApi(callApi, callBack, {
      printHouseId,
      ItemId,
      quantity,
      documentItemIds: documentItemIds,
    });
  };

  const onCloseDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(false);
  };
  const onOpenDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(true);
  };
  const onClickDuplicateWithDifferentQTY = (quoteItem) => {
    onOpenDuplicateWithDifferentQTY();
    setQuateItemId(quoteItem?.id);
    setQuoteItem(quoteItem);
  };
  const onOpenQuickDuplicate = () => {
    setOpenQuickDuplicateModal(true);
  };
  const onCloseQuickDuplicate = () => {
    setOpenQuickDuplicateModal(false);
  };
  const onClickQuickDuplicate = (quoteItem, isAddQuantity = false) => {
    onOpenQuickDuplicate();
    setQuateItemId(quoteItem?.id);
    setQuoteItem(quoteItem);
    setIsAddQuantity(isAddQuantity);
  };

  const duplicateQuoteItemWithAnotherQuantity = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        onCloseDuplicateWithDifferentQTY();
        getQuote();
      } else {
        alertFaultAdded();
      }
    };
    await duplicateWithAnotherQuantityApi(callApi, callBack, {
      ItemId: quoteItemId,
      amount: parseInt(amountValue),
      documentType: docType,
    });
  };

  const onCloseDeleteItemModal = () => {
    setOpenDeleteItemModal(false);
  };

  const onOpenDeleteItemModal = () => {
    setOpenDeleteItemModal(true);
  };

  const deleteQuoteItem = async () => {
    if (isNewCreation) {
      const updatedDocumentItems = quoteItemValue.documentItems.filter(
        (item) => item.id !== quoteItemId
      );
      const updatedQuoteItemValue = {
        ...quoteItemValue,
        documentItems: updatedDocumentItems,
      };
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/calculate-document-new`,
        {
          documentType: docType,
          document: {
            exchangeRate: updatedQuoteItemValue?.exchangeRate || 1,
            totalPrice: updatedQuoteItemValue?.totalPrice,
            data: 0,
            calculationType: 0,
            totalPriceAfterDiscount:
              updatedQuoteItemValue?.totalPriceAfterDiscount,
            discount: updatedQuoteItemValue?.discount,
            discountAmount: updatedQuoteItemValue?.discountAmount,
            totalPayment: updatedQuoteItemValue?.totalPayment,
            vat: updatedQuoteItemValue?.vat || 0.17,
            totalVAT: updatedQuoteItemValue?.totalVAT || 0.17,
            roundPrices: quoteItemValue?.client?.roundPrices,
            documentItems: updatedQuoteItemValue?.documentItems.map((item) => ({
              finalPrice: item.finalPrice,
            })),
          },
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.data;
        updatedQuoteItemValue.discount = _data.discount;
        updatedQuoteItemValue.discountAmount = _data.discountAmount;
        updatedQuoteItemValue.totalPayment = _data.totalPayment;
        updatedQuoteItemValue.totalPrice = _data.totalPrice;
        updatedQuoteItemValue.totalPriceAfterDiscount =
          _data.totalPriceAfterDiscount;
        updatedQuoteItemValue.totalVAT = _data.totalVAT;
        updatedQuoteItemValue.vat = _data.vat;
        updatedQuoteItemValue.exchangeRate =
          documentItems[0]?.exchangeRate === 0
            ? 1
            : documentItems[0]?.exchangeRate;
        setQuoteItemValue(updatedQuoteItemValue);
      }
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          onCloseDeleteItemModal();
          quoteItemValue?.documentItems?.length === 1 ||
            res?.data?.succ === false
            ? navigate("/home")
            : getQuote();
        } else {
          alertFaultDelete();
        }
      };
      await deleteDocumentItemApi(callApi, callBack, {
        ItemId: quoteItemId,
        documentType: docType,
      });
    }
  };

  const onAddDelivery = async (shipmentType: any, deliveryPrice?) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        onCloseDeliveryModal();
        onCloseUpdateDeliveryModal();
        if (
          router?.query?.isNewCreation &&
          (docType === DOCUMENT_TYPE.deliveryNote ||
            docType === DOCUMENT_TYPE.deliveryNoteRefund ||
            docType === DOCUMENT_TYPE.invoice ||
            docType === DOCUMENT_TYPE.invoiceRefund)
        ) {
          const updatedQuoteItemValue = { ...quoteItemValue };
          const deliveryItem = res?.data;
          const newItem = {
            id: uuidv4(),
            code: deliveryItem?.code,
            productName: deliveryItem.productName,
            details: deliveryItem?.details,
            price: deliveryItem.price,
            workName: "",
            discount: 0,
            finalPrice: 0,
            quantity: 1,
            isSelected: false,
            productID: deliveryItem?.productID,
            productType: 1,
            calculationStatus: null,
          };
          updatedQuoteItemValue.documentItems = [
            ...updatedQuoteItemValue.documentItems,
            newItem,
          ];
          getCalculateQuoteItem(
            newItem,
            1,
            newItem.price,
            updatedQuoteItemValue
          );
        } else getQuote();
      } else {
        alertFaultAdded();
      }
    };
    await addDeliveryApi(callApi, callBack, {
      delivery: {
        documentId: quoteItemValue?.id,
        shipmentTypeId: shipmentType?.value,
        deliveryPrice,
      },
      documentType: docType,
    });
  };

  const onClickDeleteQouteItem = (quoteItem) => {
    onOpenDeleteItemModal();
    setQuateItemId(quoteItem?.id);
    setQuoteItem(quoteItem);
  };

  const getCalculateQuote = async (calculationType: number, data: number) => {
    if (isNewCreation) {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/calculate-document-new`,
        {
          documentType: docType,
          document: {
            exchangeRate:
              quoteItemValue?.exchangeRate === 0
                ? 1
                : quoteItemValue?.exchangeRate,
            totalPrice: quoteItemValue?.totalPrice,
            data,
            calculationType,
            totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
            discount: data,
            discountAmount: quoteItemValue?.discountAmount,
            totalPayment: quoteItemValue?.totalPayment,
            vat: quoteItemValue?.vat || 0.17,
            totalVAT: quoteItemValue?.totalVAT || 0.17,
            roundPrices: quoteItemValue?.client?.roundPrices,
            documentItems: quoteItemValue.documentItems?.map((item) => ({
              finalPrice: item.finalPrice,
            })),
          },
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.data;
        const updatedQuoteItemValue = { ...quoteItemValue };
        updatedQuoteItemValue.discount = _data.discount;
        updatedQuoteItemValue.discountAmount = _data.discountAmount;
        updatedQuoteItemValue.totalPayment = _data.totalPayment;
        updatedQuoteItemValue.totalPrice = _data.totalPrice;
        updatedQuoteItemValue.totalPriceAfterDiscount =
          _data.totalPriceAfterDiscount;
        updatedQuoteItemValue.totalVAT = _data.totalVAT;
        updatedQuoteItemValue.vat = _data.vat;

        setQuoteItemValue(updatedQuoteItemValue);
      }
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await calculateDocumentApi(callApi, callBack, {
        documentType: docType,
        documentId: quoteItemValue?.id,
        data,
        calculationType,
      });
    }
  };

  const changeDocumentItems = (
    index: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...documentItems];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setPriceListItems(temp);
  };

  const changeDocumentItemsChild = (
    parentIndex: number,
    childInex: number,
    filedName: string,
    value: any
  ) => {
    let temp = lodashClonedeep(documentItems);
    temp[parentIndex].childsDocumentItems[childInex] = {
      ...temp[parentIndex].childsDocumentItems[childInex],
      [filedName]: value,
    };
    setPriceListItems(temp);
  };

  const changeQuoteItems = useCallback(
    (filedName: string, value: any) => {
      setQuoteItems((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [quoteItems]
  );

  const creationDateRef = useRef(null);
  const dateRef = useRef(null);
  const taxDateRef = useRef(null);
  const [activeClickAway, setActiveClickAway] = useState(false); //for duaDate/deliveryDate
  const [activeClickAwayForCreationDate, setActiveClickAwayForCreationDate] =
    useState(false);
  const [activeClickAwayForTaxDate, setActiveClickAwayForTaxDate] =
    useState(false);

  const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
  const [openSignatureApprovalModal, setOpenSignatureApprovalModal] =
    useState(false);
  const [openIrrelevantCancelModal, setOpenIrrelevantCancelModal] =
    useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] =
    useState(false);

  const onClickOpenIrrelevantModal = () => {
    setOpenIrrelevantCancelModal(true);
  };
  const onClickCloseIrrelevantModal = () => {
    setOpenIrrelevantCancelModal(false);
  };

  const onClickOpenPriceModal = () => {
    setOpenPriceCancelModal(true);
  };
  const onClickClosePriceModal = () => {
    setOpenPriceCancelModal(false);
  };

  const onClickOpenDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClickCloseDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(false);
  };
  const onClickOpenModal = () => {
    setOpenOtherReasonModal(true);
  };
  const onClickCloseModal = () => {
    setOpenOtherReasonModal(false);
  };

  const onClickOpenSignatureApprovalModal = () => {
    setOpenSignatureApprovalModal(true);
  };
  const onClickCloseSignatureApprovalModal = () => {
    setOpenSignatureApprovalModal(false);
  };

  const onClickCancelOffer = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    };
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: quoteItemValue?.id,
        quoteStatus: QuoteStatuses.CANCELED_OTHER,
        cancelText: reasonText,
      },
    });
  };

  const updateCancelQuote = async (quoteStatus: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    };
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: quoteItemValue?.id,
        quoteStatus: quoteStatus,
      },
    });
  };

  const alertNotVerifiedMail = useModal();
  const [alertNotVerifiedModalState, setAlertModalState] = useState<{
    message: string;
    onConfirm?: () => void;
  }>({
    message: "",
  });

  const showAlertModal = ({
    message,
    onConfirm,
  }: {
    message: string;
    onConfirm?: () => void;
  }) => {
    setAlertModalState({ message, onConfirm });
    alertNotVerifiedMail.open();
  };

  const onClickSendQuoteToClient = async (messageType: MessageType) => {
    if (!isSelectedAtLeastOne && docType === DOCUMENT_TYPE.quote) {
      alertFault("reports.pleaseSelectOneItem");
      return;
    }

    const checkContacts = () => {
      const contacts = quoteItemValue?.documentContacts;
      const phoneValid = checkArrayNotEmptyOrPhoneNotEmpty(contacts);
      const emailValid = checkArrayNotEmptyOrEmailNotEmpty(contacts);

      if (messageType === MessageType.SMS && !phoneValid) {
        alertFault("sales.quote.phoneContectErrorMsg");
        return false;
      }
      if (messageType === MessageType.Email && !emailValid) {
        alertFault("sales.quote.mailContectErrorMsg");
        return false;
      }
      if (messageType === MessageType.Both) {
        if (!phoneValid) {
          alertFault("sales.quote.phoneContectErrorMsg");
          return false;
        }
        if (!emailValid) {
          alertFault("sales.quote.mailContectErrorMsg");
          return false;
        }
      }
      return true;
    };

    if (!checkContacts()) return;

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessSend();
        setOpenInvoiceCreationModal(false);
      } else {
        if (
          (messageType === MessageType.Email ||
            messageType === MessageType.Both) &&
          res?.errors?.message
        ) {
          if (res.errors.message === "agent_not_verified") {
            showAlertModal({
              message: t("alerts.agentEmailNotVerified"),
              onConfirm: async () => {
                await resendFromPrintHouseMail(messageType);
              },
            });
          } else if (res.errors.message === "printHouse_mail_not_verified") {
            showAlertModal({
              message: t("alerts.printHouseMailNotVerified"),
            });
          } else if (res.errors.message === "app_password_required") {
            showAlertModal({
              message: t("alerts.app_password_required"),
            });
          } else {
            alertFaultSend();
          }
        }
      }
    };

    await sendDocumentToClientApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        messageType,
      },
    });
  };

  const resendFromPrintHouseMail = async (messageType: MessageType) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessSend();
        setOpenInvoiceCreationModal(false);
      } else {
        if (res?.errors?.message === "printHouse_mail_not_verified") {
          showAlertModal({
            message: t("alerts.printHouseMailNotVerified"),
          });
        } else {
          alertFaultSend();
        }
      }
    };

    await sendDocumentToClientApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        messageType: messageType,
        sendMailIfNotVerifiedAgent: true,
      },
    });
  };

  const receiptSendModal = useModal();
  const [modalCallback, setModalCallback] = useState<
    (includeInvoices: boolean) => void
  >(() => () => { });

  const openReceiptModal = (callback: (includeInvoices: boolean) => void) => {
    receiptSendModal.open();
    setModalCallback(() => callback);
  };

  const onClickSendReceiptToClient = async (
    messageType: number,
    sendWithInvoices: boolean = false
  ) => {
    if (messageType === MessageType.SMS) {
      let checkPhones = checkArrayNotEmptyOrPhoneNotEmpty(
        quoteItemValue?.documentContacts
      );
      if (checkPhones) {
        const callBack = (res) => {
          if (res?.success) {
            alertSuccessAdded();
            setOpenReceiptCreationModal(false);
          } else {
            alertFaultAdded();
          }
        };
        await sendReceiptToClientApi(callApi, callBack, {
          document: {
            documentId: quoteItemValue?.id,
            messageType,
            sendWithInvoices,
          },
        });
      } else {
        alertFault("sales.quote.phoneContectErrorMsg");
      }
    } else {
      let checkEmails = checkArrayNotEmptyOrEmailNotEmpty(
        quoteItemValue?.documentContacts
      );
      if (checkEmails) {
        const callBack = (res) => {
          if (res?.success) {
            alertSuccessAdded();
            setOpenReceiptCreationModal(false);
          } else {
            alertFaultAdded();
          }
        };
        await sendReceiptToClientApi(callApi, callBack, {
          document: {
            documentId: quoteItemValue?.id,
            messageType,
            sendWithInvoices,
          },
        });
      } else {
        alertFault("sales.quote.mailContectErrorMsg");
      }
    }
  };

  const handleSaveDraftBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const path = isInvoice ? `/invoices` : `/purchaseInvoices`;
        navigate(path);
      } else {
        alertFaultUpdate();
      }
    };
    await saveDraftDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        ...quoteItemValue,
        creationDate: creationDate,
        taxDate: taxDate,
        dueDate: selectDate,
        ...(router?.query?.budgetId ? { budgetID: router.query.budgetId } : {}),
        exchangeRate:
          quoteItemValue.exchangeRate === 0 ? 1 : quoteItemValue.exchangeRate,
        isOpenRelatedDocuments: isOpenRelatedDocuments,
      },
    });
  };

  const handleSaveBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    };
    await saveDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      },
    });
  };

  const handleRejectBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/home");
        // getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await rejectDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      },
    });
  };

  const handleAcceptBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/home");
        // getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await acceptDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      },
    });
  };

  const setLoadingWithShadow = useSetRecoilState(loadingWithShadowState);

  const handleSaveBtnClickForDocument = async () => {
    // Check if we're creating a new document and if the document already has more than 100 items
    const isNewCreation = router?.query?.isNewCreation === "true";
    const currentItemCount = quoteItemValue?.documentItems?.length || 0;

    if (isNewCreation && currentItemCount > 100) {
      alertWarning("sales.quote.maxItemsReached");
      return;
    }

    // const validationError = validateDocument(quoteItemValue);
    // if (validationError) {
    //   alertFault(validationError);
    //   return;
    // }
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        const _data = res?.data || {};
        setQuoteItemValue(_data);
        if (
          docType === DOCUMENT_TYPE.invoice ||
          docType === DOCUMENT_TYPE.deliveryNote
        ) {
          router.replace(`/${documentPath}?Id=${_data?.id}`);
          onClickOpenInvoiceCreation();
        } else {
          router.replace(`/${documentPath}?Id=${_data?.id}`);
        }
      } else {
        alertFaultAdded();
      }
    };

    await createDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        ...quoteItemValue,
        creationDate: creationDate,
        taxDate: taxDate,
        dueDate: selectDate,
        ...(router?.query?.budgetId ? { budgetID: router.query.budgetId } : {}),
        exchangeRate:
          quoteItemValue.exchangeRate === 0 ? 1 : quoteItemValue.exchangeRate,
        isOpenRelatedDocuments: isOpenRelatedDocuments,
      },
    });
  };

  const onClickDeleteAddress = async (item: any, addressType: EAddressType) => {
    const addressArray =
      addressType === EAddressType.BILLING
        ? "documentBillingAddresses"
        : "documentDeliveryAddresses";

    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };

      // Remove the address with the matching ID
      updatedQuoteItemValue[addressArray] = updatedQuoteItemValue[
        addressArray
      ]?.filter((address) => address.id !== item.id);

      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          getQuote();
        } else {
          alertFaultDelete();
        }
      };

      await deleteDocumentAddressApi(callApi, callBack, {
        documentAddressId: item?.id,
        documentType: docType,
      });
    }
  };

  const setCardTransactions = useSetRecoilState<transactionOptionsData[]>(
    creditTransactionsState
  );
  const getAllCreditCardTransactions = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const formattedData = res?.data.map((transaction) => ({
          value: transaction.id,
          label: transaction.text,
          transactionSum: transaction.transactionSum,
        }));
        setCardTransactions(formattedData);
      }
    };
    await getAllCreditTransactionsApi(callApi, callBack, { clientId: id });
  };

  useEffect(() => {
    getAllClientContacts();
  }, [getAllClientContacts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        if (activeClickAway) {
          updateDueDate();
          setActiveClickAway(false);
        }
      }

      if (taxDateRef.current && !taxDateRef.current.contains(event.target)) {
        if (activeClickAwayForTaxDate) {
          if (isNewCreation) {
            const updatedQuoteItemValue = { ...quoteItemValue };
            updatedQuoteItemValue.dueDate = selectDate;
            updatedQuoteItemValue.taxDate = taxDate;
            updatedQuoteItemValue.creationDate = creationDate;
            setQuoteItemValue(updatedQuoteItemValue);
          }
          setActiveClickAwayForTaxDate(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [
    dateRef,
    taxDateRef,
    activeClickAway,
    activeClickAwayForTaxDate,
    quoteItemValue,
    selectDate,
    taxDate,
  ]);

  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [confirmCreateDocument, setConfirmCreateDocument] = useState(false);
  const onClickOpenReferenceModal = () => {
    setOpenReferenceModal(true);
  };

  const onClickConfirmCreateDocument = () => {
    setConfirmCreateDocument(true);
  };

  const onClickCloseConfirmCreateDocument = () => {
    setConfirmCreateDocument(false);
  };

  const [newCreationDate, setNewCreationDate] = useState(
    isQuoteConfirmation
      ? quoteConfirm?.creationDate
      : quoteItemValue?.creationDate
  );
  useEffect(() => {
    setNewCreationDate(
      isQuoteConfirmation
        ? quoteConfirm?.creationDate
        : quoteItemValue?.creationDate
    );
  }, []);

  const onClickCloseReferenceModal = () => {
    setOpenReferenceModal(false);
  };

  const onChangeDatesToCreationDate = () => {
    setSelectDate(newCreationDate);
    setCreationDate(newCreationDate);
    setTaxDate(newCreationDate);
    //make sure it works
    setQuoteItemValue({
      ...quoteItemValue,
      creationDate: newCreationDate,
      taxDate: newCreationDate,
      dueDate: newCreationDate,
    });
  };

  useEffect(() => {
    if (agentListValue?.length > 0) {
      const selectedAgent1 = agentListValue.find(
        (agent) => agent.value === quoteItemValue?.agentId
      );
      setSelectedAgent(selectedAgent1);
    }
  }, [agentListValue, quoteItemValue]);

  useEffect(() => {
    const source = isQuoteConfirmation ? quoteConfirm : quoteItemValue;

    setPriceListItems(source?.documentItems || []);
    setQuoteItems(source);
    setItems(source?.documentContacts);
    setCreationDate(source?.creationDate);
    setTaxDate(source?.taxDate);
    setClientName(source?.occasionalClientName);

    if (!isQuote) {
      setSelectDate(source?.dueDate);
    }
  }, [quoteItemValue, quoteConfirm, isQuote, isQuoteConfirmation]);

  useEffect(() => {
    if (isQuote) {
      getQuoteDeliveryDate();
    }
  }, [isQuote]);

  const prevRouterQueryRef = useRef(router.query);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!isQuoteConfirmation && !routerChangedFromClientSelect) {
      if (!hasMountedRef.current) {
        getQuote();
        getAllEmployees();
        hasMountedRef.current = true;
      } else {
        // Check if the router query has changed (to avoid redundant calls)
        const hasQueryChanged =
          JSON.stringify(prevRouterQueryRef.current) !==
          JSON.stringify(router.query);

        if (hasQueryChanged) {
          getQuote();
          getAllEmployees();
          prevRouterQueryRef.current = router.query;
        }
      }
    }
    setRouterChangedFromClientSelect(false);
  }, [isQuoteConfirmation, router.query]);

  // useEffect(() => {
  //   if (!isQuoteConfirmation) {
  //     getQuote();
  //     getAllEmployees();
  //   }
  // }, [isQuoteConfirmation]);

  const { documentTitle } = useDocumentTitle(docType, isOutgoingPayments);

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  const onClickClosLoginModal = () => {
    setOpenLoginModal(false);
  };

  const onClickOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const { getClientTypesCategories } = useClientTypesList();

  useEffect(() => {
    if (!isPrePaymentPage) getClientTypesCategories();
  }, []);

  const sortDocumentItems = async (sortType: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await sortDocumentItemsApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        sortType,
      },
    });
  };
  const updateDiscountType = async (discountType: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await updateDiscountTypeApi(callApi, callBack, {
      documentType: docType,
      document: {
        doucumentId: quoteItemValue?.id,
        discountType,
      },
    });
  };

  const updateDocumentPreference = async (
    value: string,
    documentSettingTYpe: number
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await updateDocumentPreferenceApi(callApi, callBack, {
      documentType: docType,
      data: {
        value: value,
        documentSetting: documentSettingTYpe,
      },
    });
  };

  const [whatsappMassage, setWhatsAppMassage] = useState("");

  const getWhatsAppMessage = async () => {
    if (quoteItemValue?.id) {
      const callBack = (res) => {
        if (res?.success) {
          setWhatsAppMassage(res?.data);
        } else {
          alertFaultUpdate();
        }
      };
      await getWhatsAppMessageApi(callApi, callBack, {
        documentId: quoteItemValue?.id,
        documentType: docType,
      });
    }
  };

  const [sendWithInvoices, setSendWithInvoices] = useState<boolean>(false);
  const getWhatsAppMessageForReceipt = async () => {
    if (quoteItemValue?.id) {
      const callBack = (res) => {
        if (res?.success) {
          setWhatsAppMassage(res?.data);
        } else {
          alertFaultUpdate();
        }
      };
      await getWhatsAppMessageForReceiptApi(callApi, callBack, {
        documentId: quoteItemValue?.id,
        sendWithInvoices,
      });
    }
  };

  const onChangeSelectedItemRowForQoute = async (
    isSelected: boolean,
    itemId: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await updateDocuementItemSelectApi(callApi, callBack, {
      documentType: docType,
      item: {
        documentItemId: itemId,
        isSelected,
      },
    });
  };

  const isShowSettingIcon =
    !(isNewCreation && (isDeliveryNote || isInvoice)) && quoteItemValue.client;

  const showVatListInSettingIconNew =
    isNewCreation && (isDeliveryNote || isInvoice) && quoteItemValue.client;

  const moveOrderToReady = async (isSendMessage: boolean = false) => {
    const callBack = (res) => {
      if (res?.success) {
        if (isSelectedCLoseAsDeliveryNote) {
          navigate(
            `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`
          );
        } else {
          const path =
            docType === DOCUMENT_TYPE.order
              ? `/invoice?isNewCreation=true&orderId=${selectedDocument?.id}`
              : `/invoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
          navigate(path);
        }
      } else {
        alertFaultUpdate();
      }
    };
    await moveOrderToReadyApi(callApi, callBack, {
      orderId: selectedDocument?.id,
      isSendMessage: isSendMessage,
    });
  };

  const [allClientActiveBudgets, setAllClientActiveBudgets] = useState([]);
  const getAllClientActiveBudgets = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setAllClientActiveBudgets(res.data);
      }
    };
    await getAllClientActiveBudgetsApi(callApi, callBack, {
      clientId: quoteItemValue?.client?.id,
    });
  };
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    if (quoteItemValue?.client?.id) {
      getAllClientActiveBudgets();
    }
  }, [quoteItemValue?.client?.id]);

  const updateDocumentBudget = useCallback(
    async (budget) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/budgets/update-document-budget`,
        {
          documentType: docType,
          documentId: quoteItemValue?.id,
          budgetId: budget.id,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFault(`
          ${t("sales.quote.errorUpdateBudget")}
        `);
        if (quoteItemValue?.budgetId) {
          const budget = allClientActiveBudgets.find(
            (budget) => budget.id === quoteItemValue.budgetId
          );
          setSelectedBudget(budget);
        } else {
          setSelectedBudget(null);
        }
      }
    },
    [docType, quoteItemValue, allClientActiveBudgets]
  );

  const handleSendUsingWhatsAppWeb = (sendWithInvoices = false) => {
    let checkPhones = checkArrayNotEmptyOrPhoneNotEmpty(
      quoteItemValue?.documentContacts
    );
    if (!checkPhones) {
      alertFault("sales.quote.phoneContectErrorMsg");
      return;
    }
    const phoneNumber = quoteItemValue?.documentContacts[0].contactPhone;
    const callBack = (res) => {
      openWhatsAppWebLink(res?.data, phoneNumber);
    };
    getWhatsAppMessageApi(callApi, callBack, {
      documentId: quoteItemValue?.id,
      documentType: docType,
      ...(isReceipt ? { sendWithInvoices } : {}),
    });
  };

  const onClickDeleteDelivery = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await deleteDeliveryItemApi(callApi, callBack, {
      documentId: quoteItemValue?.id,
      documentType: docType,
    });
  };

  const renderCreateNewButton = () => (
    <Button
      sx={{
        ...classes.createNewDocument,
        "& .MuiButton-startIcon": {
          ...(RTL
            ? { marginLeft: "4px", marginRight: 0 }
            : { marginRight: "4px", marginLeft: 0 }),
        },
      }}
      onClick={() =>
        navigate(
          isOutgoingPayments
            ? `/${documentPath}?isOutgoingPayments=true&isNewCreation=true`
            : `/${documentPath}?isNewCreation=true`
        )
      }
      startIcon={<PlusIcon />}
    >
      {t("sales.quote.createNew")}
    </Button>
  );

  const reCalculateItem = async (itemId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        // alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await reCalculateItemApi(callApi, callBack, {
      documentType: docType,
      documentItemId: itemId,
    });
  };

  return {
    dateRef,
    taxDateRef,
    creationDateRef,
    activeClickAway,
    selectDate,
    creationDate,
    taxDate,
    isUpdateBusinessName,
    isUpdatePurchaseNumber,
    isUpdateAddress,
    selectedAgent,
    agentListValue,
    isUpdateAgent,
    isDisplayWidget,
    clientContactsValue,
    isUpdateContactName,
    items,
    displayedItems,
    isUpdateContactEmail,
    isUpdateContactMobile,
    selectedContactById,
    openDeleteModalContact,
    selectedContact,
    isUpdateContactName1,
    isUpdateContactEmail1,
    isUpdateContactMobile1,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    openDeleteItemModal,
    columnWidths,
    headerHeight,
    documentItems,
    quoteItems,
    tableHeaders,
    anchorElCancelBtn,
    anchorElSendBtn,
    openSendBtn,
    openCancelBtn,
    openOtherReasonModal,
    openIrrelevantCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    anchorElSettingMenu,
    openSettingMenu,
    anchorElSettingMenuForVat,
    openNewSttingMenuForVat,
    onClickSendQuoteToClient,
    onClickSendReceiptToClient,
    handleSettingMenuClick,
    handleSettingMenuClickForVat,
    handleSettingMenuClose,
    handleSettingMenuCloseForVat,
    onClickOpenPriceModal,
    onClickOpenModal,
    onClickClosePriceModal,
    onClickOpenDeliveryTimeModal,
    onClickCloseDeliveryTimeModal,
    onClickCloseModal,
    onClickOpenIrrelevantModal,
    onClickCloseIrrelevantModal,
    handleCancelBtnClick,
    handleCancelBtnClose,
    handleSendBtnClick,
    handleSendBtnClose,
    setActiveClickAway,
    changeQuoteItems,
    changeDocumentItemsChild,
    changeDocumentItems,
    getCalculateQuote,
    onCloseDeleteItemModal,
    deleteQuoteItem,
    onCloseDuplicateWithDifferentQTY,
    setAmountValue,
    onOpenNewItem,
    onCloseNewItem,
    setIsUpdateContactName1,
    setIsUpdateContactEmail1,
    setIsUpdateContactMobile1,
    setSelectDate,
    setTaxDate,
    setCreationDate,
    updateDueDate,
    setIsUpdateBusinessName,
    setIsUpdateAddress,
    setIsUpdatePurchaseNumber,
    setIsUpdateBusinessCode,
    onBlurBusinessName,
    onBlurPurchaseNumber,
    onBlurBusinessCode,
    onBlurAddress,
    onBlurAgent,
    setIsUpdateAgent,
    updateAgent,
    t,
    handleShowLess,
    setIsDisplayWidget,
    onOpenDeleteModalContact,
    changeItems,
    updateClientContact,
    setIsUpdateContactName,
    setIsUpdateContactMobile,
    setIsUpdateContactEmail,
    handleShowMore,
    setSelectedContactById,
    onInputChangePhone,
    onInputChangeMail,
    onClickAddNewContact,
    onCloseDeleteModalContact,
    onClickDeleteContact,
    onBlurContactMobile,
    onBlurContactName,
    onBlurContactEmail,
    getCalculateQuoteItem,
    getCalculateQuoteConfirmationItem,
    onClickDuplicateWithDifferentQTY,
    duplicateQuoteItemWithAnotherQuantity,
    onClickDeleteQouteItem,
    setReasonText,
    onClickCancelOffer,
    updateCancelQuote,
    onChangeSelectBusiness,
    onClickDeleteAddress,
    openAddDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
    openUpdateDeliveryModal,
    onOpenUpdateDeliveryModal,
    onCloseUpdateDeliveryModal,
    onAddDelivery,
    handleSaveBtnClick,
    handleRejectBtnClick,
    handleAcceptBtnClick,
    handleSaveBtnClickForDocument,
    documentTitle,
    onBlurExchangeRate,
    onBlurCurrency,
    setIsUpdateExchangeRate,
    setIsUpdateCurrency,
    setIsUpdateVatStatus,
    onBlurVatStatus,
    isUpdateVatStatus,
    isUpdateExchangeRate,
    isUpdateCurrency,
    updateExchangeRate,
    updateCurrency,
    updateVatStatus,
    refreshExchangeRate,
    getQuote,
    openCopyFromOrderModal,
    onCloseCopyFromOrder,
    onOpenCopyFromOrder,
    getAllClientContacts,
    copyFromDocumentType,
    openLoginModal,
    onClickClosLoginModal,
    onClickOpenLoginModal,
    openWhatsAppModal,
    onClickOpenWhatsAppModal,
    onClickCloseWhatsAppModal,
    sortDocumentItems,
    updateDocumentPreference,
    getWhatsAppMessage,
    getWhatsAppMessageForReceipt,
    whatsappMassage,
    openAddNewContactModal,
    onCloseNewContact,
    onOpenNewContact,
    onChangeSelectedItemRowForQoute,
    openNewItemNotesModal,
    onClickCloseNewItemNotesModal,
    onClickOpenRelatedDocumentsModal,
    onClickCloseRelatedDocumentsModal,
    openRelatedDocumentsModal,
    openSignatureApprovalModal,
    onClickOpenSignatureApprovalModal,
    onClickCloseSignatureApprovalModal,
    onBlurClientName,
    isUpdateClientName,
    setIsUpdateClientName,
    clientName,
    setClientName,
    onClickOpenNewItemNotesModal,
    setActiveClickAwayForCreationDate,
    setActiveClickAwayForTaxDate,
    openReferenceModal,
    onClickOpenReferenceModal,
    onClickCloseReferenceModal,
    onChangeDatesToCreationDate,
    activeClickAwayForCreationDate,
    newCreationDate,
    setNewCreationDate,
    openInvoiceCreationModal,
    onClickCloseInvoiceCreation,
    updateDiscountType,
    onBlurTitle,
    isUpdateDocumentTitle,
    setIsUpdateDocumentTitle,
    isShowSettingIcon,
    showVatListInSettingIconNew,
    isInvoice,
    onClickOpenChangeProductionStatusModal,
    openChangeProductionStatusModal,
    onClickCloseChangeProductionStatusModal,
    selectedDocument,
    isSelectedCLoseAsDeliveryNote,
    navigate,
    moveOrderToReady,
    allClientActiveBudgets,
    updateDocumentBudget,
    selectedBudget,
    setSelectedBudget,
    onCloseQuickDuplicate,
    onClickQuickDuplicate,
    quoteItemId,
    openQuickDuplicateModal,
    quoteItem,
    handleSendUsingWhatsAppWeb,
    isOrder,
    isQuote,
    confirmCreateDocument,
    onClickConfirmCreateDocument,
    onClickCloseConfirmCreateDocument,
    isOutgoingPayments,
    isReceipt,
    isMoveToReady,
    handleCheckboxChange,
    isDeliveryNote,
    isPurchaseDocument,
    isOpenRelatedDocuments,
    setIsOpenRelatedDocuments,
    isPurchaseInvoice,
    systemVAT,
    isAddQuantity,
    openAddAttachmentsModal,
    onOpenAddAttachmentsModal,
    onCloseAddAttachmentsModal,
    onClickOpenDeleteDeliveryModal,
    onClickCloseDeleteDeliveryModal,
    openDeleteDeliveryModal,
    onClickDeleteDelivery,
    contactsListRef,
    alertNotVerifiedMail,
    alertNotVerifiedModalState,
    AddCustomerModal,
    handleSaveDraftBtnClick,
    alertExistPurchaseNumber,
    pendingPurchaseNumber,
    setPendingPurchaseNumber,
    originalPurchaseNumber,
    setOriginalPurchaseNumber,
    updatePurchaseNumber,
    modalCallback,
    openReceiptModal,
    receiptSendModal,
    renderCreateNewButton,
    isNewCreation,
    primaryColor,
    moveToReadyOption,
    setMoveToReadyOption,
    handleRadioChange,
    reCalculateItem,
    openAddAttachmentsPurchaseModal,
    onOpenAddAttachmentsPurchaseModal,
    onCloseAddAttachmentsPurchaseModal,
  };
};

export { useQuoteNew };