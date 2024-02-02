import {useRecoilState, useRecoilValue} from "recoil";
import {IPersonalDataState, isValidSignUpForm, signupPersonalState} from "@/widgets/quick-setup-widgets/personal/state";
import {useState} from "react";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {createNewCompanyUserApi} from "@/services/api-service/quick-setup/personal/personal-endpoints";

const usePersonalForm = () => {
    const [state, setState] = useRecoilState(signupPersonalState);
    const [loading, setLoading] = useState<boolean>(false);
    const isValid = useRecoilValue(isValidSignUpForm);
    const {alertFaultAdded} = useSnackBar();
    const {callApi} = useGomakeAxios();
    const {push, query} = useRouter();
    const {printHouseId} = query;
    const onChange = (key: keyof IPersonalDataState, value: string) => {
        setState((preState) => ({
            ...preState,
            [key]: value
        }))
    }
    const onclickNext = async () => {
        setLoading(true);
        const callBack = (res) => {
            if (res.success) {
            } else {
                alertFaultAdded();
            }
            setLoading(false);
        }
        if (isValid) {
        await createNewCompanyUserApi(callApi, callBack, {
            ...state,
            printHouseId
        });
        } else {
            alertFaultAdded();
            setLoading(false)
        }
    }

    return {
        state,
        onChange,
        loading,
        onclickNext
    }
}
export {usePersonalForm}