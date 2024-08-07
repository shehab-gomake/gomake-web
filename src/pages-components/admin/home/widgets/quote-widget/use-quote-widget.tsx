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
import { selectedClientState } from "@/pages-components/quotes/states";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { prevSelectedClientState } from "./states";
import { getPrintHouseMaterialCategoriesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";

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

  const [materialCategories, setMaterialCategories] = useState([]);


  const getMaterialCategories = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const mappedMaterials = res?.data?.map(option => ({ id: option.categoryKey, name: option?.categoryName }))

        setMaterialCategories(mappedMaterials);
      }
    };
    await getPrintHouseMaterialCategoriesApi(callApi, callBack, "Advertising Products");

  };

  // Select product/material
  const productsOptions = productValue.map((product) => ({
    ...product,
    title: product.name,
    category: product.category || t('home.admin.selectProduct'),
  }));

  const materialsOptions = materialCategories.map((material) => ({
    ...material,
    title: material.name,
    category: material.category || t('home.admin.selectMaterial'),
  }));

  const options = [...productsOptions, ...materialsOptions];
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter options based on search query
  const filteredOptions = options?.filter((option: any) =>
    option.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const [clientListData, setClientListData] = useState([])
  const getAllCustomersCreateOrder = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setClientListData, {
      ClientType: "C",
      onlyCreateOrderClients: true,
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
    getMaterialCategories();

    // new 
    getAllProductsNew();
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


  //  Add Customer / Search
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

  // last update 
  const [combinedData, setCombinedData] = useState<any>([]);

  const getAllProductsNew = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        const transformProducts = (products) => {
          return {
            key: 'products',
            label: 'Products',
            children: products.map(product => ({
              key: product.id, // Using product id as the key
              label: product.name // Using product name as the label
            }))
          };
        };

        const transformMaterials = (materials) => {
          return {
            key: 'materials',
            label: 'Materials',
            children: materials.map(material => ({
              key: material.materialTypeName, // Using materialTypeName as the key
              label: material.materialTypeName, // Using materialTypeName as the label
              children: material.categories.map(category => ({
                key: `${material.materialTypeName}-${category.categoryName}`, // Generate a unique key
                label: category.categoryName, // Using categoryName as the label
                children: category.rows.map(row => ({
                  key: row.id, // Using row id as the key
                  label: row.value // Using row value as the label
                }))
              }))
            }))
          };
        };

        const transformedProducts = transformProducts(res?.data?.products);
        const transformedMaterials = transformMaterials((res?.data?.materials));

        // Combine the transformed data
        const combinedFinalData = [transformedProducts, transformedMaterials];
        setCombinedData(combinedFinalData);
      }
    };

    if (selectedClient?.id && selectedClientType?.id)
      await getAllProductAndMaterialsApi(callApi, callBack, {
        clientId: selectedClient?.id,
        clientTypeId: selectedClientType?.id,
      });
  }, [selectedClient, selectedClientType]);


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
    getAllClientTypes,
    clientListData,
    options,
    filteredOptions,
    setSearchQuery,
    combinedData
  };
};

export { useQuoteWidget };