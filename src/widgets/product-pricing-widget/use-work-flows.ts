import {useRecoilState} from "recoil";
import {workFlowsState} from "@/widgets/product-pricing-widget/state";

const useWorkFlows = () => {
    const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);

    const selectWorkFlow = (id: string) => {
        const flows = workFlows.map(flow => flow.id === id ? {...flow, selected: true} : {...flow, selected: false});
        setWorkFlows(flows);
    }
    return {
        selectWorkFlow
    }
}

export {useWorkFlows}