import { useCallback, useEffect, useRef, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetClientContacts,
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
import { QuoteStatuses } from "@/widgets/quote/total-price-and-vat/enums";
import { addressModalState } from "@/widgets/quote-new/business-widget/address-widget/state";
import { useQuoteGetData } from "./use-quote-get-data";
import { addDeliveryApi, addDocumentAddressApi, addDocumentContactApi, calculateDocumentApi, calculateDocumentItemApi, cancelDocumentApi, changeDocumentClientApi, deleteDocumentAddressApi, deleteDocumentContactApi, deleteDocumentItemApi, duplicateWithAnotherQuantityApi, getDocumentApi, refreshExchangeRateApi, saveDocumentApi, sendDocumentToClientApi, updateAgentApi, updateDocumentAddressApi, updateDocumentContactApi, updateDocumentCurrencyApi, updateDueDateApi, updateExchangeRateApi, updatePurchaseNumberApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";
import { getAllCreditTransactionsApi, getClientPaymentItemsApi, getReceiptByIdApi } from "@/services/api-service/generic-doc/receipts-api";
import { creditTransactionsState, transactionOptionsData } from "@/widgets/quote-new/buttons-container/states";

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
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { getAllClientAddress } = useQuoteGetData();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const [selectDate, setSelectDate] = useState(isQuoteConfirmation ? quoteConfirm?.dueDate : quoteItemValue?.dueDate);
  const [customersListValue, setCustomersListValue] = useRecoilState<any>(businessListsState);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  const [selectConfirmBusiness, setSelectConfirmBusiness] = useState<any>({});
  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<number | null>(null);
  const [isUpdatePurchaseNumber, setIsUpdatePurchaseNumber] = useState<number | null>(null);
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
    t("products.profits.details"),
    t("sales.quote.amount"),
    t("sales.quote.discount"),
    t("products.profits.pricingListWidget.unitPrice"),
    t("products.offsetPrice.admin.finalPrice"),
    t("products.profits.more"),
  ];
  const columnWidths = ["5%", "8%", "12%", "33%", "8%", "8%", "8%", "8%"];
  const headerHeight = "44px";

  const router = useRouter();
  const getQuote = async () => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
          setQuoteItemValue(_data);
        } else {
          alertFaultAdded();
        }
      }
      await getClientPaymentItemsApi(callApi, callBack)
    }
    else if (router?.query?.isNewCreation) {
      const requestBody: any = {
        documentType: docType
      };
      if (router?.query.orderId) {
        requestBody.orderId = router.query.orderId;
      }
      if (router?.query.deliveryNoteId) {
        requestBody.deliveryNoteID = router.query.deliveryNoteId;
      }
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/get-new-document-data`,
        requestBody
      );

      if (res?.success) {
        const _data = res?.data?.data?.result || {};
        setQuoteItemValue(_data);
      } else {
        alertFaultAdded();
      }
    }
    else if (docType === DOCUMENT_TYPE.receipt){
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
          setQuoteItemValue(_data);
        } else {
          alertFaultAdded();
        }
      }
      await getReceiptByIdApi(callApi, callBack, {receiptId:router?.query?.Id})
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          let indexs = 0;
          // const _data = res?.data;
          const _data = res?.data || {};
          const mapData = _data?.documentItems?.map((item: any, index: number) => {
            indexs++;
            const parentIndex = indexs;
            const _childsDocumentItemsMapping = item?.childsDocumentItems?.map(
              (child: any, index2: number) => {
                indexs++;
                return {
                  id: indexs,
                  amount: child?.quantity,
                  unitPrice: child?.price,
                  discount: child?.discount,
                  finalPrice: child?.finalPrice,
                  quoteItemId: child?.id,
                };
              }
            );
            return {
              id: parentIndex,
              itemName: item?.productName,
              details: (
                <div
                  style={
                    _childsDocumentItemsMapping != null
                      ? { height: "100%", overflowY: "scroll", paddingRight: 5 }
                      : { height: 36, overflowY: "scroll", paddingRight: 5 }
                  }
                >
                  {item?.content}
                </div>
              ),
              amount: item?.quantity,
              unitPrice: item?.price,
              discount: item?.discount,
              finalPrice: item?.finalPrice,
              quoteItemId: item?.id,
              childsDocumentItems: _childsDocumentItemsMapping,
            };
          });
          _data.documentItemsMapping = mapData;
          setQuoteItemValue(_data);
        } else {
          // alertFaultAdded();

        }
      }
      await getDocumentApi(callApi, callBack, { documentType: docType, Id: router?.query?.Id })
    } }

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
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);

  const onBlurPurchaseNumber = async (value) => {
    updatePurchaseNumber(value);
    setIsUpdatePurchaseNumber(null);
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


  ///////////////////////////////// currency & exchange rate /////////////////////////////////


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

  const onChangeSelectBusiness = async (item: any) => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
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

  const getAllClientContacts = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientContacts(callApi, setClientContactsValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

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
  const onCloseCopyFromOrder = () => {
    setOpenCopyFromOrderModal(false);
  };

  const onOpenCopyFromOrder = () => {
    setOpenCopyFromOrderModal(true);
  };
  const onCloseNewItem = () => {
    setOpenAddNewItemModal(false);
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
            exchangeRate: quoteItemValue?.exchangeRate,
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
        }
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
            vat: updatedQuoteItemValue?.vat,
            totalVAT: updatedQuoteItemValue?.totalVAT,
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
        updatedQuoteItemValue.exchangeRate = documentItems[0]?.exchangeRate;
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
            exchangeRate: quoteItemValue?.exchangeRate,
            totalPrice: quoteItemValue?.totalPrice,
            data,
            calculationType,
            totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
            discount: data,
            discountAmount: quoteItemValue?.discountAmount,
            totalPayment: quoteItemValue?.totalPayment,
            vat: quoteItemValue?.vat,
            totalVAT: quoteItemValue?.totalVAT,
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

  const onClickSendQuoteToClient = async (messageType: number) => {
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
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/create-document`,
      {
        documentType: docType,
        document: {
          ...quoteItemValue
        }
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      navigate(`${documentPath}s`);
    } else {
      alertFaultAdded();
    }
  }


  const setOpenModal = useSetRecoilState<boolean>(addressModalState);

  const onClickAddNewAddress = useCallback(async (item: any, isUpdate: boolean) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      if (!Array.isArray(updatedQuoteItemValue.documentAddresses)) {
        updatedQuoteItemValue.documentAddresses = [];
      }
      const newAddress = {
        id: uuidv4(),
        addressID: uuidv4(),
        street: item?.street,
        city: item?.city,
        entry: item?.entry,
        apartment: item?.apartment,
        notes: "",
        documentID: updatedQuoteItemValue?.id,
      };
      updatedQuoteItemValue.documentAddresses = [...updatedQuoteItemValue.documentAddresses, newAddress];
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    }
    else {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/crm-service/customer/create-address`,
        {
          address1: item?.addressId,
          street: item?.street,
          city: item?.city,
          entry: item?.entry,
          apartment: item?.apartment,
          clientId: quoteItemValue?.customerID,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        const result = await getAllClientAddress();
        isUpdate ? updateClientAddress(result.find(item => item.id === res.data.data.result)) :
          onClickAddAddress(result.find(item => item.id === res.data.data.result))
      } else {
        alertFaultAdded();
      }
    }

  }, [quoteItemValue, router]);
  const updateClientAddress = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedAddresses = updatedQuoteItemValue.documentAddresses.map((address) => {
        if (address.id === item.id) {
          return {
            ...address,
            street: item.street,
            city: item.city,
            entry: item.entry,
            apartment: item.apartment,
            notes: item.notes || "",
          };
        }
        return address;
      });
      updatedQuoteItemValue.documentAddresses = updatedAddresses;
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
          setOpenModal(false);
        } else {
          alertFaultAdded();
        }
      }
      await updateDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: {
          id: quoteItemValue?.documentAddresses[0]?.id,
          addressID: quoteItemValue?.documentAddresses[0]?.addressID,
          street: item?.street,
          city: item?.city,
          entry: item?.entry,
          apartment: item?.apartment,
          notes: item?.notes || "",
          documentID: quoteItemValue?.id,
        }
      })
    }

  }

  const onClickAddAddress = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      if (!Array.isArray(updatedQuoteItemValue.documentAddresses)) {
        updatedQuoteItemValue.documentAddresses = [];
      }
      const newAddress = {
        id: uuidv4(),
        addressID: item?.addressId,
        street: item?.street,
        city: item?.city,
        entry: item?.entry,
        apartment: item?.apartment,
        notes: "",
        documentID: updatedQuoteItemValue?.id,
      };
      updatedQuoteItemValue.documentAddresses = [...updatedQuoteItemValue.documentAddresses, newAddress];
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    }
    else {
      const callBack = (res) => {
        if (res.success) {
          alertSuccessAdded();
          getQuote();
          setOpenModal(false);
        }
        else {
          alertFaultAdded();
        }
      }
      await addDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: {
          addressID: item?.id,
          street: item?.street,
          city: item?.city,
          entry: item?.entry,
          apartment: item?.apartment,
          notes: item?.notes || "",
          documentID: quoteItemValue?.id,

        }
      })
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
    const foundItem = customersListValue.find(
      (item: any) => item.id === quoteItemValue?.customerID
    );
    const foundConfirmItem = customersListValue.find(
      (item: any) => item.id === quoteConfirm?.customerID
    );
    setSelectBusiness(foundItem);
    setSelectConfirmBusiness(foundConfirmItem) // for quote confirmation
  }, [quoteItemValue, customersListValue]);

  useEffect(() => {
    setPriceListItems(quoteItemValue?.documentItems);
    setquoteItems(quoteItemValue);
    getAllClientContacts();
    setItems(isQuoteConfirmation ? quoteConfirm?.documentContacts : quoteItemValue?.documentContacts);
    setSelectDate(isQuoteConfirmation ? quoteConfirm?.dueDate : quoteItemValue?.dueDate);
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
    }
  ];

  const documentTitle = documentsTitles.find(item => item.value === docType).label;


  return {
    dateRef,
    activeClickAway,
    selectDate,
    selectBusiness,
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
    updateClientAddress,
    onClickAddAddress,
    onClickDeleteAddress,
    onClickAddNewAddress,
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
    onOpenCopyFromOrder

  };
};

export { useQuoteNew };