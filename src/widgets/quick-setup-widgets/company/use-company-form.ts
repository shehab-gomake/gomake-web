import {useRecoilState, useRecoilValue} from "recoil";
import {ICompanyDataState, signupCompanyState} from "@/widgets/quick-setup-widgets/company/state";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useEffect, useState} from "react";
import {languageOptionsState} from "@/store/languages";
import {createNewCompanyApi} from "@/services/api-service/quick-setup/company/company-endpoints";
import {useRouter} from "next/router";
import {clearStorage} from "@/services/storage-data";
import {domainRegex} from "@/utils/regex";
import {Lan} from "@mui/icons-material";


const useCompanyForm = () => {
  const [state, setState] = useRecoilState(signupCompanyState);
  const [currencies, setCurrencies] = useRecoilState(currenciesState);
  const {callApi} = useGomakeAxios();
  const languages = useRecoilValue(languageOptionsState);
  const [loading, setLoading] = useState<boolean>(false);
  const {alertFaultAdded, alertFault} = useSnackBar();
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
    if (!domainRegex.test(state.domain)) {
      alertFaultAdded();
      return
    }
    const selectedLanguage = languages.find(lang => lang.value === state.systemLanguage);
    if (!selectedLanguage || !selectedLanguage.supported) {
      alertFault(`"${selectedLanguage.text}" not supported yet, system remains in English.Thank you for your understanding. `);
    }
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
    const supportedLanguages = languages.filter(lang => lang.supported);
    const selectedLanguage = supportedLanguages.find(lang => lang.value === state.systemLanguage);
    setState((prevState) => ({
      ...prevState,
      supportedLanguage: !!selectedLanguage,
    }));
  }, [languages, state.systemLanguage, setState]);
  useEffect(() => {
    clearStorage();
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