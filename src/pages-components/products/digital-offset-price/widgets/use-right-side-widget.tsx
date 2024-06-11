import { useGomakeAxios } from "@/hooks";
import { getAllUsersApi } from "@/services/api-service/users/users-api";
import {
  isLoadgingState,
  listEmployeesAtom,
  subProductsParametersState,
  systemCurrencyState,
  systemVATState,
} from "@/store";
import { billingMethodState } from "@/store/billing-method";
import { exampleTypeState } from "@/store/example-type";
import { currenciesState, currenciesSymbols } from "@/widgets/materials-widget/state";
import { ECalculationLogType } from "@/widgets/product-pricing-widget/enums";
import {
  calculationExceptionsLogsState,
  calculationProgressState,
  currentProductItemValuePriceState,
  selectedWorkFlowState,
} from "@/widgets/product-pricing-widget/state";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const useRightSideWidget = ({ includeVAT }) => {
  const { errorColor, successColor, warningColor, neutralColor } = useGomakeTheme();
  const calculationExceptionsLogs = useRecoilValue(calculationExceptionsLogsState);
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
  const [listEmployeesValues, setListEmployeesValues] = useRecoilState(listEmployeesAtom);




  const [changePrice, setChangePrice] = useState<number>(0);
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [listEmployees, setListEmployees] = useState([]);
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
  // i need change to the icons when add new types
  const _renderIconLogs = (type) => {
    if (type === ECalculationLogType.ERROR) {
      return <ErrorIcon sx={{ width: 15, height: 15, color: errorColor(500) }} />;
    } else if (type === ECalculationLogType.MESSAGE) {
      return <HelpCenterIcon sx={{ width: 15, height: 15, color: neutralColor(500) }} />;
    } else if (type === ECalculationLogType.SUCCESS) {
      return <CheckCircleIcon sx={{ width: 15, height: 15, color: successColor(500) }} />;
    } else if (type === ECalculationLogType.WARN) {
      return <WarningIcon sx={{ width: 15, height: 15, color: warningColor(500) }} />;
    }
  };
  useEffect(() => {
    if (listEmployees) {
      setListEmployeesValues(
        [
          {
            id: "00415c86-165f-463a-bde0-f37c66f00000",
            firstname: "Recommeded",
            lastname: "",
            email: "recommeded@gomake.net",
          },
          ...listEmployees,
        ]
      )
    }
  }, [listEmployees])
  return {
    currentProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    billingMethodValues,
    systemCurrency,
    listEmployees,
    isLoading,
    quantity,
    selectedWorkFlow,
    listEmployeesValues,
    calculationExceptionsLogs,
    setCurrentProductItemValueTotalPrice,
    _renderIconLogs,
    t,
  };
};

export { useRightSideWidget };
