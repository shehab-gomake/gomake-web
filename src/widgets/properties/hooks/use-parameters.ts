
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useParameters = () => {
    const [parameters, setParameters] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();

    useEffect(() => {
        getParameters().then(
            (res) => {
                setParameters(res?.data?.data?.data)
            }
        );
    }, []);
    const getParameters = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/parameters/get-all-parameters"
        );
    }

    return{
        getParameters,
        parameters
    }
}

export { useParameters };