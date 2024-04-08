import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getFinancialPeriodApi, updateFinancialPeriodApi } from "@/services/api-service/settings/finance-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { financialPeriod } from "./interfaces";

const useFinancialPeriodModal = ({onClose}) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } = useSnackBar();

  const months = [
    { value: "1", label: t("financesWidget.january") },
    { value: "2", label: t("financesWidget.february") },
    { value: "3", label: t("financesWidget.march") },
    { value: "4", label: t("financesWidget.april") },
    { value: "5", label: t("financesWidget.may") },
    { value: "6", label: t("financesWidget.june") },
    { value: "7", label: t("financesWidget.july") },
    { value: "8", label: t("financesWidget.august") },
    { value: "9", label: t("financesWidget.september") },
    { value: "10", label: t("financesWidget.october") },
    { value: "11", label: t("financesWidget.november") },
    { value: "12", label: t("financesWidget.december") }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, index) => {
    const year = currentYear - index;
    return { value: year.toString(), label: year.toString() };
  });


  const monthStatues = [
    { value: "0", label: t("financesWidget.unlocked") },
    { value: "1", label: t("financesWidget.unlockedExceptSales") },
    { value: "2", label: t("financesWidget.periodClosing") },
    { value: "3", label: t("financesWidget.locked") },
  ];

  //const [state, setState] = useState<financialPeriod>({ month: months[0].value, year: years[0].value, status: monthStatues[0].value });
  const [state, setState] = useState<financialPeriod>(() => ({
    month: months[0].value,
    year: years[0].value,
    status: ""
  }));

  const onChangeInputs = (key, value) => {
    if (key === "year") {
      getFinancialPeriod(value, state?.month)
    }
    if (key === "month") {
      getFinancialPeriod(state?.year, value)
    }
    setState({ ...state, [key]: value });
  };


  const onClickSave = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        onClose();
      }
      else {
        alertFaultUpdate();
      }
    };
    await updateFinancialPeriodApi(callApi, callBack, state);
  };

  const getFinancialPeriod = async (year, month) => {
    return new Promise((resolve, reject) => {
      const callBack = (res) => {
        if (res.success) {
          const data = String(res?.data);
          setState({ ...state, status: data, year, month });
          resolve(data); 
        } else {
          alertFaultGetData();
          reject(new Error("Failed to get financial period data"));
        }
      };
      getFinancialPeriodApi(callApi, callBack, { year, month })
        .catch((error) => {
          console.error("Error fetching financial period:", error);
          reject(error);
        });
    });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const defaultStatus = await getFinancialPeriod(years[0].value, months[0].value);
      setState(prevState => ({
        ...prevState,
        status: String(defaultStatus)
      }));
    };
    fetchData(); 
  }, []); 

  return {
    t,
    state,
    setState,
    onChangeInputs,
    monthStatues,
    months,
    years,
    onClickSave,
    getFinancialPeriod
  };
};

export { useFinancialPeriodModal };
