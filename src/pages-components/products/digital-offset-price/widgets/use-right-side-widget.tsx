import {
  isLoadgingState,
  subProductsParametersState,
  systemCurrencyState,
  systemVATState,
} from "@/store";
import { exampleTypeState } from "@/store/example-type";
import { currenciesSymbols } from "@/widgets/materials-widget/state";
import {
  calculationExceptionsLogsState,
  calculationProgressState,
  currentProductItemValuePriceState, lastProductItemValuePriceState,
  selectedWorkFlowState,
} from "@/widgets/product-pricing-widget/state";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

const useRightSideWidget = ({ includeVAT }) => {
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] = useRecoilState<any>(calculationExceptionsLogsState);
  useEffect(() => {
    setCalculationExceptionsLogs([])
  }, [])
  const isLoading = useRecoilValue(isLoadgingState);
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
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);
  const lastProductItemValueTotalPrice = useRecoilValue<number>(lastProductItemValuePriceState);
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

  useEffect(() => {
    if (currentProductItemValueTotalPrice != null) {
      if (includeVAT == null) {
        return;
      }
      if (includeVAT) {
        setCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice * (1 + systemVAT)
        );
      } else {
        setCurrentProductItemValueTotalPrice(
          currentProductItemValueTotalPrice / (1 + systemVAT)
        );
      }
    }
  }, [includeVAT]);

  return {
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
    t,
  };
};

export { useRightSideWidget };
