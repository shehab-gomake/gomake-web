import { useGomakeAxios } from "@/hooks";
import { getAllUsersApi } from "@/services/api-service/users/users-api";
import {
  isLoadgingState,
  subProductsParametersState,
  systemCurrencyState,
  systemVATState,
} from "@/store";
import { billingMethodState } from "@/store/billing-method";
import { exampleTypeState } from "@/store/example-type";
import { currenciesState } from "@/widgets/materials-widget/state";
import {
  calculationProgressState,
  currentProductItemValuePriceState,
} from "@/widgets/product-pricing-widget/state";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

const useRightSideWidget = ({ includeVAT }) => {
  const isLoading = useRecoilValue(isLoadgingState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const systemVAT = useRecoilValue<number>(systemVATState);

  const [systemCurrency, setSystemCurrency] =
    useRecoilState<any>(systemCurrencyState);
  const currencies = useRecoilValue(currenciesState);
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
  const billingMethodValues = useRecoilValue(billingMethodState);

  const [changePrice, setChangePrice] = useState<number>(0);
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [listEmployees, setListEmployees] = useState([]);
  console.log("listEmployees", listEmployees);
  const getAllUsers = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setListEmployees(data.data);
      }
    };
    getAllUsersApi(callApi, callBackFunction).then();
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (currentProductItemValueTotalPrice != null) {
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
    calculationProgress,
    exampleTypeValues,
    billingMethodValues,
    systemCurrency,
    listEmployees,
    isLoading,
    quantity,
    setCurrentProductItemValueTotalPrice,
    t,
  };
};

export { useRightSideWidget };
