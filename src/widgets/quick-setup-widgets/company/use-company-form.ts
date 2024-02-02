import {useRecoilState, useRecoilValue} from "recoil";
import {ICompanyDataState, signupCompanyState} from "@/widgets/quick-setup-widgets/company/state";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useEffect, useState} from "react";
import {languageOptionsState} from "@/store/languages";
import {createNewCompanyApi} from "@/services/api-service/quick-setup/company/company-endpoints";
import {useRouter} from "next/router";

const useCompanyForm = () => {
  const [state, setState] = useRecoilState(signupCompanyState);
  const [currencies, setCurrencies] = useRecoilState(currenciesState);
  const {callApi} = useGomakeAxios();
  const languages = useRecoilValue(languageOptionsState);
  const [loading, setLoading] = useState<boolean>(false);
  const {alertFaultAdded} = useSnackBar();
  const {push} = useRouter();
  const getCurrencies = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCurrencies(res.data?.map(currency => ({label: currency.text, value: currency.value})));
      }
    }
    await getCurrenciesApi(callApi, callBack)
  }
  const onChange = (key: keyof ICompanyDataState, value: string) => {
    setState((preState) => ({
      ...preState,
      [key]: value
    }))
  }
  const onclickNext = async () => {
    setLoading(!loading);
    const callBack = (res) => {
      if (res.success) {
        push(`/quick-setup/personal/${res?.data?.printHouseId}`);
      } else {
        alertFaultAdded();
      }
      setLoading(false);
    }
    await createNewCompanyApi(callApi, callBack, state);
  }
  useEffect(() => {
    getCurrencies().then()
  }, [])
  return {
    state,
    onChange,
    currencies,
    languages,
    onclickNext,
    loading
  }
}
export {useCompanyForm}