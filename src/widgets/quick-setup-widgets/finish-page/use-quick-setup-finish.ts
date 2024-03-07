import {useRouter} from "next/router";
import {useGomakeAxios} from "@/hooks";
import {quickSetupUpdateNextStep} from "@/services/api-service/quick-setup/next-step/update-next-step-endpoint";
import {clearStorage} from "@/services/storage-data";

const useQuickSetupFinish = () => {
    const {push} = useRouter();
    const {callApi} = useGomakeAxios();
    const handleClick = async () => {
        const callBack = (res) => {
            if (res.success) {
                clearStorage();
                push('/login').then();
            }
        }
        await quickSetupUpdateNextStep(callApi, callBack, {
            nextStepUrl: null,
            IsFinalStep: true
        });
    }
    return {
        handleClick
    }
}

export {useQuickSetupFinish}