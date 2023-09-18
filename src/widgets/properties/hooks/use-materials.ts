
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useMaterials = () => {
    const [materials, setMaterials] = useState([])
    const [materialsDropdown,setMaterialsDropdown] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    useEffect(() => {
        getMaterials().then(
            (res) => {
                let response = res?.data?.data?.data
                let tempMaterials = response.map((m) => {
                    return {
                        label: t(m.pathName),
                        id: m.pathName
                    }

                })

                setMaterials(response)
                setMaterialsDropdown(tempMaterials)
            }
        )
    },[])
    const getMaterials = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/materials/get-all-materials"
        );
    }

    return {
        getMaterials,
        materials,
        materialsDropdown
    }
}

export { useMaterials };