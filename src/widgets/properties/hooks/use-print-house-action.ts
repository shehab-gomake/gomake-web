import {useGomakeAxios} from "@/hooks";
import {use, useEffect, useMemo, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {useRouter} from "next/router";

const usePrintHouseActions = ()=> {
    const [state,setState] = useState([])
    const router = useRouter();
    const printHouseActionId  = '7db3c073-441a-452b-bea4-29c2804eec5b'//must change to  router.query
    const { callApi } = useGomakeAxios();
    useEffect(() => {
            getPrintHouseActionById(printHouseActionId).then(
                (res) => {
                 setState(res?.data?.data?.data)
                }
            );
    },[printHouseActionId]);

    const getPrintHouseActionById = async (actionId: string) => {
        return  await callApi('Get', `/v1/printhouse-config/print-house-action/get-properties-by-action-id/${printHouseActionId}`);
    };

    return{
        getPrintHouseActionById,
        state
    }
}

export {usePrintHouseActions}
