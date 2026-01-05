import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  isLoadgingState,
  permissionsState,
  subProductsParametersState,
  systemCurrencyState,
  systemVATState,
} from "@/store";
import { exampleTypeState } from "@/store/example-type";
import { priceChangePercentsState } from "@/store/min-max-price-change-percents";
import { currenciesSymbols } from "@/widgets/materials-widget/state";
import {
  additionalProductItemsState,
  calculationExceptionsLogsState,
  calculationProgressState,
  currentCalculatedTotalPriceState,
  currentProductItemValuePriceState,
  lastProductItemValuePriceState,
  localStateValueState,
  selectedWorkFlowState,
  sliderCurrentProductItemValuePriceState,
  workFlowsState,
  deliveryPriceState,
} from "@/widgets/product-pricing-widget/state";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useClientTypesList } from "@/hooks/use-client-types";

const useRightSideWidget = ({ includeVAT, widgetType }) => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const isRtl = direction === "rtl";
  const { alertFault } = useSnackBar();
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useRecoilState<any>(calculationExceptionsLogsState);
  const deliveryPrice = useRecoilValue<number>(deliveryPriceState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadgingState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const systemVAT = useRecoilValue<number>(systemVATState);
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const [systemCurrency, setSystemCurrency] =
    useRecoilState<any>(systemCurrencyState);
  const currencies = useRecoilValue(currenciesSymbols);
  const currentProductItemValueTotalPrice = useRecoilValue<number>(
    currentProductItemValuePriceState
  );
  const currentCalculatedTotalPrice = useRecoilValue<number>(
    currentCalculatedTotalPriceState
  );
  const lastProductItemValueTotalPrice = useRecoilValue<number>(
    lastProductItemValuePriceState
  );
  const calculationProgress = useRecoilValue(calculationProgressState);

  const exampleTypeValues = useRecoilValue(exampleTypeState);
  const priceChangePercents = useRecoilValue(priceChangePercentsState);
  const [
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(sliderCurrentProductItemValuePriceState);
  const [localStateValue, setLocalStateValue] =
    useRecoilState<number>(localStateValueState);
  const [priceIncludeVat, setPriceIncludeVat] = useState<any>();
  const [unitPrice, setUnitPrice] = useState<any>();
  const [unitPriceWithVat, setUnitPriceWithVat] = useState<any>();
  const [qualityIssueReason, setQualityIssueReason] = useState<string>("");
  const isEditingUnitPriceWithVatRef = useRef(false);

  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [combinedData, setCombinedData] = useState<any>([]);
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState<ETab>(ETab.PRODUCTS);
  useEffect(() => {
    if (combinedData?.length > 0) {
      const products = combinedData?.find(
        (item) => item.value === ETab.PRODUCTS
      )?.children;
      const findDefaultProduct = products.find(
        (item) => item.value === router?.query?.productId
      );
      if (findDefaultProduct && selectedProduct?.id !== findDefaultProduct?.value) {
        handleProductChange(findDefaultProduct?.value, false);
      }
    }
  }, [combinedData, router?.query?.productId]);
  const handleProductChange = (e, shouldReload = false) => {
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
      if (shouldReload) {
        // Reload page when changed from dropdown
        const newQuery = { ...router.query, productId: selectedValue };
        const queryString = new URLSearchParams(newQuery as any).toString();
        const newUrl = `${window.location.origin}${router.asPath.split('?')[0]}${queryString ? `?${queryString}` : ''}`;
        window.location.href = newUrl;
      } else {
        // Just update URL and state without reload (from useEffect)
        router.push({
          pathname: router.pathname,
          query: { ...router.query, productId: selectedValue },
        });
        setSelectedProduct({
          id: selectedValue,
          category: selectedNode?.category,
        });
      }
    } else {
      setSelectedProduct(null);
    }
  };

  const getAllProductsAndMaterials = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
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
              code: product.code,
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
              category: ProductCategoryType.MATERIAL,
              children: material.categories.map((category) => ({
                value: `${material.materialTypeName}-${category.categoryName}`,
                title: category.categoryName,
                text: category.categoryName,
                selectable: false,
                level: 2, // Categories are level 2
                category: ProductCategoryType.MATERIAL,
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

        const transformedProducts = transformProducts(res?.data?.products);
        const transformedMaterials = transformMaterials(res?.data?.materials);

        // Combine the transformed data
        const combinedFinalData = [transformedProducts, transformedMaterials];
        setCombinedData(combinedFinalData);
      }
    };

    const clientId = router?.query?.customerId;
    const clientTypeId = router?.query?.clientTypeId;

    const params: any = {
      selectionType: selectedTab,
    };

    if (clientId && clientTypeId) {
      params.clientId = clientId;
      params.clientTypeId = clientTypeId;
    }

    await getAllProductAndMaterialsApi(callApi, callBack, params);
  }, [selectedTab, router?.query]);

  useEffect(() => {
    if (products?.length > 0 && combinedData?.length > 0) {
      const findDefaultProduct = products.find(
        (item) => item.id === router?.query?.productId
      );
      if (findDefaultProduct) {
        handleProductChange(findDefaultProduct?.id, false);
      }
    }
  }, [combinedData, router?.query?.productId]);

  useEffect(() => {
    getAllProductsAndMaterials();
  }, []);

  useEffect(() => {
    setCalculationExceptionsLogs([]);
  }, []);

  useEffect(() => {
    if (currencies?.length > 0) {
      const data = currencies.find((c) => c.value === systemCurrency);
      if (data) {
        setSystemCurrency(data.label);
      }
    }
  }, [systemCurrency, currencies]);

  useEffect(() => {
    if (calculationExceptionsLogs?.length > 0) {
      setIsLoading(false);
    }
  }, [calculationExceptionsLogs]);

  const quantity = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      let quantityParam = generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
      if (quantityParam == null) {
        quantityParam = {
          values: ["0"],
        };
      }
      if (
        quantityParam &&
        (quantityParam.values == null || quantityParam.values.length == 0)
      ) {
        quantityParam.values = ["0"];
      }
      return quantityParam;
    }
  }, [subProducts]);

  /* Slider */
  const priceToUse = currentCalculatedTotalPrice;
  const minDiscount =
    priceToUse - (priceToUse * (priceChangePercents?.minPercent || 0)) / 100;

  const maxIncrease =
    Number(priceToUse) +
    (Number(priceToUse) * Number(priceChangePercents?.maxPercent || 0)) / 100;

  const handleSliderChange = (event, newValue) => {
    const validMaxIncrease = Math.round(Number(maxIncrease));
    const validMinDiscount = Math.round(Number(minDiscount));
    const adjustedValue = isRtl
      ? validMaxIncrease - newValue + validMinDiscount
      : newValue;

    setSliderCurrentProductItemValueTotalPrice(adjustedValue);
    setLocalStateValue(adjustedValue);
  };

  useEffect(() => {
    if (sliderCurrentProductItemValueTotalPrice !== null && !priceIncludeVat) {
      setPriceIncludeVat(
        (sliderCurrentProductItemValueTotalPrice * (1 + systemVAT))?.toFixed(3)
      );
    } else {
      setPriceIncludeVat(null);
    }
  }, [sliderCurrentProductItemValueTotalPrice]);

  // Calculate unit price when total price or quantity changes
  // Skip recalculation if user is actively editing unitPriceWithVat
  useEffect(() => {
    if (isEditingUnitPriceWithVatRef.current) {
      return;
    }
    if (
      sliderCurrentProductItemValueTotalPrice !== null &&
      quantity &&
      quantity.values &&
      quantity.values.length &&
      quantity?.values[0]
    ) {
      const qty = Number(quantity.values[0]) || 1;
      const calculatedUnitPrice = sliderCurrentProductItemValueTotalPrice / qty;
      setUnitPrice(calculatedUnitPrice?.toFixed(3));
      setUnitPriceWithVat(
        (calculatedUnitPrice * (1 + systemVAT))?.toFixed(3)
      );
    } else {
      setUnitPrice(null);
      setUnitPriceWithVat(null);
    }
  }, [sliderCurrentProductItemValueTotalPrice, quantity, systemVAT]);

  const setSubProducts = useSetRecoilState<any>(subProductsParametersState);
  const workFlows = useRecoilValue(workFlowsState);
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const additionalProductItems = useRecoilValue(additionalProductItemsState);
  const mergedArray = [
    ...(selectedWorkFlow?.exceptions || []),
    ...(calculationExceptionsLogs || []),
  ];
  const [logsArray, setLogsArray] = useState(mergedArray);
  const permissions = useRecoilValue(permissionsState);

  useEffect(() => {
    const uniqueArray = mergedArray.filter((item, index, self) => {
      let itemValuesArray = [];
      try {
        itemValuesArray = JSON.parse(item.values || "[]");
      } catch (error) {
        console.warn("Failed to parse item.values as JSON:", item.values);
        itemValuesArray = [];
      }
      const itemValuesSorted = itemValuesArray.sort().join(",");
      return (
        index ===
        self.findIndex((t) => {
          let tValuesArray = [];
          try {
            tValuesArray = JSON.parse(t.values || "[]");
          } catch (error) {
            console.warn("Failed to parse t.values as JSON:", t.values);
            tValuesArray = [];
          }
          return (
            t.actionName === item.actionName &&
            t?.exception?.exceptionKey === item?.exception?.exceptionKey &&
            t?.exception?.exceptionMessage ===
            item?.exception?.exceptionMessage &&
            tValuesArray.sort().join(",") === itemValuesSorted
          );
        })
      );
    });
    if (uniqueArray) {
      setLogsArray(uniqueArray);
    }
  }, [selectedWorkFlow, calculationExceptionsLogs]);

  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>();
  const [clientDefaultValue, setClientDefaultValue] = useState<any>();
  const { clientTypesCategories, getClientTypesCategories } =
    useClientTypesList();

  useEffect(() => {
    getClientTypesCategories();
  }, []);

  useEffect(() => {
    if (router?.query?.clientTypeId) {
      clientTypesCategories &&
        setClientTypeDefaultValue(
          clientTypesCategories?.find(
            (item: any) => item?.id === router?.query?.clientTypeId
          )
        );
    }
    if (router?.query?.customerId && router?.query?.customerName) {
      const customerName = Array.isArray(router?.query?.customerName)
        ? router.query.customerName[0]
        : router?.query?.customerName;
      const decodedCustomerName = customerName
        ? decodeURIComponent(customerName)
        : "";
      setClientDefaultValue({
        id: router?.query?.customerId,
        label: decodedCustomerName,
      });
    }
  }, [clientTypesCategories]);

  const docType = Array.isArray(router?.query?.documentType)
    ? 0
    : Number(router?.query?.documentType) ?? 0;

  const documentNumberText =
    docType === DOCUMENT_TYPE.quote
      ? t("sales.quote.quoteNumber")
      : t("sales.quote.orderNumber");

  useEffect(() => {
    setSliderCurrentProductItemValueTotalPrice(
      currentProductItemValueTotalPrice
    );
  }, [currentProductItemValueTotalPrice]);
  return {
    direction,
    isRtl,
    currentProductItemValueTotalPrice,
    lastProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    systemCurrency,
    isLoading,
    quantity,
    maxIncrease,
    minDiscount,
    sliderCurrentProductItemValueTotalPrice,
    priceIncludeVat,
    unitPrice,
    unitPriceWithVat,
    systemVAT,
    selectedProduct,
    combinedData,
    priceChangePercents,
    clientTypeDefaultValue,
    clientDefaultValue,
    documentNumberText,
    workFlows,
    additionalProductItems,
    logsArray,
    permissions,
    router,
    clientTypesCategories,
    isRTL,
    localStateValue,
    setLocalStateValue,
    setSliderCurrentProductItemValueTotalPrice,
    setClientTypeDefaultValue,
    handleProductChange,
    handleSliderChange,
    setPriceIncludeVat,
    setUnitPrice,
    setUnitPriceWithVat,
    isEditingUnitPriceWithVatRef,
    setSubProducts,
    primaryColor,
    alertFault,
    t,
    deliveryPrice,
    qualityIssueReason,
    setQualityIssueReason,
  };
};

export { useRightSideWidget };
