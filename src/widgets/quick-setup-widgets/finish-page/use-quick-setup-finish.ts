import {useRouter} from "next/router";
import {useGomakeAxios} from "@/hooks";
import {quickSetupUpdateNextStep} from "@/services/api-service/quick-setup/next-step/update-next-step-endpoint";

const useQuickSetupFinish = () => {
    const {push} = useRouter();
    const {callApi} = useGomakeAxios();
    const handleClick = async () => {
        const callBack = (res) => {
            if (res.success) {
                push('/').then();
            }
        }
        await quickSetupUpdateNextStep(callApi, callBack, {
            nextStepUrl: null
        });
    }
    return {
        handleClick
    }
}

export {useQuickSetupFinish}