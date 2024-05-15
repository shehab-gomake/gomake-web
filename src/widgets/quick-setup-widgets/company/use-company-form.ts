import {useRecoilState, useRecoilValue} from "recoil";
import {ICompanyDataState, ICountry, signupCompanyState} from "@/widgets/quick-setup-widgets/company/state";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import { useEffect, useState} from "react";
import {languageOptionsState} from "@/store/languages";
import {useRouter} from "next/router";
import {clearStorage} from "@/services/storage-data";
import { checkPrintHouseDomainApi } from "@/services/api-service/profiles/company-profile-api";


const useCompanyForm = () => {
  const [state, setState] = useRecoilState(signupCompanyState);
  const [currencies, setCurrencies] = useRecoilState(currenciesState);
  const {callApi} = useGomakeAxios();
  const languages  = useRecoilValue(languageOptionsState);
  const [loading, setLoading] = useState<boolean>(false);
  const {alertFaultAdded, alertFault} = useSnackBar();
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
      if (state.country?.currency) {
          let currenciesTemp = currencies.find((item) => item.value === state.country.currency)
          if (currenciesTemp?.value) {
              onChange('systemCurrency', currenciesTemp)
          }
      }
  }, [state.country])
  useEffect(() => {
      if (state.country?.lang) {
          let languagesTemp = languages.find((item) => item.value === state.country.lang)
          if (languagesTemp?.value) {
              onChange('systemLanguage', languagesTemp)
          }
      }
  }, [state.country])
  const countryList: ICountry[]=[
    {
      name: 'palestine',
      lang: 'ar',
      currency: 'ILS',
    },
    {
      name: 'USA',
      lang: 'en',
      currency: 'USD',
    }
  ]
  const {push} = useRouter();
  const getCurrencies = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCurrencies(res.data?.map(currency => ({label: currency.text, value: currency.value})));
      }
    }
    await getCurrenciesApi(callApi, callBack)
  }
  const onChange = (key: keyof ICompanyDataState, value: any) => {
    setState((preState) => ({
      ...preState,
      [key]: value
    }))
  }
  const onclickNext = async () => {
    // if (!domainRegex.test(state.domain)) {
    //   alertFaultAdded();
    //   return
    // }
    // const selectedLanguage = languages.find(lang => lang.value === state.systemLanguage);
    // if (!selectedLanguage || !selectedLanguage.supported) {
    //   alertFault(`"${selectedLanguage.text}" not supported yet, system remains in English.Thank you for your understanding. `);
    // }
    setLoading(!loading);
    // const callBack = (res) => {
    //   if (res.success) {
    //     push(`/quick-setup/personal/${res?.data?.printHouseId}`);
    //   } else {
    //     alertFaultAdded();
    //   }
    //   setLoading(false);
    // }
    // await createNewCompanyApi(callApi, callBack, state);
  }
  const checkPrintHouseDomain = async (domain: string) => {
    const callBack = (res) => {
        if (res.success) {
           setDomainCheck(res?.data)
        }
    }
    const res = await checkPrintHouseDomainApi(callApi, callBack, { domain: domain })

    return res.success
}
const [domainCheck,setDomainCheck]=useState("")
console.log("domainCheck",domainCheck)

useEffect(()=>{
  if(domainCheck){
    onChange('domain', domainCheck)
  }
},[domainCheck])
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
    loading,
    countryList,
    isAvailable, 
    setIsAvailable,
    checkPrintHouseDomain
  }
}
export {useCompanyForm}