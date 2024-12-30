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
  calculationExceptionsLogsState,
  calculationProgressState,
  currentProductItemValuePriceState,
  lastProductItemValuePriceState,
  selectedWorkFlowState,
  sliderCurrentProductItemValuePriceState,
} from "@/widgets/product-pricing-widget/state";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const useRightSideWidget = ({ includeVAT }) => {
  const { alertFault } = useSnackBar();
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useRecoilState<any>(calculationExceptionsLogsState);
  useEffect(() => {
    setCalculationExceptionsLogs([]);
  }, []);
  const [isLoading, setIsLoading] = useRecoilState(isLoadgingState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const systemVAT = useRecoilValue<number>(systemVATState);
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const [systemCurrency, setSystemCurrency] =
    useRecoilState<any>(systemCurrencyState);
  const currencies = useRecoilValue(currenciesSymbols);
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
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);

  const lastProductItemValueTotalPrice = useRecoilValue<number>(
    lastProductItemValuePriceState
  );
  const calculationProgress = useRecoilValue(calculationProgressState);
  const quantity = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
    }
  }, [subProducts]);
  const exampleTypeValues = useRecoilValue(exampleTypeState);

  const { t } = useTranslation();
  const direction = t("direction");
  const isRtl = direction === "rtl";

  useEffect(() => {
    if (currentProductItemValueTotalPrice != null) {
      if (includeVAT == null) {
        return;
      }
      if (includeVAT) {
        setCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice * (1 + systemVAT)
        );

        setSliderCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice * (1 + systemVAT)
        );
      } else {
        setCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice / (1 + systemVAT)
        );

        setSliderCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice / (1 + systemVAT)
        );
      }
    }
  }, [includeVAT]);

  /* Slider */
  const priceChangePercents = useRecoilValue(priceChangePercentsState);
  const [
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(sliderCurrentProductItemValuePriceState);

  const minDiscount =
    currentProductItemValueTotalPrice -
    (currentProductItemValueTotalPrice *
      (priceChangePercents?.minPercent || 0)) /
      100;

  const maxIncrease =
    Number(currentProductItemValueTotalPrice) +
    (Number(currentProductItemValueTotalPrice) *
      Number(priceChangePercents?.maxPercent || 0)) /
      100;

  const handleSliderChangeOld = (event, newValue) => {
    setSliderCurrentProductItemValueTotalPrice(newValue);
  };

  const handleSliderChange = (event, newValue) => {
    const validMaxIncrease = Math.round(Number(maxIncrease));
    const validMinDiscount = Math.round(Number(minDiscount));

    const adjustedValue = isRtl
      ? validMaxIncrease - newValue + validMinDiscount
      : newValue;

    setSliderCurrentProductItemValueTotalPrice(adjustedValue);
  };

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
  };
};

export { useRightSideWidget };
