import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
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
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

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
  const { t } = useTranslation();

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

  const [selectDate, setSelectDate] = useState(quoteItemValue?.dueDate);

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

  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
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

  useEffect(() => {
    getAllCustomers();
  }, []);

  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<
    number | null
  >(null);
  const [isUpdatePurchaseNumer, setIsUpdatePurchaseNumer] = useState<
    number | null
  >(null);
  const [, setIsUpdateBusinessCode] = useState<number | null>(null);
  const [isUpdateAddress, setIsUpdateAddress] = useState<number | null>(null);
  const [isUpdateAgent, setIsUpdateAgent] = useState<number | null>(null);

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

  const [selectedAgent, setSelectedAgent] = useState<any>();

  const [agentListValue, setAgentListValue] =
    useRecoilState<any>(agentListsState);
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

  const [isDisplayWidget, setIsDisplayWidget] = useState(false);
  const [items, setItems] = useState([]);
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);

  const [isUpdateContactName1, setIsUpdateContactName1] = useState(null);
  const [isUpdateContactEmail1, setIsUpdateContactEmail1] = useState(null);
  const [isUpdateContactMobile1, setIsUpdateContactMobile1] = useState(null);

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

  const [clientContactsValue, setClientContactsValue] =
    useRecoilState<any>(clientContactsState);

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

  const [selectedContactById, setSelectedContactById] = useState<any>();
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

  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
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
  const [openAddNewItemModal, setOpenAddNewItemModal] = useState(false);
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
  const [qouteItemId, setQuateItemId] = useState();
  const [
    openDuplicateWithDifferentQTYModal,
    setOpenDuplicateWithDifferentQTYModal,
  ] = useState(false);
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
  const [amountVlue, setAmountValue] = useState();
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
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
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
  return {
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
  };
};

export { useQuoteNew };
