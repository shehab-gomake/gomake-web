import { useCallback, useEffect, useState } from "react";
import {
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { getAndSetClientTypes } from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
  homeReportsState,
} from "@/pages-components/quote-new/store/quote";
import {
  createNewDocumentApi,
  getAllReportsApi,
  getIfCartExistApi,
  saveDocumentApi,
} from "@/services/api-service/generic-doc/documents-api";
import { selectedClientState } from "@/pages-components/quotes/states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { prevSelectedClientState, ProductCategoryType } from "./states";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { addDocumentItemFromMaterialApi } from "@/services/api-service/materials/materials-endpoints";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { EStatisticsLabels } from "@/pages-components/quotes/enums";
import { Permissions } from "@/components/CheckPermission/enum";
import { permissionsState } from "@/store/permissions";
import { getAllStuckJobsApi, getAllStuckJobsByAgentIdApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { userState } from "@/store/user";

const useQuoteWidget = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { alertFaultUpdate } = useSnackBar();
  const [clientTypesValue, setClientTypesValues] = useState([]);
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const [userQuote, setUserQuote] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<any>({});
  const [selectedClient, setSelectedClient] =
    useRecoilState<any>(selectedClientState);
  const [previousClient, setPreviousClient] = useRecoilState<any>(
    prevSelectedClientState
  );
  const permissions = useRecoilValue(permissionsState);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const setAllReports = useSetRecoilState<any>(homeReportsState);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [QuoteId, setQuoteId] = useState("");
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const [selectedTab, setSelectedTab] = useState<ETab>(ETab.PRODUCTS);

  const { renderOptions, checkWhatRenderArray, isFetching, listClient } =
    useCustomerDropDownList({});

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
    if (
      clientIdIfExist != null &&
      value?.id != null &&
      clientIdIfExist !== value?.id
    ) {
      handleOpenModal(value);
    } else {
      setSelectedClient(value);
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
          (c) => c.id === client?.clientTypeId
        );
        setSelectedClientType(clientType);
      }
    };
    await getIfCartExistApi(callApi, callBack, { documentType: 0 });
  };

  const getAllStuckJobs = async () => {
    const callBack = (res) => {
      setAllStuckJobs(res?.data);
    };
    await getAllStuckJobsApi(callApi, callBack);
  };
  const getAllStuckJobsByAgentId = async () => {
    const callBack = (res) => {
      setAllStuckJobs(res?.data);
    };
    await getAllStuckJobsByAgentIdApi(callApi, callBack,);
  };
  // useEffect(() => {
  //   getAllStuckJobs();
  //   getAllStuckJobsByAgentId();
  // }, []);

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
      await getAndSetClientTypes(callApi, setClientTypesValues, {
        cardType: CLIENT_TYPE_Id.CUSTOMER,
      });
    } catch (error) {
      console.error("Error fetching client types:", error);
    }
  }, [callApi, userQuote]);

  const [allStuckJobs, setAllStuckJobs] = useState(0);
  const user = useRecoilValue<any>(userState);
  useEffect(() => {
    if (permissions.includes(Permissions.SHOW_ALL_STUCK_JOBS_ANAYTICS)) {
      getAllStuckJobs();
    }
    else {
      if (user?.isAgent) {
        getAllStuckJobsByAgentId();
      }
    }
  }, [permissions]);

  const getAllReports = async () => {
    const callBack = (res) => {
      if (res?.success) {
        if (!permissions.includes(Permissions.SHOW_ALL_STUCK_JOBS_ANAYTICS) && !user?.isAgent) {
          setAllReports(res?.data);
        } else {
          setAllReports([...res?.data, {
            key: EStatisticsLabels.STUCK_JOBS,
            value: allStuckJobs
          }]);
        }
      }
    };
    await getAllReportsApi(callApi, callBack, {
      customerId: selectedClient?.id,
      productId: selectedProduct?.id,
    });
  };

  useEffect(() => {
    getAllProductsAndMaterials();
  }, [selectedClient, selectedClientType, selectedTab]);

  useEffect(() => {
    getAllReports();
  }, [selectedClient, selectedProduct, allStuckJobs]);

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
    handleClickToSelectedCustomer(userQuote?.client?.id, customer).then();
    setOpenCustomerModal(false);
  };

  const onCustomerAddFromOption = (customer) => {
    handleClickToSelectedCustomer(userQuote?.client?.id, customer).then();
  };

  const onClickAddCustomer = () => {
    setOpenCustomerModal(true);
  };
  const onCloseCustomerModal = () => {
    setOpenCustomerModal(false);
  };
  const [products, setProducts] = useState([]);
  const [combinedData, setCombinedData] = useState<any>([]);

  useEffect(() => {
    if (products?.length > 0 && combinedData?.length > 0) {
      const findDefaultProduct = products.find(
        (item) => item.isDefaultInHomePage
      );
      if (findDefaultProduct) {
        handleProductChange(findDefaultProduct?.id);
      }
    }
  }, [combinedData]);

  const getAllProductsAndMaterials = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        setProducts(res?.data?.products);
        const transformProducts = (products) => {
          return {
            value: ETab.PRODUCTS,
            selectable: false,
            title: t("tabs.products"),
            text: t("tabs.products"),
            level: 0,
            children: products.map((product) => ({
              value: product.id, // Using product id as the key
              title: product.name, // Using product name as the label,
              text: product.name,
              level: 1,
              category: ProductCategoryType.PRODUCT,
            })),
          };
        };

        const transformMaterials = (materials) => {
          return {
            value: ETab.MATERIALS,
            title: t("tabs.materials"),
            text: t("tabs.materials"),
            level: 0,
            selectable: false,
            children: materials.map((material) => ({
              value: material.materialTypeName,
              title: material.materialTypeName,
              text: material.materialTypeName,
              level: 1, // Material Types are level 1
              selectable: false,
              children: material.categories.map((category) => ({
                value: `${material.materialTypeName}-${category.categoryName}`,
                title: category.categoryName,
                text: category.categoryName,
                selectable: false,
                level: 2, // Categories are level 2
                children: category.rows.map((row) => ({
                  value: row.id,
                  title: row.value,
                  text: row.value,
                  level: 3, // Rows are level 3
                  category: ProductCategoryType.MATERIAL,
                })),
              })),
            })),
          };
        };

        const attachParentReferences = (nodes, parent = null) => {
          if (!Array.isArray(nodes)) return [];

          return nodes.map((node) => {
            const newNode = { ...node, parent };
            if (newNode.children) {
              newNode.children = attachParentReferences(
                newNode.children,
                newNode
              );
            }
            return newNode;
          });
        };
        const transformedProducts = transformProducts(res?.data?.products);
        const transformedMaterials = transformMaterials(res?.data?.materials);
        transformedProducts.children = attachParentReferences(
          transformedProducts.children,
          transformedProducts
        );
        transformedMaterials.children = attachParentReferences(
          transformedMaterials.children,
          transformedMaterials
        );

        // Combine the transformed data
        const combinedFinalData = [transformedProducts, transformedMaterials];
        setCombinedData(combinedFinalData);
      }
    };

    await getAllProductAndMaterialsApi(callApi, callBack, {
      clientId: selectedClient?.id,
      clientTypeId: selectedClientType?.id,
      selectionType: selectedTab,
    });
  }, [selectedClient, selectedClientType, selectedTab]);

  const handleProductChange = (e) => {
    const selectedValue = e;
    // Find the selected node from combinedData
    const findNodeByKey = (key, nodes) => {
      for (const node of nodes) {
        if (node.value === key) {
          return node;
        }
        if (node.children) {
          const found = findNodeByKey(key, node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const selectedNode = findNodeByKey(selectedValue, combinedData);

    if (selectedNode && !selectedNode.children) {
      setSelectedProduct({
        id: selectedValue,
        category: selectedNode?.category,
      });
    } else {
      setSelectedProduct(null);
    }
  };

  const addDocumentItemFromMaterial = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        navigate("/quote");
      } else {
        alertFaultAdded();
      }
    };
    await addDocumentItemFromMaterialApi(callApi, callBack, {
      clientId: selectedClient?.id,
      printHouseMaterialId: selectedProduct?.id,
    });
  };

  const onSelectTab = (v) => {
    setSelectedTab(v);
    localStorage.setItem("homePageSelectedTab", JSON.stringify(v));
  };

  const onClickCreateQuoteForCustomer = () => {
    if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
      addDocumentItemFromMaterial();
      return;
    }

    const hasSelectedClient = !!selectedClient?.id;

    if (hasSelectedClient) {
      const clientId = selectedClient.id;
      const clientName = selectedClient.name;
      const clientTypeId = selectedClientType?.id;

      if (!clientId || !clientTypeId || !selectedProduct?.id) {
        alertFaultUpdate();
        return;
      }

      navigate(
        `/products/create?clientTypeId=${clientTypeId}&customerId=${clientId}&customerName=${clientName}&productId=${selectedProduct.id}`
      );
    } else {
      // Navigate with just the productId
      if (!selectedProduct?.id) {
        alertFaultUpdate();
        return;
      }

      navigate(`/products/create?productId=${selectedProduct.id}`);
    }
  };

  const onclickCreateNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        navigate("/quote");
      } else {
        alertFaultUpdate();
      }
    };

    await createNewDocumentApi(callApi, callBack, {
      documentType: 0,
      ...(selectedClient?.id && { clientId: selectedClient?.id }),
    });
  };

  return {
    clientTypesValue,
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
    combinedData,
    handleProductChange,
    isFetching,
    selectedTab,
    setSelectedTab,
    onSelectTab,
    listClient,
    navigate,
    onclickCreateNew,
    onCustomerAddFromOption,
  };
};

export { useQuoteWidget };
