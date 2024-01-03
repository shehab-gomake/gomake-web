import {useRecoilValue} from "recoil";
import {currentProductItemValueDraftId} from "@/widgets/product-pricing-widget/state";
import {updateSelectedWorkFlowApi} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import {useGomakeAxios} from "@/hooks";
import {currentCalculationConnectionId} from "@/store";

const useWorkFlows = () => {
    const {callApi} = useGomakeAxios();
    const currentProductItemValue = useRecoilValue<any>(currentProductItemValueDraftId);
    const connectionId = useRecoilValue(currentCalculationConnectionId);
    const selectWorkFlow = async (id: string) => {
        await updateSelectedWorkFlowApi(callApi, () => {}, {
            workFlowId: id,
            productItemValueId: currentProductItemValue,
            signalRConnectionId: connectionId
        })
    }
    return {
        selectWorkFlow
    }
}

export {useWorkFlows}