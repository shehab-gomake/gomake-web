import { useCallback, useEffect, useRef, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetClientTypes,
} from "@/services/hooks";
import { v4 as uuidv4 } from "uuid";
import {
  IContactData,
  agentListsState,
  businessListsState,
  clientContactsState,
  quoteConfirmationState,
  quoteItemState,
} from "@/store";
import { useQuoteGetData } from "./use-quote-get-data";
import { addDeliveryApi, addDocumentContactApi, calculateDocumentApi, calculateDocumentItemApi, cancelDocumentApi, changeDocumentClientApi, deleteDocumentAddressApi, deleteDocumentContactApi, deleteDocumentItemApi, duplicateWithAnotherQuantityApi, getDocumentApi, getWhatsAppMessageApi, refreshExchangeRateApi, saveDocumentApi, sendDocumentToClientApi, sortDocumentItemsApi, updateAgentApi, updateDocuementItemSelectApi, updateDocumentAddressApi, updateDocumentContactApi, updateDocumentCurrencyApi, updateDueDateApi, updateExchangeRateApi, updateIsShowDetailsApi, updateIsShowPricesApi, updateOccasionalClientNameApi, updatePurchaseNumberApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";
import { getAllCreditTransactionsApi, getClientPaymentItemsApi, getReceiptByIdApi } from "@/services/api-service/generic-doc/receipts-api";
import { creditTransactionsState, transactionOptionsData } from "@/widgets/quote-new/buttons-container/states";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { isAtLeastOneSelected } from "@/utils/helpers";

interface IQuoteProps {
  docType: DOCUMENT_TYPE;
  isQuoteConfirmation?: boolean;
}
const useQuoteNew = ({ docType, isQuoteConfirmation = false }: IQuoteProps) => {
  const documentPath = DOCUMENT_TYPE[docType];

  const {
    alertSuccessUpdate,
    alertFaultUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertFaultGetData,
    alertSuccessDelete,
    alertFaultDelete,
    alertFault
  } = useSnackBar();
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { getQuote, getAllClientContacts } = useQuoteGetData(docType);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  useEffect(() => {
    setQuoteItemValue([])
  }, [])

  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const [selectDate, setSelectDate] = useState(isQuoteConfirmation ? quoteConfirm?.dueDate : quoteItemValue?.dueDate);
  const [creationDate, setCreationDate] = useState(isQuoteConfirmation ? quoteConfirm?.createdDate : quoteItemValue?.createdDate);
  const [customersListValue, setCustomersListValue] = useRecoilState<any>(businessListsState);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  const [selectConfirmBusiness, setSelectConfirmBusiness] = useState<any>({});
  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<number | null>(null);
  const [isUpdatePurchaseNumber, setIsUpdatePurchaseNumber] = useState<number | null>(null);
  const [isUpdateClientName, setIsUpdateClientName] = useState<number | null>(null);
  const [clientName, setClientName] = useState(quoteItemValue?.occasionalClientName);


  const [isUpdateExchangeRate, setIsUpdateExchangeRate] = useState<number | null>(null);
  const [isUpdateCurrency, setIsUpdateCurrency] = useState<string>(null);
  const [, setIsUpdateBusinessCode] = useState<number | null>(null);
  const [isUpdateAddress, setIsUpdateAddress] = useState<number | null>(null);
  const [isUpdateAgent, setIsUpdateAgent] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const [agentListValue, setAgentListValue] = useRecoilState<{ text: string, value: string }[]>(agentListsState);
  const [isDisplayWidget, setIsDisplayWidget] = useState(false);
  const [items, setItems] = useState([]);
  const [reasonText, setReasonText] = useState("");
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);
  const [isUpdateContactName1, setIsUpdateContactName1] = useState(null);
  const [isUpdateContactEmail1, setIsUpdateContactEmail1] = useState(null);
  const [isUpdateContactMobile1, setIsUpdateContactMobile1] = useState(null);
  const [clientContactsValue, setClientContactsValue] = useRecoilState<IContactData[]>(clientContactsState);
  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
  const [openAddNewItemModal, setOpenAddNewItemModal] = useState(false);
  const [openAddNewContactModal, setOpenAddNewContactModal] = useState(false);
  const [openCopyFromOrderModal, setOpenCopyFromOrderModal] = useState(false);
  const [quoteItemId, setQuateItemId] = useState();
  const [openDuplicateWithDifferentQTYModal, setOpenDuplicateWithDifferentQTYModal] = useState(false);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [amountValue, setAmountValue] = useState();
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
  const [documentItems, setPriceListItems] = useState<any>([]);
  const [quoteItems, setquoteItems] = useState<any>([]);
  const [anchorElCancelBtn, setAnchorElCancelBtn] = useState<null | HTMLElement>(null);
  const [anchorElSendBtn, setAnchorElSendBtn] = useState<null | HTMLElement>(null);
  const [anchorElSettingMenu, setAnchorElSettingMenu] = useState<null | HTMLElement>(null);
  const [displayedItems, setDisplayedItems] = useState<number>(2);
  const openSendBtn = Boolean(anchorElSendBtn);
  const openCancelBtn = Boolean(anchorElCancelBtn);
  const openSettingMenu = Boolean(anchorElSettingMenu);
  const [openWhatsAppModal, setOpenWatsAppModal] = useState(false)
  const [isSelectedAtLeastOne, setIsSelectedAtLeastOne] = useState(null)

  const [openNewItemNotesModal, setOpenNewItemNotesModal] = useState(false)
  const [openRelatedDocumentsModal, setOpenRelatedDocumentsModal] = useState(false)


  const onClickOpenRelatedDocumentsModal = () => {
    setOpenRelatedDocumentsModal(true)
  }
  const onClickCloseRelatedDocumentsModal = () => {
    setOpenRelatedDocumentsModal(false)
  }

  const onClickOpenNewItemNotesModal = () => {
    setOpenNewItemNotesModal(true)
  }
  const onClickCloseNewItemNotesModal = () => {
    setOpenNewItemNotesModal(false)
  }

  useEffect(() => {
    if (quoteItemValue?.client?.newItemNotes && quoteItemValue?.client?.newItemNotes.trim() !== "" && quoteItemValue?.client?.newItemNotes.trim() !== null && docType === DOCUMENT_TYPE.quote) {
      onClickOpenNewItemNotesModal()
    }

  }, [quoteItemValue])

  useEffect(() => {
    const data = isAtLeastOneSelected(quoteItemValue?.documentItems)
    setIsSelectedAtLeastOne(data)

  }, [quoteItemValue])

  const onClickOpenWhatsAppModal = () => {
    setOpenWatsAppModal(true)
  }
  const onClickCloseWhatsAppModal = () => {
    setOpenWatsAppModal(false)

  }
  const handleSettingMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSettingMenu(event.currentTarget);
  };
  const handleSettingMenuClose = () => {
    setAnchorElSettingMenu(null);
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

  const onOpenDeliveryModal = () => {
    setOpenAddDeliveryModal(true);
  };
  const onCloseDeliveryModal = () => {
    setOpenAddDeliveryModal(false);
  };
  const tableHeaders = [
    "#",
    t("sales.quote.itemCode"),
    t("products.profits.itemName"),
    isQuoteConfirmation ? quoteConfirm?.isShowDetails ? t("products.profits.details") : null : quoteItemValue?.isShowDetails ? t("products.profits.details") : null,
    t("sales.quote.amount"),
    t("products.profits.pricingListWidget.unitPrice"),
    t("sales.quote.discount"),
    t("products.offsetPrice.admin.finalPrice"),
    t("products.profits.more"),
  ].filter(Boolean);

  const columnWidths = ["5%", "8%", "12%", "33%", "8%", "8%", "8%", "8%"];
  const headerHeight = "44px";

  const updateDueDate = async () => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.dueDate = selectDate;
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessAdded();
          getQuote();
        } else {
          alertFaultAdded();
          setSelectDate(quoteItemValue?.dueDate);
          setCreationDate(quoteItemValue?.createdDate)
        }
      }
      await updateDueDateApi(callApi, callBack, {
        DocumentType: docType, Date: {
          documentId: quoteItemValue?.id,
          dueDate: selectDate,
        }
      })
    }
  }

  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: docType === DOCUMENT_TYPE.purchaseOrder || docType === DOCUMENT_TYPE.purchaseInvoice || docType === DOCUMENT_TYPE.purchaseInvoiceRefund ? "S" : "C",
      onlyCreateOrderClients: docType === DOCUMENT_TYPE.purchaseOrder || docType === DOCUMENT_TYPE.purchaseInvoice || docType === DOCUMENT_TYPE.purchaseInvoiceRefund ? true : false,
    });
  }, [docType]);
  const updateOccasionalClientName = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate()
      } else {
        alertFaultUpdate();
      }
    };
    await updateOccasionalClientNameApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quoteItemValue?.id,
        occasionalClientName: clientName
      },
    });
  };


  const onBlurPurchaseNumber = async (value) => {
    updatePurchaseNumber(value);
    setIsUpdatePurchaseNumber(null);
  };

  const onBlurClientName = async () => {
    updateOccasionalClientName()
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

  const getAllEmployees = useCallback(async () => {
    await getAndSetAllEmployees(callApi, setAgentListValue, {
      isAgent: true,
    });
  }, []);

  const updateAgent = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.agentId = item.value;
      updatedQuoteItemValue.agent = {
        firstname: item?.text,
        id: item?.value,
        lastname: item?.text
      };
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateAgent(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await updateAgentApi(callApi, callBack, {
        documentType: docType, document: {
          documentId: quoteItemValue?.id,
          agentId: item?.value,
        }

      })
    }

  }

  const updateExchangeRate = async (value: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateExchangeRate(null);
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await updateExchangeRateApi(callApi, callBack, {
      documentType: docType, document: {
        documentId: quoteItemValue?.id,
        exchangeRate: value,
      }

    })
  }

  const refreshExchangeRate = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await refreshExchangeRateApi(callApi, callBack, {
      documentType: docType, document: {
        documentId: quoteItemValue?.id,
      }
    })
  }

  const updateCurrency = async (currency: string) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateCurrency(null);
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await updateDocumentCurrencyApi(callApi, callBack, {
      documentType: docType, document: {
        documentId: quoteItemValue?.id,
        currency: currency,
      }

    })
  }

  const updatePurchaseNumber = async (value: string) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.purchaseNumber = value;
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdatePurchaseNumber(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await updatePurchaseNumberApi(callApi, callBack, {
        documentType: docType, document: {
          documentId: quoteItemValue?.id,
          purchaseNumber: value,
        }

      })
    }
  }

  useEffect(() => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt && router?.query?.documentNumber && router?.query?.ClientId) {
      const clientId = { id: router.query.ClientId }
      onChangeSelectBusiness(clientId);
    }
  }, [])

  const onChangeSelectBusiness = async (item: any) => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
          if (router?.query?.isNewCreation && router?.query?.documentNumber && router?.query?.ClientId) {
            const documentNumber = router.query.documentNumber;
            if (documentNumber) {
              const foundRow = _data.receiptItems.find(row => row.docNum === documentNumber);
              if (foundRow) {
                foundRow.isChecked = true;
              }
            }
          }
          setQuoteItemValue(_data);
          setIsUpdateBusinessName(null);
        } else {
          alertFaultAdded();
        }
        getAllCreditCardTransactions(item?.id);
      }
      await getClientPaymentItemsApi(callApi, callBack, { clientId: item?.id, })
    }
    else if (router?.query?.isNewCreation) {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/get-new-document-data`,
        {
          documentType: docType,
          clientId: item?.id,
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.result || {};
        setQuoteItemValue(_data);
        setIsUpdateBusinessName(null);
      } else {
        alertFaultAdded();
      }
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          setIsUpdateBusinessName(null);
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await changeDocumentClientApi(callApi, callBack, {
        documentType: docType, client: {
          documentID: quoteItemValue?.id,
          clientId: item?.id,
        }
      })
    }
  }

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
    if (router.query.isNewCreation) {
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
      updatedQuoteItemValue.documentContacts = [...updatedQuoteItemValue.documentContacts, newContact];
      setQuoteItemValue(updatedQuoteItemValue);
      setIsDisplayWidget(false);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessAdded();
          setIsDisplayWidget(false);
          getQuote();
        } else {
          alertFaultAdded();
        }
      }
      await addDocumentContactApi(callApi, callBack, {
        documentType: docType,
        contact:
        {
          contactID: selectedContactById?.id,
          contactName: selectedContactById?.name,
          contactMail: selectedContactById?.mail,
          contactPhone: selectedContactById?.phone,
          documentID: quoteItemValue?.id,
        }
      })
    }

  }

  const updateClientContact = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedContacts = updatedQuoteItemValue.documentContacts.map((contact: any) => {
        if (contact.id === item.id) {
          return item;
        }
        return contact;
      });

      updatedQuoteItemValue.documentContacts = updatedContacts;
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
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
      }
      await updateDocumentContactApi(callApi, callBack, {
        documentType: docType,
        contact:
        {
          id: item?.id,
          contactID: item?.contactID,
          contactName: item?.contactName,
          contactMail: item?.contactMail,
          contactPhone: item?.contactPhone,
          documentID: quoteItemValue?.id,
        }
      })
    }

  }

  const onClickDeleteContact = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedContacts = updatedQuoteItemValue.documentContacts.filter((contact: any) => {
        return contact.id !== item.id;
      });
      updatedQuoteItemValue.documentContacts = updatedContacts;
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          onCloseDeleteModalContact();
          getQuote();
        } else {
          alertFaultDelete();
        }
      }
      await deleteDocumentContactApi(callApi, callBack,
        {
          documentType: docType,
          documentContactId: item?.id
        })
    }
  }

  const handleShowMore = () => {
    setDisplayedItems(items.length);
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

  const [copyFromDocumentType, setCopyFromDocumentType] = useState<DOCUMENT_TYPE>();

  const onOpenCopyFromOrder = (documentNum: DOCUMENT_TYPE) => {
    setCopyFromDocumentType(documentNum)
    setOpenCopyFromOrderModal(true);
  };

  const onCloseNewItem = () => {
    setOpenAddNewItemModal(false);
  };
  const onCloseNewContact = () => {
    setOpenAddNewContactModal(false);
  };


  const getCalculateQuoteItem = async (quoteItem: any, calculationType: number, data: number) => {
    if (router.query.isNewCreation) {
      const quoteItemEdit = quoteItemValue.documentItems.find(item => item.id === quoteItem.id)
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/calculate-item`,
        {
          documentType: docType,
          document: {
            exchangeRate: quoteItemValue?.exchangeRate == 0 ? 1 : quoteItemValue?.exchangeRate,
            price: quoteItem?.price,
            discount: quoteItem?.discount,
            finalPrice: quoteItemEdit?.finalPrice,
            quantity: quoteItem?.quantity,
            document: {
              totalPrice: quoteItemValue?.totalPrice,
              totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
              discount: +quoteItemValue?.discount,
              discountAmount: quoteItemValue?.discountAmount,
              totalPayment: quoteItemValue?.totalPayment,
              vat: quoteItemValue?.vat,
              totalVAT: quoteItemValue?.totalVAT
            },
            data: data,
            calculationType: calculationType
          }
        },
        false
      );
      if (res?.success) {
        const _data = res?.data?.data?.data
        const updatedQuoteItemValue = {
          ...quoteItemValue,
          discount: _data?.document?.discount,
          discountAmount: _data?.document?.discountAmount,
          totalPayment: _data?.document?.totalPayment,
          totalPrice: _data?.document?.totalPrice,
          totalPriceAfterDiscount: _data?.document?.totalPriceAfterDiscount,
          totalVAT: _data?.document?.totalVAT,
          vat: _data?.document?.vat,
          documentItems: quoteItemValue.documentItems.map(documentItem => {
            if (documentItem.id === quoteItem.id) {
              return {
                ...documentItem,
                finalPrice: _data.finalPrice,
                price: _data.price,
                quantity: _data.quantity,
                discount: _data.discount
              };
            } else {
              return documentItem;
            }
          })
        };
        setQuoteItemValue(updatedQuoteItemValue);
      } else {
      }
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await calculateDocumentItemApi(callApi, callBack,
        {
          documentType: docType,
          ItemId: quoteItem?.id,
          data,
          calculationType,
        })
    }

  }

  const onCloseDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(false);
  };
  const onOpenDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(true);
  };
  const onClickDuplicateWithDifferentQTY = (quoteItem) => {
    onOpenDuplicateWithDifferentQTY();
    setQuateItemId(quoteItem?.id);
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
    }
    await duplicateWithAnotherQuantityApi(callApi, callBack, { ItemId: quoteItemId, amount: parseInt(amountValue), documentType: docType })
  }

  const onCloseDeleteItemModal = () => {
    setOpenDeleteItemModal(false);
  };

  const onOpenDeleteItemModal = () => {
    setOpenDeleteItemModal(true);
  };

  const deleteQuoteItem = async () => {
    if (router.query.isNewCreation) {
      const updatedDocumentItems = quoteItemValue.documentItems.filter(item => item.id !== quoteItemId);
      const updatedQuoteItemValue = {
        ...quoteItemValue,
        documentItems: updatedDocumentItems
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
            totalPriceAfterDiscount: updatedQuoteItemValue?.totalPriceAfterDiscount,
            discount: updatedQuoteItemValue?.discount,
            discountAmount: updatedQuoteItemValue?.discountAmount,
            totalPayment: updatedQuoteItemValue?.totalPayment,
            vat: updatedQuoteItemValue?.vat || 0.17,
            totalVAT: updatedQuoteItemValue?.totalVAT || 0.17,
            documentItems: updatedQuoteItemValue?.documentItems.map(item => ({
              finalPrice: item.finalPrice
            }))
          }
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.data;
        updatedQuoteItemValue.discount = _data.discount;
        updatedQuoteItemValue.discountAmount = _data.discountAmount;
        updatedQuoteItemValue.totalPayment = _data.totalPayment;
        updatedQuoteItemValue.totalPrice = _data.totalPrice;
        updatedQuoteItemValue.totalPriceAfterDiscount = _data.totalPriceAfterDiscount;
        updatedQuoteItemValue.totalVAT = _data.totalVAT;
        updatedQuoteItemValue.vat = _data.vat;
        updatedQuoteItemValue.exchangeRate = documentItems[0]?.exchangeRate === 0 ? 1 : documentItems[0]?.exchangeRate;
        setQuoteItemValue(updatedQuoteItemValue);
      }
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          onCloseDeleteItemModal();
          quoteItemValue?.documentItems?.length === 1 ? navigate("/home") : getQuote();
        } else {
          alertFaultDelete();
        }
      }
      await deleteDocumentItemApi(callApi, callBack, { ItemId: quoteItemId, documentType: docType })
    }

  }

  const onAddDelivery = async (shipmentType: string) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        onCloseDeliveryModal();
        getQuote();
      } else {
        alertFaultAdded();
      }
    }
    await addDeliveryApi(callApi, callBack, { delivery: { documentId: quoteItemValue?.id, shipmentTypeId: shipmentType }, documentType: docType })
  }

  const onClickDeleteQouteItem = (quoteItem) => {
    onOpenDeleteItemModal();
    setQuateItemId(quoteItem?.id);
  };

  const getCalculateQuote = async (calculationType: number, data: number) => {
    if (router.query.isNewCreation) {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/calculate-document-new`,
        {
          documentType: docType,
          document: {
            exchangeRate: quoteItemValue?.exchangeRate === 0 ? 1 : quoteItemValue?.exchangeRate,
            totalPrice: quoteItemValue?.totalPrice,
            data,
            calculationType,
            totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
            discount: data,
            discountAmount: quoteItemValue?.discountAmount,
            totalPayment: quoteItemValue?.totalPayment,
            vat: quoteItemValue?.vat || 0.17,
            totalVAT: quoteItemValue?.totalVAT || 0.17,
            documentItems: quoteItemValue.documentItems?.map(item => ({
              finalPrice: item.finalPrice
            }))
          }
        }
      );
      if (res?.success) {
        const _data = res?.data?.data?.data
        const updatedQuoteItemValue = { ...quoteItemValue };
        updatedQuoteItemValue.discount = _data.discount;
        updatedQuoteItemValue.discountAmount = _data.discountAmount;
        updatedQuoteItemValue.totalPayment = _data.totalPayment;
        updatedQuoteItemValue.totalPrice = _data.totalPrice;
        updatedQuoteItemValue.totalPriceAfterDiscount = _data.totalPriceAfterDiscount;
        updatedQuoteItemValue.totalVAT = _data.totalVAT;
        updatedQuoteItemValue.vat = _data.vat;

        setQuoteItemValue(updatedQuoteItemValue);
      }
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await calculateDocumentApi(callApi, callBack, {
        documentType: docType,
        documentId: quoteItemValue?.id,
        data,
        calculationType,
      })
    }

  }

  const changedocumentItems = (
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

  const changedocumentItemsChild = (
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
      setquoteItems((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [quoteItems]
  );

  const dateRef = useRef(null);
  const [activeClickAway, setActiveClickAway] = useState(false);


  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };

  const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
  const [openSignatureApprovalModal, setOpenSignatureApprovalModal] = useState(false);
  const [openIrrelevantCancelModal, setOpenIrrelevantCancelModal] = useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] = useState(false);

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
    }
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: quoteItemValue?.id,
        quoteStatus: QuoteStatuses.CANCELED_OTHER,
        cancelText: reasonText,
      }
    })
  }

  const updateCancelQuote = async (quoteStatus: number) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    }
    await cancelDocumentApi(callApi, callBack, {
      DocumentType: docType,
      Document: {
        documentId: quoteItemValue?.id,
        quoteStatus: quoteStatus,
      }
    })
  }
  const checkArrayNotEmptyOrPhoneNotEmpty = (array) => {
    if (array.length === 0) {
      return false;
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i].contactPhone && array[i].contactPhone.trim() !== '') {
        return true;
      }
    }

    return false;
  }
  const checkArrayNotEmptyOrEmailNotEmpty = (array) => {
    if (array.length === 0) {
      return false;
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i].contactMail && array[i].contactMail.trim() !== '') {
        return true;
      }
    }

    return false;
  }
  const onClickSendQuoteToClient = async (messageType: number) => {
    if (!isSelectedAtLeastOne) {
      alertFault("please select at least one item")
    }
    else {
      if (messageType === 1) {
        let checkPhones = checkArrayNotEmptyOrPhoneNotEmpty(quoteItemValue?.documentContacts)
        if (checkPhones) {
          const callBack = (res) => {
            if (res?.success) {
              alertSuccessAdded();
            } else {
              alertFaultAdded();
            }
          }
          await sendDocumentToClientApi(callApi, callBack, {
            documentType: docType,
            document: {
              documentId: quoteItemValue?.id,
              messageType,
            }
          })
        }
        else {
          alertFault("sales.quote.phoneContectErrorMsg")
        }
      }
      else {
        let checkEmails = checkArrayNotEmptyOrEmailNotEmpty(quoteItemValue?.documentContacts)
        if (checkEmails) {
          const callBack = (res) => {
            if (res?.success) {
              alertSuccessAdded();
            } else {
              alertFaultAdded();
            }
          }
          await sendDocumentToClientApi(callApi, callBack, {
            documentType: docType,
            document: {
              documentId: quoteItemValue?.id,
              messageType,
            }
          })
        }
        else {
          alertFault("sales.quote.mailContectErrorMsg")
        }

      }
    }




  }

  const handleSaveBtnClick = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    }
    await saveDocumentApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      }
    })
  }

  const handleSaveBtnClickForDocument = async () => {

    if (!quoteItemValue?.documentItems || quoteItemValue.documentItems.length === 0) {
      alertFault("alerts.noItems");
      return;
    }

    if (quoteItemValue?.totalPrice === 0) {
      alertFault("alerts.cannotCreateWithPriceZero");
      return;
    }

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/create-document`,
      {
        documentType: docType,
        document: {
          ...quoteItemValue,
          exchangeRate: quoteItemValue.exchangeRate === 0 ? 1 : quoteItemValue.exchangeRate
        }
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      const _data = res?.data?.data?.data || {};
      setQuoteItemValue(_data);
      navigate(`/${documentPath}?Id=${res?.data?.data?.data?.id}`)
    } else {
      alertFaultAdded();
    }
  }

  const onClickDeleteAddress = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.documentAddresses = [];
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessDelete();
          getQuote();
        } else {
          alertFaultDelete();
        }
      }
      await deleteDocumentAddressApi(callApi, callBack, { documentAddressId: item?.id, documentType: docType })
    }
  }
  const setCardTransactions = useSetRecoilState<transactionOptionsData[]>(creditTransactionsState);
  const getAllCreditCardTransactions = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        const formattedData = res?.data.map(transaction => ({
          value: transaction.id,
          label: transaction.text,
          transactionSum: transaction.transactionSum
        }));
        setCardTransactions(formattedData)
      }
    }
    await getAllCreditTransactionsApi(callApi, callBack, { clientId: id })
  }

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
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dateRef, activeClickAway, quoteItemValue, selectDate]);

  useEffect(() => {
    if (agentListValue?.length > 0) {
      const selectedAgent1 = agentListValue.find(
        (agent) => agent.value === quoteItemValue?.agentId
      );
      setSelectedAgent(selectedAgent1);
    }
  }, [agentListValue, quoteItemValue]);

  useEffect(() => {
    const foundConfirmItem = customersListValue.find(
      (item: any) => item.id === quoteConfirm?.customerID
    );

    setSelectConfirmBusiness(foundConfirmItem) // for quote confirmation
  }, [quoteItemValue, customersListValue]);

  useEffect(() => {
    setPriceListItems(quoteItemValue?.documentItems);
    setquoteItems(quoteItemValue);
    setItems(isQuoteConfirmation ? quoteConfirm?.documentContacts : quoteItemValue?.documentContacts);
    setSelectDate(isQuoteConfirmation ? quoteConfirm?.dueDate : quoteItemValue?.dueDate);
    setCreationDate(isQuoteConfirmation ? quoteConfirm?.createdDate : quoteItemValue?.createdDate)
  }, [quoteItemValue, quoteConfirm]);


  useEffect(() => {
    getAllCustomers();
    if (!isQuoteConfirmation) {
      getQuote();
      getAllEmployees();
    }
  }, [isQuoteConfirmation]);

  const documentsTitles = [
    {
      label: t("sales.quote.quote"),
      value: DOCUMENT_TYPE.quote,
    },
    {
      label: t("sales.quote.order"),
      value: DOCUMENT_TYPE.order,
    },
    {
      label: t("sales.quote.invoice"),
      value: DOCUMENT_TYPE.invoice,
    },
    {
      label: t("sales.quote.deliveryNote"),
      value: DOCUMENT_TYPE.deliveryNote,
    },
    {
      label: t("sales.quote.receipt"),
      value: DOCUMENT_TYPE.receipt,
    },
    {
      label: t("tabs.deliveryNoteRefund"),
      value: DOCUMENT_TYPE.deliveryNoteRefund,
    },
    {
      label: t("tabs.invoiceRefund"),
      value: DOCUMENT_TYPE.invoiceRefund,
    },
    {
      label: t("tabs.purchaseOrder"),
      value: DOCUMENT_TYPE.purchaseOrder,
    },
    {
      label: t("tabs.purchaseInvoice"),
      value: DOCUMENT_TYPE.purchaseInvoice,
    },
    {
      label: t("tabs.purchaseInvoiceRefund"),
      value: DOCUMENT_TYPE.purchaseInvoiceRefund,
    },
  ];
  const documentTitle = documentsTitles.find(item => item.value === docType).label;



  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  const onClickClosLoginModal = () => {
    setOpenLoginModal(false);
  };

  const onClickOpenLoginModal = () => {
    setOpenLoginModal(true);
  };
  const [clientTypesCategories, setClientTypesCategories] = useRecoilState(
    clientTypesCategoriesState
  );
  const getClientTypesCategories = async () => {
    const callBack = (res) => {
      if (res) {
        const clientTypes = res.map((types) => ({
          label: types.name,
          id: types.id,
          additionProfits: types?.additionProfits ?? 0,
        }));
        setClientTypesCategories(clientTypes);
      }
    };
    await getAndSetClientTypes(callApi, callBack, { cardType: CLIENT_TYPE_Id.CUSTOMER });
  };
  useEffect(() => {
    getClientTypesCategories()
  }, [])

  const sortDocumentItems = async (sortType: number) => {

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await sortDocumentItemsApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
        sortType,
      }
    })
  }
  const updateIsShowDetails = async () => {

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await updateIsShowDetailsApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      }
    })
  }

  const updateIsShowPrices = async () => {

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await updateIsShowPricesApi(callApi, callBack, {
      documentType: docType,
      document: {
        documentId: quoteItemValue?.id,
      }
    })
  }
  const [whatsappMassage, setWhatssAppMassage] = useState("")
  const getWhatsAppMessage = async () => {
    if (quoteItemValue?.id) {
      const callBack = (res) => {
        if (res?.success) {
          setWhatssAppMassage(res?.data)
        } else {
          alertFaultUpdate();
        }
      };
      await getWhatsAppMessageApi(callApi, callBack, {
        documentId: quoteItemValue?.id,
        documentType: docType

      });
    }
  };

  const onChangeSelectedItemRowForQoute = async (isSelected: boolean, itemId: string) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    }
    await updateDocuementItemSelectApi(callApi, callBack, {
      documentType: docType,
      item: {
        documentItemId: itemId,
        isSelected,
      }
    })
  }


  return {
    dateRef,
    activeClickAway,
    selectDate,
    creationDate,
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
    onClickSendQuoteToClient,
    handleSettingMenuClick,
    handleSettingMenuClose,
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
    handleClickSelectDate,
    setActiveClickAway,
    changeQuoteItems,
    changedocumentItemsChild,
    changedocumentItems,
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
    updateDueDate,
    setIsUpdateBusinessName,
    setSelectBusiness,
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
    onClickDuplicateWithDifferentQTY,
    duplicateQuoteItemWithAnotherQuantity,
    onClickDeleteQouteItem,
    setReasonText,
    onClickCancelOffer,
    updateCancelQuote,
    onChangeSelectBusiness,
    updatePurchaseNumber,
    onClickDeleteAddress,
    openAddDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
    onAddDelivery,
    handleSaveBtnClick,
    handleSaveBtnClickForDocument,
    documentTitle,
    onBlurExchangeRate,
    onBlurCurrency,
    setIsUpdateExchangeRate,
    setIsUpdateCurrency,
    isUpdateExchangeRate,
    isUpdateCurrency,
    updateExchangeRate,
    updateCurrency,
    refreshExchangeRate,
    getQuote,
    selectConfirmBusiness,
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
    updateIsShowDetails,
    updateIsShowPrices,
    getWhatsAppMessage,
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
    onClickOpenNewItemNotesModal
  };
};

export { useQuoteNew };