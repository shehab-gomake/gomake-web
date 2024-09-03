import { useGomakeAxios } from "@/hooks";
import { useEffect, useState } from "react";

const usePrintHouseMachines = () => {
    const [machines, setMachines] = useState([])
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getMachines().then(
            (res) => {
                setMachines(res?.data?.data?.data)
            }
        );
    }, []);

    const getMachines = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/profits/get-all-machinces"
        );
    }
    return{
        getMachines,
        machines
    }
}

export { usePrintHouseMachines };