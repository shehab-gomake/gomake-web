import {useCallback, useEffect, useState} from "react";
import {quickSetupGetMaterialsPricing, quickSetupSaveMaterialsPricing} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {IMaterialPricing} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/interface";
import {useRouter} from "next/router";
import {quickSetupUpdateNextStep} from "@/services/api-service/quick-setup/next-step/update-next-step-endpoint";
import {useRecoilState, useRecoilValue} from "recoil";
import {systemCurrencyState} from "@/store";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";

const useMaterialsPricing = () => {
    const [parameters, setParameters] = useState<IMaterialPricing[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const {alertFaultUpdate} = useSnackBar();
   const {callApi} = useGomakeAxios();
   const {push} = useRouter();
    const systemCurrency = useRecoilValue<any>(systemCurrencyState);
    const [currencies, setCurrencies] = useRecoilState(currenciesState);
    const getCurrencies = async () => {
        const callBack = (res) => {
            if (res.success) {
                setCurrencies(res.data?.map(currency => ({label: currency.text, value: currency.value})));
            }
        }
        await getCurrenciesApi(callApi, callBack)
    }
    const currency = useCallback(() => {
        return currencies?.find(c => c.value === systemCurrency)?.label
    }, [currencies, systemCurrency])
    const onChange = (parameterId, value) => {
        setParameters(prevState => prevState.map(parameter => parameter.id === parameterId ? {...parameter, price: +value} : parameter));
    }
    const getMaterialsPricingData = async () => {
        const callBack = (res) => {
            if (res.success) {
                setParameters(res.data);
                setLoading(false)
            }
        }
        setLoading(true)
        await quickSetupGetMaterialsPricing(callApi, callBack,null);
    }
    const saveParameters = async () => {
        const callBack = (res) => {
            if (res?.success) {
                push('/quick-setup/products/1').then();
            }else {
                alertFaultUpdate();
            }
        }
        await quickSetupSaveMaterialsPricing(callApi, callBack, parameters.filter(parameter => !!parameter.price));
    }

    const onClickSkip = async () => {
        const callBack = (res) => {
            if (res.success) {
                push(res.data?.nextStepUrl).then();

            } else {
                alertFaultUpdate();
            }
        }
        await quickSetupUpdateNextStep(callApi, callBack, {
            nextStepUrl: '/quick-setup/products/1',
            IsFinalStep: false
        })
    }

    // const cu

    useEffect(() => {
        getCurrencies().then();
        getMaterialsPricingData().then();
    }, [])
    return {
        onChange,
        parameters,
        saveParameters,
        onClickSkip,
        currency,
        loading
    }
}
export {useMaterialsPricing}