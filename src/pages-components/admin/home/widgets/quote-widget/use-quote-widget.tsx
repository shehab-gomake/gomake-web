import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  getAllProductsForDropDownList,
  getAndSetAllCustomers,
  getAndSetClientTypes,
  getAndSetExistQuotes,
  saveQuote,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useRecoilState } from "recoil";
import { QuoteIfExistState, QuoteNumberState } from "@/pages-components/quote/store/quote";


const useQuoteWidget = () => {
  const { t } = useTranslation();
  const { errorColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const [productValue, setProductValues] = useState([]);
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [QuoteExist, setQuoteExist] = useState<any>([]);
  const [canOrder, setCanOrder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedCustomersList, setSelectedCustomersList] = useState<any>({});
  const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);
  
  const [selectedProduct, setSelectedProduct] = useState<any>({});

  const [isDisabled, setIsDisabled] = useState(true);
  const onClcikOpenModal = (quoteId: any) => {
    setOpenModal(true); 
  };
  //PopOver Btns
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onClcikCloseModal =  async () => {
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
      selectedCustomersList,
      selectedProduct
    );
    setIsDisabled(isDisabled);
  }, [selectedClientType, selectedCustomersList, selectedProduct]);

  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllCustomersCreateQuote(e.target.value)
    } 
  };
  const renderOptions = () => {
      return customersListCreateQuote;
  };
  const getAllClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesValues);
  }, []);
  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductValues);
  }, []);
  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      onlyCreateOrderClients:  false,
      searchTerm:SearchTerm,
    });
  }, []);

  const handleClicktoSelectedCustomer = useCallback(async (clientIdifExist,value) =>{
    setSelectedCustomersList(value);

    const client = clientTypesValue.find(
      (c) => c.id == value?.clientTypeId
    );

  
    if(clientIdifExist != null && value?.id != null)
    {
      if(clientIdifExist != value?.id )
      {
        setOpenModal(true);
      }
    
    }

    if (client) {
      setSelectedClientType(client);
    } else {
      setSelectedClientType({});
    }
  
  },[clientTypesValue]);


  const getAndSetExistQuote = useCallback(async () => {
     await getAndSetExistQuotes(callApi, setQuoteExist);
  },[]);


  const updateQuoteExist = useCallback(async () =>{
   await getAndSetExistQuote();
  },[]);


  
  const updateCustomerList = useCallback (async ()=>{
    setSelectedCustomersList(null);
    setSelectedClientType(null);
  },[]);
  const updateCustomerListSelectedAfterConfirm = useCallback(async (selectedCustomersList)=>{
     setSelectedCustomersList(selectedCustomersList);
  
  },[])

  useEffect(() => {
    getAllClientTypes();
    getAllProducts();
    getAndSetExistQuote();
  }, []);



  const onClickSaveQuote = useCallback(async (QuoteId) => {
    setquoteNumber("");
    setQuoteIfExist("");
    
    await saveQuote(callApi,setQuoteExist, QuoteId);
  }, []);
  
  const onClcikCreateQuote = () => {
    navigate(
      `/admin/products/digital-offset-price?clientTypeId=${selectedClientType?.id}&customerId=${selectedCustomersList?.id}&productId=${selectedProduct?.id}`
    );
  };
  const onClcikCreateQuoteForCustomer = () => {
    navigate(
      `/products/create?clientTypeId=${selectedClientType?.id}&customerId=${selectedCustomersList?.id}&productId=${selectedProduct?.id}`
    );
  };
  const _renderErrorMessage = () => {
    if (!selectedCustomersList?.id) {
      return t("home.admin.pleaseSelectCustomer");
    }
    if (!selectedClientType?.id) {
      return t("home.admin.pleaseSelectClientType");
    }
    if (!selectedProduct?.id) {
      return t("home.admin.pleaseSelectProduct");
    }
  };

  useEffect(()=>{
      QuoteExist?.result ?  getAllCustomersCreateQuote(QuoteExist?.result?.clientName) : getAllCustomersCreateQuote();
  },[QuoteExist])


 
  return {
    clientTypesValue,
    productValue,
    customersListCreateQuote,
    isDisabled,
    id,
    updateCustomerList,
    openModal,
    getAndSetExistQuote,
    QuoteExist,
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
    setSelectedCustomersList,
    selectedCustomersList,
    setSelectedProduct,
    updateCustomerListSelectedAfterConfirm,
    setOpenModal,
    setQuoteExist,
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
