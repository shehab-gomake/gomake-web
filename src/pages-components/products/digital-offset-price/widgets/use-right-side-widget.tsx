import { useSnackBar } from "@/hooks";
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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { EWidgetProductType } from "../enums";

const useRightSideWidget = ({ includeVAT, widgetType }) => {
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
    if (sliderCurrentProductItemValueTotalPrice != null) {
      if (includeVAT == null) {
        return;
      }
      if (includeVAT) {
        setPriceIncludeVat(
          sliderCurrentProductItemValueTotalPrice * (1 + systemVAT)
        );
      }
    }
  }, [includeVAT, sliderCurrentProductItemValueTotalPrice]);

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
  };
};

export { useRightSideWidget };
