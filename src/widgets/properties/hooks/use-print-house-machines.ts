
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const usePrintHouseMachines = () => {
    const [machines, setMachines] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getMachiens().then(
            (res) => {
                setMachines(res?.data?.data?.data)
            }
        );
    }, []);
    const getMachiens = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/profits/get-all-machinces"
        );
    }

    return{
        getMachiens,
        machines
    }
}

export { usePrintHouseMachines };