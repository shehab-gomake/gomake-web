import {useGomakeAxios} from "@/hooks";
import {use, useEffect, useMemo, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {useRouter} from "next/router";

const usePrintHouseActions = ()=> {
    const [state,setState] = useState([])
    const router = useRouter();
  
    const [actionId,setActionId] = useState('') 
    const { callApi } = useGomakeAxios();
    useEffect(() => {
        if(router.query.actionId){
            getPrintHouseActionById(router.query.actionId as string).then(
                (res) => {
                 setState(res?.data?.data?.data)
                 setActionId(router.query.actionId as string)
                }
            );
        }
           
    },[router.query.actionId]);

    const getPrintHouseActionById = async (actionId: string) => {
        return  await callApi('Get', `/v1/printhouse-config/print-house-action/get-properties-by-action-id/${router.query.actionId}`);
    };

    return{
        getPrintHouseActionById,
        state,
        actionId
    }
}

export {usePrintHouseActions}
