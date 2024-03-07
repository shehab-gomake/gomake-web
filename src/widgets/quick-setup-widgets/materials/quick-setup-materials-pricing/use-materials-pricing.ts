import {useEffect, useState} from "react";
import {quickSetupGetMaterialsPricing, quickSetupSaveMaterialsPricing} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {IMaterialPricing} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/interface";
import {useRouter} from "next/router";
import {quickSetupUpdateNextStep} from "@/services/api-service/quick-setup/next-step/update-next-step-endpoint";

const useMaterialsPricing = () => {
    const [parameters, setParameters] = useState<IMaterialPricing[]>([]);
    const {alertFaultUpdate} = useSnackBar();
   const {callApi} = useGomakeAxios();
   const {push} = useRouter();

    const onChange = (parameterId, value) => {
        setParameters(prevState => prevState.map(parameter => parameter.id === parameterId ? {...parameter, value: +value} : parameter));
    }
    const getMaterialsPricingData = async () => {
        const callBack = (res) => {
            if (res.success) {
                setParameters(res.data);
            }
        }
        await quickSetupGetMaterialsPricing(callApi, callBack);
    }
    const saveParameters = async () => {
        const callBack = (res) => {
            if (res?.success) {
                push('/quick-setup/products').then();
            }else {
                alertFaultUpdate();
            }
        }
        await quickSetupSaveMaterialsPricing(callApi, callBack, parameters.filter(parameter => !!parameter.value));
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


    useEffect(() => {
        getMaterialsPricingData().then();
    }, [])
    return {
        onChange,
        parameters,
        saveParameters,
        onClickSkip
    }
}
export {useMaterialsPricing}