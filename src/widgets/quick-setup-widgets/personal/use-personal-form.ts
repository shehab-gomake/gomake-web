import {useRecoilState, useRecoilValue} from "recoil";
import {IPersonalDataState, isValidSignUpForm, signupPersonalState} from "@/widgets/quick-setup-widgets/personal/state";
import {useEffect, useState} from "react";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {createNewCompanyUserApi} from "@/services/api-service/quick-setup/personal/personal-endpoints";
import {clearStorage, updateTokenStorage} from "@/services/storage-data";

const usePersonalForm = () => {
    const [state, setState] = useRecoilState(signupPersonalState);
    const [loading, setLoading] = useState<boolean>(false);
    const isValid = useRecoilValue(isValidSignUpForm);
    const {alertFaultAdded} = useSnackBar();
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
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
                updateTokenStorage(res?.data?.token?.token);
                window.location.replace(`https://${res?.data?.domain}/quick-setup/machines`);
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

    useEffect(() => {
        clearStorage();
    }, [])

    return {
        state,
        onChange,
        loading,
        onclickNext
    }
}
export {usePersonalForm}