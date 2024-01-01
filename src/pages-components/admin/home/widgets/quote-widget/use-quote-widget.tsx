import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote/store/quote";
import { getIfCartExistApi, saveDocumentApi } from "@/services/api-service/generic-doc/documents-api";

const useQuoteWidget = () => {
  const { t } = useTranslation();
  const { errorColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultUpdate } = useSnackBar();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const [productValue, setProductValues] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [userQuote, setUserQuote] = useState<any>(null);
  const [canOrder, setCanOrder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedClient, setSelectedClient] = useState<any>({});
  const [QuoteIfExist, setQuoteIfExist] =
    useRecoilState<any>(QuoteIfExistState);
  const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);

  const [selectedProduct, setSelectedProduct] = useState<any>({});

  const [isDisabled, setIsDisabled] = useState(true);
  const onClcikOpenModal = (quoteId: any) => {
    setOpenModal(true);
  };
  //PopOver Btns
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onClcikCloseModal = async () => {
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
  useEffect(() => {
    const isDisabled = checkVariables(
      selectedClientType,
      selectedClient,
      selectedProduct
    );
    setIsDisabled(isDisabled);
  }, [selectedClientType, selectedClient, selectedProduct]);

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllCustomersCreateQuote(e.target.value);
    }
  };
  const renderOptions = () => {
    return customersListCreateQuote;
  };

  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients: false,
      searchTerm: SearchTerm,
    });
  }, []);

  const handleClicktoSelectedCustomer = useCallback(
    async (clientIdifExist, value) => {
      setSelectedClient(value);

      const clientType = clientTypesValue.find(
        (c) => c.id == value?.clientTypeId
      );

      if (clientIdifExist != null && value?.id != null) {
        if (clientIdifExist != value?.id) {
          setOpenModal(true);
        }
      }

      if (clientType) {
        setSelectedClientType(clientType);
      } else {
        setSelectedClientType({});
      }
    },
    [clientTypesValue]
  );

  const getAndSetExistQuote = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setUserQuote(res?.data?.result)
      }
    }
    await getIfCartExistApi(callApi, callBack,
      { documentType: 0 })
  }

  const updateQuoteExist = useCallback(async () => {
    await getAndSetExistQuote();
  }, []);

  const updateCustomerList = useCallback(async () => {
    setSelectedClient(null);
    setSelectedClientType(null);
  }, []);
  const updateCustomerListSelectedAfterConfirm = useCallback(
    async (selectedCustomersList) => {
      setSelectedClient(selectedCustomersList);
    },
    []
  );

  useEffect(() => {
    getAllClientTypes();
    getAllProducts();
    getAndSetExistQuote();
  }, []);

  const onClickSaveQuote = async (quoteId) => {
    const callBack = (res) => {
      if (res?.success) {
        setquoteNumber(null);
        setQuoteIfExist(false);
        setUserQuote(null);
      } else {
        alertFaultUpdate();
      }
    }
    await saveDocumentApi(callApi, callBack, {
      documentType: 0,
      document: {
        documentId: quoteId,
      }
    })
  }

  const onClcikCreateQuote = () => {
    navigate(
      `/admin/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedClient?.id}&productId=${selectedProduct?.id}`
    );
  };
  const onClcikCreateQuoteForCustomer = () => {
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
      await getAndSetClientTypes(callApi, setClientTypesValues);
      if (userQuote?.result) {
        getAllCustomersCreateQuote(userQuote?.result?.clientName);
      } else {
        getAllCustomersCreateQuote();
      }
    } catch (error) {
      console.error("Error fetching client types:", error);
    }
  }, [callApi, userQuote]);


  return {
    clientTypesValue,
    productValue,
    customersListCreateQuote,
    isDisabled,
    id,
    updateCustomerList,
    openModal,
    getAndSetExistQuote,
    userQuote,
    open,
    errorColor,
    anchorEl,
    selectedClientType,
    handleClick,
    updateQuoteExist,
    onClcikOpenModal,
    selectedProduct,
    handleClose,
    onClcikCloseModal,
    setSelectedClientType,
    setSelectedClient,
    selectedClient,
    setSelectedProduct,
    updateCustomerListSelectedAfterConfirm,
    setOpenModal,
    setUserQuote,
    handleClicktoSelectedCustomer,
    checkWhatRenderArray,
    renderOptions,
    onClcikCreateQuote,
    onClcikCreateQuoteForCustomer,
    _renderErrorMessage,
    onClickSaveQuote,
  };
};

export { useQuoteWidget };
