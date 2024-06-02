import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
  homeReportsState,
} from "@/pages-components/quote-new/store/quote";
import {
  getAllReportsApi,
  getIfCartExistApi,
  saveDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { ITab } from "@/components/tabs/interface";
import { selectedClientState } from "@/pages-components/quotes/states";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { prevSelectedClientState } from "./states";

const useQuoteWidget = ({ documentType = 0 }: any) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultUpdate } = useSnackBar();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const [productValue, setProductValues] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [userQuote, setUserQuote] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedClient, setSelectedClient] = useRecoilState<any>(selectedClientState);
  const [previousClient, setPreviousClient] = useRecoilState<any>(prevSelectedClientState);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const setAllReports = useSetRecoilState<any>(homeReportsState);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [QuoteId, setQuoteId] = useState("");
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);

  const onClickOpenModal = (quoteId: any) => {
    setOpenModal(true);
  };

  //PopOver Btns
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onClickCloseModal = async () => {
    setOpenModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const checkVariables = (var1, var2, var3) => {
    if (var1?.id && var2?.id && var3?.id) {
      return false;
    } else {
      return true;
    }
  };

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllCustomersCreateQuote(e.target.value);
    }
  };
  const renderOptions = () => {
    return customersListCreateQuote;
  };
  const getAllProducts = useCallback(async () => {
    if (selectedClient?.id && selectedClientType?.id)
      await getAllProductsForDropDownList(callApi, setProductValues, {
        clientId: selectedClient?.id,
        clientTypeId: selectedClientType?.id,
      });
  }, [selectedClient, selectedClientType]);

  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: documentType === DOCUMENT_TYPE.purchaseOrder || documentType === DOCUMENT_TYPE.purchaseInvoice || documentType === DOCUMENT_TYPE.purchaseInvoiceRefund ? "S" : "C",
      onlyCreateOrderClients: documentType != DOCUMENT_TYPE.quote ? true : false,
      searchTerm: SearchTerm,
    });
  }, []);

  const handleOpenModal = (newClient) => {
    //setPreviousClient(selectedClient ? selectedClient : previousClient);
    setPreviousClient(selectedClient);
    setSelectedClient(newClient);
    setOpenModal(true);
  };

  const handleCancel = async () => {
    setSelectedClient(previousClient);
    setOpenModal(false);
  };

  const handleClickToSelectedCustomer = async (clientIdIfExist, value) => {
    // if (!value) {
    //   setPreviousClient(selectedClient);
    // }
    if (clientIdIfExist != null && value?.id != null && clientIdIfExist !== value?.id) {
      handleOpenModal(value);
    }
    else {
      setSelectedClient(value)
    }
  };

  const getCustomerType = useCallback(() => {
    const clientType = clientTypesValue.find(
      (c) => c.id === selectedClient?.clientTypeId
    );
    return clientType || null;
  }, [selectedClient, clientTypesValue]);

  useEffect(() => {
    setSelectedClientType(getCustomerType());
  }, [selectedClient, getCustomerType]); // Ensure client type is updated when selectedClient changes


  const getAndSetExistQuote = async () => {
    const callBack = (res) => {
      if (res?.data?.succ) {
        const { result } = res.data;
        const { id, number, client } = result;
        setUserQuote(result);
        setQuoteId(id);
        setQuoteNumber(number);
        setQuoteIfExist(true);
        setSelectedClient(client);
        const clientType = clientTypesValue.find(
          (c) => c.id === client.clientTypeId
        );
        setSelectedClientType(clientType);
      }
    };
    await getIfCartExistApi(callApi, callBack, { documentType: 0 });
  };


  const onClickSaveQuote = async (quoteId) => {
    const callBack = (res) => {
      if (res?.success) {
        setQuoteNumber(null);
        setQuoteIfExist(false);
        setUserQuote(null);
        /////////////////////////////////////
      } else {
        alertFaultUpdate();
      }
    };
    await saveDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quoteId,
      },
    });
  };


  const onClickCreateQuote = () => {
    navigate(
      `/admin/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedClient?.id}&productId=${selectedProduct?.id}`
    );
  };

  const onClickCreateQuoteForCustomer = () => {
    navigate(
      `/products/create?clientTypeId=${selectedClientType?.id}&customerId=${selectedClient?.id}&productId=${selectedProduct?.id}`
    );
  };

  const _renderErrorMessage = () => {
    if (!selectedClient?.id) {
      return t("home.admin.pleaseSelectCustomer");
    }
    if (!selectedClientType?.id) {
      return t("home.admin.pleaseSelectClientType");
    }
    if (!selectedProduct?.id) {
      return t("home.admin.pleaseSelectProduct");
    }
  };

  // what is userQuote?.result !!!
  const getAllClientTypes = useCallback(async () => {
    try {
      await getAndSetClientTypes(callApi, setClientTypesValues, { cardType: CLIENT_TYPE_Id.CUSTOMER });
      if (userQuote?.result) {
        getAllCustomersCreateQuote(userQuote?.result?.clientName);
      } else {
        getAllCustomersCreateQuote();
      }
    } catch (error) {
      console.error("Error fetching client types:", error);
    }
  }, [callApi, userQuote]);

  const tabs: ITab[] = [
    {
      title: t("home.tabs.Quotes"),
      component: (
        <QuotesListPageWidget
          documentType={DOCUMENT_TYPE.quote}
          isFromHomePage={true}
        />
      ),
    },
    {
      title: t("home.tabs.Orders"),
      component: (
        <QuotesListPageWidget
          documentType={DOCUMENT_TYPE.order}
          isFromHomePage={true}
        />
      ),
    },
  ];

  const getAllReports = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setAllReports(res?.data)
      }
    };
    await getAllReportsApi(callApi, callBack, { customerId: selectedClient?.id, productId: selectedProduct?.id });
  };

  useEffect(() => {
    getAllProducts();
  }, [selectedClient, selectedClientType]);

  useEffect(() => {
    getAllReports();
  }, [selectedClient, selectedProduct])


  useEffect(() => {
    const isDisabled = checkVariables(
      selectedClientType,
      selectedClient,
      selectedProduct
    );
    setIsDisabled(isDisabled);

  }, [selectedClientType, selectedClient, selectedProduct]);


  // Add Customer / Search
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [customer, setCustomer] = useState([]);

  const onCustomerAdd = (customer) => {
    setOpenCustomerModal(false)
  }

  const onClickAddCustomer = () => {
    setOpenCustomerModal(true)
  }
  const onCloseCustomerModal = () => {
    setOpenCustomerModal(false)
  }

  return {
    clientTypesValue,
    productValue,
    customersListCreateQuote,
    isDisabled,
    id,
    openModal,
    getAndSetExistQuote,
    userQuote,
    open,
    anchorEl,
    selectedClientType,
    handleClick,
    onClickOpenModal,
    selectedProduct,
    handleClose,
    onClickCloseModal,
    setSelectedClientType,
    setSelectedClient,
    selectedClient,
    setSelectedProduct,
    setOpenModal,
    setUserQuote,
    handleClickToSelectedCustomer,
    checkWhatRenderArray,
    renderOptions,
    onClickCreateQuote,
    onClickCreateQuoteForCustomer,
    _renderErrorMessage,
    onClickSaveQuote,
    tabs,
    getAllReports,
    openCustomerModal,
    customer,
    setCustomer,
    onCustomerAdd,
    onClickAddCustomer,
    onCloseCustomerModal,
    handleCancel,
    previousClient,
    QuoteId,
    setQuoteId,
    getAllClientTypes
  };
};

export { useQuoteWidget };