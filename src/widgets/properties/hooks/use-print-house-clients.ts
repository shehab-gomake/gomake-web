
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const usePrintHouseClients = () => {
    const [clients, setclients] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getClients().then(
            (res) => {
                setclients(res?.data?.data?.data)
            }
        );
    }, []);
    const getClients = async () => {
        return await callApi(
            "GET",
            "/v1/crm-service/customer/get-all-customers?ClientType=C&onlyCreateOrderClients=false"
        );
    }

    return{
        getClients,
        clients
    }
}

export { usePrintHouseClients };