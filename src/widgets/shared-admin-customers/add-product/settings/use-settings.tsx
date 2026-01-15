import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllGroups,
  getAllTemplets,
  getAlltProductSKU,
  getAndSetAllCustomers,
  getAndSetClientTypes,
  getAndSetRecentCustomers,
} from "@/services/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import {
  EProductClient,
  EProductStructureType,
  ProductClient,
} from "./settings-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { CLIENT_TYPE_Id, CLIENT_TYPE } from "@/pages/customers/enums";
import { useSetRecoilState } from "recoil";
import {
  EWidgetProductSettingsTabs,
  selectedProductsTabState,
} from "@/widgets/products-settings-widget/enums";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";

const useSettings = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
}) => {
  console.log("productState", productState);
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { query } = useRouter();
  const { id } = query;
  const { t } = useTranslation();
  const {
    setSnackbarStateValue,
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessDelete,
    alertSuccessUpdate,
    alertFaultUpdate,
    alertFault,
    alertFaultDelete,
  } = useSnackBar();
  const setSelectedTabValue = useSetRecoilState<number>(
    selectedProductsTabState
  );
  const [RandomId, setRandomId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
  const [openPricingTypeModal, setOpenPricingTypeModal] =
    useState<boolean>(false);
  const [selectPricingType, setPricingType] = useState({});

  const onClickOpenPricingType = (value) => {
    setPricingType(value);
    setOpenPricingTypeModal(true);
  };
  const onClickClosePricingType = () => {
    setOpenPricingTypeModal(false);
  };

  useEffect(() => {
    setRandomId(uuidv4());
  }, []);

  const [allProductSKU, setAllProductSKU] = useState<any>();
  const [allTemplate, setAllTemplate] = useState<any>();
  const [allGroups, setAllGroups] = useState<any>();

  const getAllProductsSKU = useCallback(async () => {
    await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);

  const getAllTemplate = useCallback(async () => {
    await getAllTemplets(callApi, setAllTemplate);
  }, []);

  const getAllGroupsF = useCallback(async () => {
    await getAllGroups(callApi, setAllGroups);
  }, []);

  useEffect(() => {
    getAllProductsSKU();
    getAllTemplate();
    getAllGroupsF();
  }, []);

  const [isProductSKU, setIsProductSKU] = useState(false);
  const onClickCloseProductSKU = () => {
    setIsProductSKU(false);
    setErrorName(false);
    setErrorCode(false);
    setProductSKU(INIT_PRODUCT_SKU_STATE);
  };

  const onClickOpenProductSKU = () => {
    setIsProductSKU(true);
  };

  // const [productSKU, setProductSKU] = useState<any>([]);
  const INIT_PRODUCT_SKU_STATE = {
    name: "",
    code: "",
    productionFloorJobColor: "#2e3092",
    printerId: 0,
    printerBin: "",
  };
  const [productSKU, setProductSKU] = useState(INIT_PRODUCT_SKU_STATE);
  const [errorName, setErrorName] = useState(false);
  const [errorCode, setErrorCode] = useState(false);

  const onChangeStateProductSKU = useCallback(
    (fieldName: string, value: any) => {
      setProductSKU((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    []
  );

  const createNewProductSKU = useCallback(async () => {
    if (productSKU?.name?.length > 0 && productSKU?.code?.length > 0) {
      const res = await callApi(
        "POST",
        `/v1/printhouse-config/productsSKU/create-product-sku`,
        {
          ...productSKU,
          productionFloorJobColor: productSKU?.productionFloorJobColor,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        getAllProductsSKU();
        setProductSKU(INIT_PRODUCT_SKU_STATE);
      } else {
        alertFaultAdded();
      }
    } else {
      if (productSKU?.name?.length > 0) {
        setErrorName(false);
      } else {
        setErrorName(true);
      }
      if (productSKU?.code?.length > 0) {
        setErrorCode(false);
      } else {
        setErrorCode(true);
      }
    }
  }, [productSKU, errorName, errorCode]);

  const createNewProduct = useCallback(async () => {
    const structureTypeValue =
      typeof productState?.productStructureType === "object"
        ? productState?.productStructureType?.id
        : productState?.productStructureType ?? EProductStructureType.BASE;

    const isCompositeStructure =
      structureTypeValue === EProductStructureType.COMPOSITE;

    if (!productState?.name) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
      return;
    }

    if (isCompositeStructure) {
      if (
        !productState?.compositeProductIds ||
        productState?.compositeProductIds?.length === 0
      ) {
        setSnackbarStateValue({
          state: true,
          message: t("products.addProduct.admin.requiredField"),
          type: "error",
        });
        return;
      }
    } else if (!productState?.productSKUId || !productState?.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
      return;
    }

    const payload: any = {
      id: RandomId,
      name: productState?.name,
      details: productState?.details,
      groups: productState?.groups?.map((item) => item),
      deliveryTime: productState?.deliveryTime,
      startingPrice: productState?.startingPrice,
      additionPrice: productState?.additionPrice,
      noteColor: productState?.noteColor,
      textColor: productState?.textColor,
      productionFloorJobColor: productState?.productionFloorJobColor,
      clients: productState?.clients,
      clientsTypes: productState?.clientsTypes,
      productStructureType: structureTypeValue,
      translations: productState?.translations || [],
    };

    if (isCompositeStructure) {
      payload.compositeProductIds = productState?.compositeProductIds ?? [];
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      // Don't send templateId when Composite is selected
    } else {
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      payload.templateId =
        typeof productState?.templateId === "string"
          ? productState?.templateId
          : productState?.templateId?.id;
    }

    const res = await callApi(
      "POST",
      `/v1/printhouse-config/products/create-product`,
      payload
    );
    if (res?.success) {
      alertSuccessAdded();
      setSelectedTabValue(EWidgetProductSettingsTabs.PRODUCT_MANAGMENT);
    } else {
      if (res?.errors?.statusCode === 2627) {
        alertFault(t("products.offsetPrice.admin.productAlreadyExists"));
      } else {
        alertFaultAdded();
      }
    }
  }, [productState, RandomId]);

  const createNewProductAndGoToParameterList = useCallback(async () => {
    const structureTypeValue =
      typeof productState?.productStructureType === "object"
        ? productState?.productStructureType?.id
        : productState?.productStructureType ?? EProductStructureType.BASE;

    const isCompositeStructure =
      structureTypeValue === EProductStructureType.COMPOSITE;

    if (!productState?.name) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
      return;
    }

    if (isCompositeStructure) {
      if (
        !productState?.compositeProductIds ||
        productState?.compositeProductIds?.length === 0
      ) {
        setSnackbarStateValue({
          state: true,
          message: t("products.addProduct.admin.requiredField"),
          type: "error",
        });
        return;
      }
    } else if (!productState?.productSKUId || !productState?.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
      return;
    }

    const payload: any = {
      id: RandomId,
      name: productState?.name,
      details: productState?.details,
      groups: productState?.groups?.map((item) => item),
      deliveryTime: productState?.deliveryTime,
      startingPrice: productState?.startingPrice,
      additionPrice: productState?.additionPrice,
      noteColor: productState?.noteColor,
      textColor: productState?.textColor,
      productionFloorJobColor: productState?.productionFloorJobColor,
      clients: productState?.clients,
      clientsTypes: productState?.clientsTypes,
      additionProfits: productState?.additionProfits,
      externalCode: productState?.externalCode,
      productStructureType: structureTypeValue,
      translations: productState?.translations || [],
    };

    if (isCompositeStructure) {
      payload.compositeProductIds = productState?.compositeProductIds ?? [];
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      // Don't send templateId when Composite is selected
    } else {
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      payload.templateId =
        typeof productState?.templateId === "string"
          ? productState?.templateId
          : productState?.templateId?.id;
    }

    const res = await callApi(
      "POST",
      `/v1/printhouse-config/products/create-product`,
      payload
    );
    if (res?.success) {
      alertSuccessAdded();
      navigate(`/settings/products/edit/${RandomId}?isParameter=${true}`);
      onClickParametersTab();
    } else {
      if (res?.errors?.statusCode === 2627) {
        alertFault(t("products.offsetPrice.admin.productAlreadyExists"));
      } else {
        alertFaultAdded();
      }
    }
  }, [productState, RandomId]);

  const updatedProduct = useCallback(async () => {
    const structureTypeValue =
      typeof productState?.productStructureType === "object"
        ? productState?.productStructureType?.id
        : productState?.productStructureType ?? EProductStructureType.BASE;

    const isCompositeStructure =
      structureTypeValue === EProductStructureType.COMPOSITE;

    if (!productState?.name) {
      setSnackbarStateValue({
        state: true,
        message: t("products.offsetPrice.admin.errorReq"),
        type: "error",
      });
      return;
    }

    if (isCompositeStructure) {
      if (
        !productState?.compositeProductIds ||
        productState?.compositeProductIds?.length === 0
      ) {
        setSnackbarStateValue({
          state: true,
          message: t("products.offsetPrice.admin.errorReq"),
          type: "error",
        });
        return;
      }
    } else if (!productState?.productSKUId || !productState?.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.offsetPrice.admin.errorReq"),
        type: "error",
      });
      return;
    }

    const payload: any = {
      id: id,
      name: productState?.name,
      details: productState?.details,
      groups: productState?.groups?.map((item) => item),
      deliveryTime: productState?.deliveryTime,
      startingPrice: productState?.startingPrice,
      additionPrice: productState?.additionPrice,
      noteColor: productState?.noteColor,
      textColor: productState?.textColor,
      productionFloorJobColor: productState?.productionFloorJobColor,
      status: true,
      clients: productState?.clients,
      clientsTypes: productState?.clientsTypes,
      additionProfits: productState?.additionProfits,
      externalCode: productState?.externalCode,
      minimumPrice:
        productState?.minimumPrice === "" ? 0 : productState?.minimumPrice,
      productStructureType: structureTypeValue,
      translations: productState?.translations || [],
    };

    if (isCompositeStructure) {
      payload.compositeProductIds = productState?.compositeProductIds ?? [];
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      // Don't send templateId when Composite is selected
    } else {
      payload.productSKUId =
        typeof productState?.productSKUId === "string"
          ? productState?.productSKUId
          : productState?.productSKUId?.id;
      payload.templateId =
        typeof productState?.templateId === "string"
          ? productState?.templateId
          : productState?.templateId?.id;
    }

    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/products/update-product-settings`,
      payload
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [productState, RandomId]);

  const [SelectproductClient, setSelectProductClient] =
    useState<ProductClient>();
  const [customersList, setCustomersList] = useState([]);
  const [clientTypesList, setClientTypesList] = useState([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isRecentSource, setIsRecentSource] = useState<boolean>(true);
  const [selectedCustomersCache, setSelectedCustomersCache] = useState<any[]>([]);
  const { productList: productsList } = useAllProductsDropDownList();
  const productClientsList: ProductClient[] = useMemo(
    () => [
      {
        label: t("products.addProduct.admin.allCustomers"),
        id: EProductClient.ALL_CUSTOMERS,
      },
      {
        label: t("products.addProduct.admin.byClient"),
        id: EProductClient.BY_CLIENT,
      },
      {
        label: t("products.addProduct.admin.byClientType"),
        id: EProductClient.BY_CLIENT_TYPE,
      },
    ],
    []
  );

  const getAllClients = useCallback(
    async (SearchTerm?: string) => {
      if (SearchTerm) {
        setIsFetching(true);
      }
      setIsRecentSource(false);
      await getAndSetAllCustomers(callApi, setCustomersList, {
        clientType: CLIENT_TYPE.CUSTOMER,
        onlyCreateOrderClients: false,
        searchTerm: SearchTerm as string,
      });
      setIsFetching(false);
    },
    []
  );

  const getRecentClients = useCallback(async () => {
    setIsRecentSource(true);
    await getAndSetRecentCustomers(callApi, setCustomersList, {
      ClientType: CLIENT_TYPE.CUSTOMER,
    });
  }, []);

  const debouncedGetAllClients = useDebouncedCallback((value: string) => {
    getAllClients(value);
  }, 1200);

  const checkWhatRenderArray = (e: any) => {
    const value = e?.target?.value?.trim();
    if (value === "") {
      debouncedGetAllClients.cancel();
      getRecentClients();
    } else {
      debouncedGetAllClients(value);
    }
  };

  const renderOptions = (selectedCustomerIds?: string[]) => {
    const additionalOption = {
      name: t("general.searchMore"),
      id: "searchMore",
      isInfo: true,
    };
    const additionalOption1 = {
      name: `—— ${t("general.recentOptions")} ——`,
      id: "recentOptions",
      isInfo: true,
    };

    const noOptions = {
      name: t("general.addYourFirstCustomer"),
      id: "addClient",
      isInfo: true,
    };

    // Merge selected customers that aren't in the current list
    const currentCustomerIds = new Set(customersList.map((c: any) => c.id));
    const missingSelectedCustomers = selectedCustomersCache.filter(
      (c: any) => selectedCustomerIds?.includes(c.id) && !currentCustomerIds.has(c.id)
    );
    const mergedCustomersList = [...customersList, ...missingSelectedCustomers];

    if (isRecentSource) {
      if (mergedCustomersList.length === 0) {
        return [noOptions];
      }
      return [additionalOption1, ...mergedCustomersList, additionalOption];
    }

    return mergedCustomersList;
  };

  // Update selected customers cache when customers are selected
  const updateSelectedCustomersCache = useCallback((selectedIds: string[], selectedCustomers?: any[]) => {
    if (!selectedIds || selectedIds.length === 0) {
      setSelectedCustomersCache([]);
      return;
    }

    setSelectedCustomersCache((prevCache) => {
      const newSelectedIds = new Set(selectedIds);

      // Keep only selected customers in cache
      const filteredCache = prevCache.filter((c: any) => newSelectedIds.has(c.id));

      // Add newly selected customers from the provided list or current customersList
      const currentIds = new Set(filteredCache.map((c: any) => c.id));
      const sourceList = selectedCustomers || customersList;
      const missingCustomers = sourceList.filter(
        (c: any) => newSelectedIds.has(c.id) && !currentIds.has(c.id)
      );

      return [...filteredCache, ...missingCustomers];
    });
  }, [customersList]);

  const getAllClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesList, {
      cardType: CLIENT_TYPE_Id.CUSTOMER,
    });
  }, []);

  useEffect(() => {
    getRecentClients();
    getAllClientTypes();
  }, []);

  // Initialize selected customers cache when productState.clients or clientsDetails changes
  useEffect(() => {
    // If clientsDetails is provided by backend, use it directly
    if (productState?.clientsDetails && Array.isArray(productState.clientsDetails) && productState.clientsDetails.length > 0) {
      const clientsDetails = productState.clientsDetails;

      // Add all clientsDetails to cache
      setSelectedCustomersCache((prevCache) => {
        const existingIds = new Set(prevCache.map((c: any) => c.id));
        const newCustomers = clientsDetails.filter((c: any) => c.id && !existingIds.has(c.id));
        return [...prevCache, ...newCustomers];
      });
      return; // Exit early if we have clientsDetails
    }

    // Fallback: If clientsDetails is not available, use the old logic
    if (productState?.clients && productState.clients.length > 0) {
      // Check if clients is array of IDs (strings) or array of objects
      const isArrayOfIds = typeof productState.clients[0] === 'string';
      const selectedIds = isArrayOfIds
        ? productState.clients
        : productState.clients.map((c: any) => c.id || c);

      if (customersList.length > 0) {
        // Check which selected customers are missing from both customersList and cache
        const currentCustomerIds = new Set(customersList.map((c: any) => c.id));
        const cachedCustomerIds = new Set(selectedCustomersCache.map((c: any) => c.id));
        const allAvailableIds = new Set([...Array.from(currentCustomerIds), ...Array.from(cachedCustomerIds)]);

        const missingIds = selectedIds.filter((id: string) => !allAvailableIds.has(id));

        // Find selected customers that are in the current customersList
        const foundCustomers = customersList.filter((c: any) => selectedIds.includes(c.id));

        // Update cache with found customers
        if (foundCustomers.length > 0) {
          setSelectedCustomersCache((prevCache) => {
            const existingIds = new Set(prevCache.map((c: any) => c.id));
            const newCustomers = foundCustomers.filter((c: any) => !existingIds.has(c.id));
            return [...prevCache, ...newCustomers];
          });
        }

        // If there are missing customers, fetch them by getting all customers and filtering
        if (missingIds.length > 0) {
          const fetchMissingCustomers = async () => {
            try {
              // getAndSetAllCustomers returns the data directly (extracted from result.data.data.data)
              const allCustomers = await getAndSetAllCustomers(callApi, undefined, {
                clientType: CLIENT_TYPE.CUSTOMER,
                onlyCreateOrderClients: false,
              });

              if (Array.isArray(allCustomers) && allCustomers.length > 0) {
                const missingCustomers = allCustomers.filter((c: any) =>
                  missingIds.includes(c.id)
                );

                if (missingCustomers.length > 0) {
                  // Ensure all customers have the required fields
                  const validCustomers = missingCustomers.map((c: any) => ({
                    ...c,
                    name: c.name || c.customerName || c.clientName || c.label || `Customer ${c.id?.substring(0, 8)}...`,
                    id: c.id,
                  }));

                  setSelectedCustomersCache((prevCache) => {
                    const existingIds = new Set(prevCache.map((c: any) => c.id));
                    const newCustomers = validCustomers.filter((c: any) => !existingIds.has(c.id));
                    return [...prevCache, ...newCustomers];
                  });
                }
              }
            } catch (error) {
              console.error("Error fetching missing customers:", error);
            }
          };

          fetchMissingCustomers();
        }
      }
    }
  }, [productState?.clients, productState?.clientsDetails, customersList.length]);

  const UploadProductImage = useCallback(async (productId: any, fileBase64) => {
    const res: any = await callApi(
      EHttpMethod.POST,
      `/v1/printhouse-config/products/upload-product-image`,
      {
        productId: productId,
        fileBase64: fileBase64,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      onChangeStateProduct("img", res?.data?.data?.result);
    } else {
      alertFaultAdded();
    }
  }, []);

  const onClickOpenDeleteRowModal = (id: string) => {
    setSelectedProductId(id);
    setOpenDeleteRowModal(true);
  };

  const onClickCloseDeleteRowModal = () => {
    setOpenDeleteRowModal(false);
  };

  const deleteProductSKURow = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/printhouse-config/productsSKU/delete-product-sku-by-id`,
      {
        Id: selectedProductId,
      }
    );
    if (res?.success) {
      alertSuccessDelete();
      getAllProductsSKU();
      onClickCloseDeleteRowModal();
    } else {
      alertFaultDelete();
    }
  }, [selectedProductId]);

  const updateProductSKURow = useCallback(async (productSKU) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/productsSKU/update-product-sku`,
      {
        productSKU,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      getAllProductsSKU();
    } else {
      alertFaultUpdate();
    }
  }, []);

  return {
    t,
    productClientsList,
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    productState,
    onChangeStateProduct,
    errorName,
    errorCode,
    SelectproductClient,
    customersList,
    clientTypesList,
    productsList,
    openDeleteRowModal,
    query,
    onClickOpenDeleteRowModal,
    onClickCloseDeleteRowModal,
    UploadProductImage,
    setSelectProductClient,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    createNewProduct,
    createNewProductAndGoToParameterList,
    updatedProduct,
    deleteProductSKURow,
    openPricingTypeModal,
    onClickOpenPricingType,
    onClickClosePricingType,
    selectPricingType,
    productSKU,
    updateProductSKURow,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    updateSelectedCustomersCache,
    selectedCustomersCache,
  };
};

export { useSettings };
