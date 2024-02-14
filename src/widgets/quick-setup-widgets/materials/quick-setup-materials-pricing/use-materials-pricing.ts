import {useEffect, useState} from "react";
import {quickSetupGetMaterialsPricing} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios} from "@/hooks";
import {IMaterialPricing} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/interface";

const useMaterialsPricing = () => {
    const [parameters, setParameters] = useState<IMaterialPricing[]>([]);
    const [state, setState] = useState<Record<string, number>>({});
   const {callApi} = useGomakeAxios();

    const onChange = (key, value) => {
        setState({
            ...state,
            [key]: value
        })
    }
    const getMaterialsPricingData = async () => {
        const callBack = (res) => {
            if (res.success) {
                setParameters(res.data);
            }
        }
        await quickSetupGetMaterialsPricing(callApi, callBack);
    }

    useEffect(() => {
        getMaterialsPricingData().then();
    }, [])
    return {
        onChange,
        state,
        parameters
    }
}
export {useMaterialsPricing}