import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  isLoadgingState,
  subProductsParametersState,
  systemCurrencyState,
  systemVATState,
} from "@/store";
import { exampleTypeState } from "@/store/example-type";
import { priceChangePercentsState } from "@/store/min-max-price-change-percents";
import { currenciesSymbols } from "@/widgets/materials-widget/state";
import {
  calculatedPriceProductItemValueState,
  calculationExceptionsLogsState,
  calculationProgressState,
  currentProductItemValuePriceState,
  lastProductItemValuePriceState,
  selectedWorkFlowState,
  sliderCurrentProductItemValuePriceState,
} from "@/widgets/product-pricing-widget/state";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { EWidgetProductType } from "../enums";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";

const useRightSideWidget = ({ includeVAT, widgetType }) => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const direction = t("direction");
  const isRtl = direction === "rtl";
  const { alertFault } = useSnackBar();
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useRecoilState<any>(calculationExceptionsLogsState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadgingState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const systemVAT = useRecoilValue<number>(systemVATState);
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const [systemCurrency, setSystemCurrency] =
    useRecoilState<any>(systemCurrencyState);
  const currencies = useRecoilValue(currenciesSymbols);
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);
  const lastProductItemValueTotalPrice = useRecoilValue<number>(
    lastProductItemValuePriceState
  );
  const calculationProgress = useRecoilValue(calculationProgressState);
  const exampleTypeValues = useRecoilValue(exampleTypeState);
  const priceChangePercents = useRecoilValue(priceChangePercentsState);
  const calculatedPriceProductItemValue = useRecoilValue<number>(
    calculatedPriceProductItemValueState
  );
  const [
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(sliderCurrentProductItemValuePriceState);
  const [priceIncludeVat, setPriceIncludeVat] = useState<any>();

  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [combinedData, setCombinedData] = useState<any>([]);
  const [products, setProducts] = useState([]);



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
      router.push({
        pathname: router.pathname,
        query: { ...router.query, productId: selectedValue },
      });
      setSelectedProduct({
        id: selectedValue,
        category: selectedNode?.category,
      });

    } else {
      setSelectedProduct(null);
    }
  };

  const getAllProductsAndMaterials = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        setProducts(res?.data?.products);
        const transformProducts = (products) => {
          return {
            value: "products",
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
        const transformedProducts = transformProducts(res?.data?.products);

        // Combine the transformed data
        const combinedFinalData = [transformedProducts];
        setCombinedData(combinedFinalData);
      }
    };

    if (router?.query?.customerId && router?.query?.clientTypeId)
      await getAllProductAndMaterialsApi(callApi, callBack, {
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
      });

  }, []);

  useEffect(() => {
    if (products?.length > 0 && combinedData?.length > 0) {
      const findDefaultProduct = products.find((item) => item.id === router?.query?.productId);
      if (findDefaultProduct) {
        handleProductChange(findDefaultProduct?.id);
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
      return generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
    }
  }, [subProducts]);

  /* Slider */
  const priceToUse =
    widgetType === EWidgetProductType.EDIT ||
      widgetType === EWidgetProductType.DUPLICATE
      ? calculatedPriceProductItemValue
      : currentProductItemValueTotalPrice;

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
  };

  useEffect(() => {
    if (sliderCurrentProductItemValueTotalPrice !== null && !priceIncludeVat) {
      setPriceIncludeVat(
        (sliderCurrentProductItemValueTotalPrice * (1 + systemVAT))?.toFixed(3)
      );
    }
    else {
      setPriceIncludeVat(null);
    }
  }, [sliderCurrentProductItemValueTotalPrice]);

  return {
    t,
    direction,
    isRtl,
    currentProductItemValueTotalPrice,
    lastProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    systemCurrency,
    isLoading,
    quantity,
    selectedWorkFlow,
    calculationExceptionsLogs,
    setCurrentProductItemValueTotalPrice,
    handleSliderChange,
    maxIncrease,
    minDiscount,
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
    alertFault,
    priceIncludeVat,
    setPriceIncludeVat,
    systemVAT,
    selectedProduct,
    combinedData,
    handleProductChange
  };
};

export { useRightSideWidget };
