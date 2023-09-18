
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useOutputs = () => {
    const [Outputs, setOutputs] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getOutputs().then(
            (res) => {
                setOutputs(res?.data?.data?.data)
            }
        );
    }, []);
    const getOutputs = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/Output/get-all-Outputs"
        );
    }

    return{
        getOutputs,
        Outputs
    }
}

export { useOutputs };