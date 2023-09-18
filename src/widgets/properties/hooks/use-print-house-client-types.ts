
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const usePrintHouseClientTypes = () => {
    const [clientTypes, setclientTypes] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getClientTypes().then(
            (res) => {
                setclientTypes(res?.data?.data?.data)
            }
        );
    }, []);
    const getClientTypes = async () => {
        return await callApi(
            "GET",
            "/v1/crm-service/clients/get-all-client-types"
        );
    }

    return{
        getClientTypes,
        clientTypes
    }
}

export { usePrintHouseClientTypes };