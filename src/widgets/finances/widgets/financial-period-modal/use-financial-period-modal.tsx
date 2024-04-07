import { CpaFileType } from "@/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { downloadCpaFileApi, getFinancialPeriodApi, updateFinancialPeriodApi } from "@/services/api-service/settings/finance-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { financialPeriod } from "./interfaces";

const useFinancialPeriodModal = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate , alertFaultUpdate , alertFaultGetData } = useSnackBar();

    const months = [
        { value: "1", label: t("January") },
        { value: "2", label: t("February") },
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, index) => {
        const year = currentYear - index;
        return { value: year.toString(), label: year.toString() };
    });


    const monthStatues = [
        { value: "0", label: t("Unlocked") },
        { value: "1", label: t("UnlockedExceptSales") },
        { value: "2", label: t("PeriodClosing") },
        { value: "3", label: t("Locked") },


    ];
    const [state, setState] = useState<financialPeriod>({month:months[0].value, year: years[0].value , status : monthStatues[0].value});


    const onChangeInputs = (key, value) => {
        if(key==="year")
        {
            getFinancialPeriod(value,state?.month)
        }
        if(key==="month")
        {
            getFinancialPeriod(state?.year,value)
        }
        setState({ ...state, [key]: value });
    };


    const onClickSave = async () => {
        const callBack = (res) => {
          if (res.success) {
            alertSuccessUpdate();
          }
          else {
            alertFaultUpdate();
          }
        };
        await updateFinancialPeriodApi(callApi, callBack, state);
      };

      const  getFinancialPeriod= async (year,month) => {
        const callBack = (res) => {
          if (res.success) {
            console.log("res " , res?.data.toString())
            //alertSuccessUpdate();
            setState({ ...state, status:  String(res?.data) });

          }
         
        };
       await getFinancialPeriodApi(callApi, callBack, {year:year , month:month});
      };


    return {
        t,
        state,
        onChangeInputs,
        monthStatues,
        months,
        years,
        onClickSave,
        getFinancialPeriod
    };
};

export { useFinancialPeriodModal };
