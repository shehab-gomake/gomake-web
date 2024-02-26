import {useEffect, useState} from "react";
import {quickSetupGetMaterialsPricing, quickSetupSaveMaterialsPricing} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {IMaterialPricing} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/interface";
import {useRouter} from "next/router";

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

    const onClickSkip = () => {
        push('/quick-setup/products').then();
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