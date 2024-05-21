import {useRecoilState, useRecoilValue} from "recoil";
import {ICompanyDataState,  signupCompanyState} from "@/widgets/quick-setup-widgets/company/state";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";
import {useGomakeAxios, useGomakeRouter, useSnackBar} from "@/hooks";
import { useEffect, useState} from "react";
import {languageOptionsState} from "@/store/languages";
import {useRouter} from "next/router";
import {clearStorage} from "@/services/storage-data";
import { checkPrintHouseDomainApi, createNewPrintHouseApi, getAllCountriesApi } from "@/services/api-service/profiles/company-profile-api";
import { domainRegex, emailRegex } from "@/utils/regex";


const useCompanyForm = () => {
  const [state, setState] = useRecoilState(signupCompanyState);
  const [currencies, setCurrencies] = useRecoilState(currenciesState);
  const {callApi} = useGomakeAxios();
  const languages  = useRecoilValue(languageOptionsState);
  const [loading, setLoading] = useState<boolean>(false);
  const {alertFaultAdded, alertFault} = useSnackBar();
  const [isAvailable, setIsAvailable] = useState(false)
  const [countryList,setCountryList]=useState([])
  const { navigate } = useGomakeRouter();

  useEffect(() => {
      if (state.country?.currencyCode) {
          let currenciesTemp = currencies.find((item) => item.value === state.country.currencyCode)
          if (currenciesTemp?.value) {
              onChange('systemCurrency', currenciesTemp)
          }
      }
  }, [state.country])
  useEffect(() => {
      if (state.country?.languageCode) {
          let languagesTemp = languages.find((item) => item.value === state.country.languageCode)
          if (languagesTemp?.value) {
              onChange('systemLanguage', languagesTemp)
          }
      }
  }, [state.country])
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
      // Check if all required fields are filled
  if (!state.name || !state.domain || !state.fullName || !state.phone || !state.email || !state.systemLanguage || !state.systemCurrency) {
    alertFault("All fields are required.");
    return;
  }
  // Validate domain
  if (!domainRegex.test(state.domain)) {
    alertFault("Invalid domain format.");
    return;
  }
  // Validate email
  if (!emailRegex.test(state.email)) {
    alertFault("Invalid email format.");
    return;
  }

 
  if (!state.phone.match(/^\d{10,15}$/)) {
    alertFault("Invalid phone number format.");
    return;
  }
    setLoading(!loading);
    const callBack = (res) => {
        if (res.success) {
          navigate("/quick-setup/welcome")
        }
        else {
               alertFaultAdded();
             }
             setLoading(false);
    }
    const res = await createNewPrintHouseApi(callApi, callBack,
      {
        name: state?.name,
        domain: state?.domain,
        systemLanguage: state?.systemLanguage.value,
        systemCurrency: state?.systemCurrency.value,
        fullName: state?.fullName,
        phone: state?.phone,
        email: state?.email
      })

    return res.success
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

const getAllCountries = async () => {
  const callBack = (res) => {
      if (res.success) {
          setCountryList(res.data);
      }
  }
  await getAllCountriesApi(callApi, callBack)
}

useEffect(()=>{
  if(domainCheck){
    onChange('domain', domainCheck)
  }
},[domainCheck])
  useEffect(() => {
    clearStorage();
    getCurrencies().then()
    getAllCountries()
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