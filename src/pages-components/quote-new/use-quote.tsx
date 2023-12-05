import { useCallback, useEffect, useRef, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetClientContacts,
  getAndSetQuotesByUserId,
} from "@/services/hooks";
import {
  agentListsState,
  businessListsState,
  clientContactsState,
  quoteItemState,
} from "@/store";
import { QuoteStatuses } from "@/widgets/quote/total-price-and-vat/enums";

const useQuoteNew = () => {
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

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const [selectDate, setSelectDate] = useState(quoteItemValue?.dueDate);
  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<
    number | null
  >(null);
  const [isUpdatePurchaseNumer, setIsUpdatePurchaseNumer] = useState<
    number | null
  >(null);
  const [, setIsUpdateBusinessCode] = useState<number | null>(null);
  const [isUpdateAddress, setIsUpdateAddress] = useState<number | null>(null);
  const [isUpdateAgent, setIsUpdateAgent] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const [agentListValue, setAgentListValue] =
    useRecoilState<any>(agentListsState);
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
    useRecoilState<any>(clientContactsState);
  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
  const [openAddNewItemModal, setOpenAddNewItemModal] = useState(false);
  const [qouteItemId, setQuateItemId] = useState();
  const [
    openDuplicateWithDifferentQTYModal,
    setOpenDuplicateWithDifferentQTYModal,
  ] = useState(false);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [amountVlue, setAmountValue] = useState();
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
  const [priceListItems, setPriceListItems] = useState<any>([]);
  const [quoteItems, setquoteItems] = useState<any>([]);
  const [anchorElCancelBtn, setAnchorElCancelBtn] =
    useState<null | HTMLElement>(null);
  const [anchorElSendBtn, setAnchorElSendBtn] = useState<null | HTMLElement>(
    null
  );
  const [anchorElSettingMenu, setAnchorElSettingMenu] =
    useState<null | HTMLElement>(null);
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

  const getQuote = useCallback(async () => {
    await getAndSetQuotesByUserId(callApi, setQuoteItemValue);
  }, []);

  const updateDueDate = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/update-due-date`,
      {
        quoteId: quoteItemValue?.id,
        dueDate: selectDate,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      getQuote();
    } else {
      alertFaultAdded();
    }
  }, [quoteItemValue, selectDate]);
  useEffect(() => {
    getQuote();
  }, []);

  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);

  useEffect(() => {
    const foundItem = customersListValue.find(
      (item: any) => item.id === quoteItemValue?.customerID
    );
    setSelectBusiness(foundItem);
  }, [quoteItemValue, customersListValue]);


  // better to export to another file 
  useEffect(() => {
    getAllCustomers();
  }, []);

  const onBlurBusinessName = async () => {
    setIsUpdateBusinessName(null);
  };
  const onBlurPurchaseNumer = async () => {
    setIsUpdatePurchaseNumer(null);
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


 


  const getAllEmployees = useCallback(async () => {
    await getAndSetAllEmployees(callApi, setAgentListValue, {
      isAgent: true,
    });
  }, []);
  useEffect(() => {
    if (agentListValue?.length > 0) {
      const selectedAgent1 = agentListValue.find(
        (agent) => agent.value === quoteItemValue?.agentId
      );
      setSelectedAgent(selectedAgent1);
    }
  }, [agentListValue, quoteItemValue]);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const updateAgent = useCallback(
    async (item: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/update-agent`,
        {
          quoteId: quoteItemValue?.id,
          agentId: item?.value,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateAgent(null);
        getQuote();
      } else {
        alertFaultUpdate();
      }
    },
    [quoteItemValue]
  );
  const onBlurContactName = async () => {
    setIsUpdateContactName(null);
    setIsDisplayWidget(false);
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

  useEffect(() => {
    setItems(quoteItemValue?.quoteContacts);
  }, [quoteItemValue]);

  const updateClientContact = useCallback(async (item: any) => {
    const res = await callApi(
      "PUT",
      `/v1/erp-service/quote/update-quote-contact`,
      {
        id: item?.id,
        contactID: item?.contactID,
        contactName: item?.contactName,
        contactMail: item?.contactMail,
        contactPhone: item?.contactPhone,
        quoteID: item?.quoteID,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      setIsUpdateContactEmail(null);
      setIsUpdateContactName(null);
      setIsUpdateContactMobile(null);
      getQuote();
    } else {
      alertFaultUpdate();
    }
  }, []);

  const getAllClientContacts = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientContacts(callApi, setClientContactsValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

  useEffect(() => {
    getAllClientContacts();
  }, [quoteItemValue]);

  const [displayedItems, setDisplayedItems] = useState(2);
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

  const onClickAddNewContact = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/add-quote-contact`,
      {
        contactID: selectedContactById?.id,
        contactName: selectedContactById?.name,
        contactMail: selectedContactById?.mail,
        contactPhone: selectedContactById?.phone,
        quoteID: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      setIsDisplayWidget(false);
      getQuote();
    } else {
      alertFaultAdded();
    }
  }, [selectedContactById, quoteItemValue]);

  const onOpenDeleteModalContact = (item) => {
    setSelectedContact(item);
    setOpenDeleteModalContact(true);
  };
  const onCloseDeleteModalContact = () => {
    setOpenDeleteModalContact(false);
  };
  const onClickDeleteContact = useCallback(async (item: any) => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/erp-service/quote/delete-quote-contact?quoteContactId=${item?.id}`
    );
    if (res?.success) {
      alertSuccessDelete();
      onCloseDeleteModalContact();
      getQuote();
    } else {
      alertFaultDelete();
    }
  }, []);
  const onOpenNewItem = () => {
    setOpenAddNewItemModal(true);
  };
  const onCloseNewItem = () => {
    setOpenAddNewItemModal(false);
  };

  const getCalculateQuoteItem = useCallback(
    async (quoteItemId: string, calculationType: number, data: number) => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/quote/get-calculate-quote-item`,
        {
          QuoteItemId: quoteItemId,
          data,
          calculationType,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    },
    [quoteItemValue]
  );

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

  const duplicateQuoteItemWithAnotherQuantity = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/duplicate-quote-with-another-quantity`,
      {
        quoteItemId: qouteItemId,
        amount: parseInt(amountVlue),
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      onCloseDuplicateWithDifferentQTY();
      getQuote();
    } else {
      alertFaultAdded();
    }
  }, [qouteItemId, amountVlue]);
  const onCloseDeleteItemModal = () => {
    setOpenDeleteItemModal(false);
  };
  const onOpenDeleteItemModal = () => {
    setOpenDeleteItemModal(true);
  };
  const deleteQuoteItem = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/erp-service/quote/delete-quote-item?QuoteItemId=${qouteItemId}`
    );
    if (res?.success) {
      alertSuccessDelete();
      onCloseDeleteItemModal();
      getQuote();
    } else {
      alertFaultDelete();
    }
  }, [qouteItemId]);

  const onClickDeleteQouteItem = (quoteItem) => {
    onOpenDeleteItemModal();
    setQuateItemId(quoteItem?.id);
  };

  const getCalculateQuote = useCallback(
    async (calculationType: number, data: number) => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/quote/get-calculate-quote`,
        {
          QuoteId: quoteItemValue?.id,
          data,
          calculationType,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();

        getQuote();
      } else {
        alertFaultUpdate();
      }
    },
    [quoteItemValue]
  );

  useEffect(() => {
    setPriceListItems(quoteItemValue?.priceListItems);
  }, [quoteItemValue]);

  const changepriceListItems = (
    index: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...priceListItems];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setPriceListItems(temp);
  };

  const changepriceListItemsChild = (
    parentIndex: number,
    childInex: number,
    filedName: string,
    value: any
  ) => {
    let temp = lodashClonedeep(priceListItems);
    temp[parentIndex].childsQuoteItems[childInex] = {
      ...temp[parentIndex].childsQuoteItems[childInex],
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
  useEffect(() => {
    setquoteItems(quoteItemValue);
  }, [quoteItemValue]);
  const dateRef = useRef(null);
  const [activeClickAway, setActiveClickAway] = useState(false);
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
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  useEffect(() => {
    setSelectDate(quoteItemValue?.dueDate);
  }, [quoteItemValue]);

  const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
  const [openIrreleventCancelModal, setOpenIrreleventCancelModal] =
    useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] =
    useState(false);

  const onClcikOpenIrreleventModal = () => {
    setOpenIrreleventCancelModal(true);
  };
  const onClcikCloseIrreleventModal = () => {
    setOpenIrreleventCancelModal(false);
  };

  const onClcikOpenPriceModal = () => {
    setOpenPriceCancelModal(true);
  };
  const onClcikClosePriceModal = () => {
    setOpenPriceCancelModal(false);
  };

  const onClcikOpenDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClcikCloseDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(false);
  };
  const onClcikOpenModal = () => {
    setOpenOtherReasonModal(true);
  };
  const onClcikCloseModal = () => {
    setOpenOtherReasonModal(false);
  };
  const onClickCancelOffer = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/cancel-quote-state`,
      {
        quoteId: quoteItemValue?.id,
        quoteStatus: QuoteStatuses.CANCELED_OTHER,
        cancelText: reasonText,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      navigate("/home");
    } else {
      alertFaultUpdate();
    }
  }, [quoteItemValue, reasonText]);

  const updateCancelQuote = useCallback(
    async (quoteStatus: number) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/cancel-quote-state`,
        {
          quoteId: quoteItemValue?.id,
          quoteStatus: quoteStatus,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        navigate("/home");
      } else {
        alertFaultUpdate();
      }
    },

    [quoteItemValue]
  );

  const onClickSendQuoteToClient = useCallback(
    async (messageType: number) => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/quote/send-quote-to-clinet`,
        {
          quoteId: quoteItemValue?.id,
          messageType,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
      } else {
        alertFaultAdded();
      }
    },
    [quoteItemValue]
  );




  const onChangeSelectBusiness = useCallback(
    async (item: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/change-client`,
        {
          quoteID: quoteItemValue?.id,
          clientId: item?.id,
          userId: quoteItemValue?.userID,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    },
    [selectBusiness, quoteItemValue]
  );


  return {
    dateRef,
    activeClickAway,
    selectDate,
    selectBusiness,
    isUpdateBusinessName,
    isUpdatePurchaseNumer,
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
    priceListItems,
    quoteItems,
    tableHeaders,
    anchorElCancelBtn,
    anchorElSendBtn,
    openSendBtn,
    openCancelBtn,
    openOtherReasonModal,
    openIrreleventCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    anchorElSettingMenu,
    openSettingMenu,
    onClickSendQuoteToClient,
    handleSettingMenuClick,
    handleSettingMenuClose,
    onClcikOpenPriceModal,
    onClcikOpenModal,
    onClcikClosePriceModal,
    onClcikOpenDeliveryTimeModal,
    onClcikCloseDeliveryTimeModal,
    onClcikCloseModal,
    onClcikOpenIrreleventModal,
    onClcikCloseIrreleventModal,
    handleCancelBtnClick,
    handleCancelBtnClose,
    handleSendBtnClick,
    handleSendBtnClose,
    handleClickSelectDate,
    setActiveClickAway,
    changeQuoteItems,
    changepriceListItemsChild,
    changepriceListItems,
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
    setIsUpdatePurchaseNumer,
    setIsUpdateBusinessCode,
    onBlurBusinessName,
    onBlurPurchaseNumer,
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
    onChangeSelectBusiness
  };
};

export { useQuoteNew };
