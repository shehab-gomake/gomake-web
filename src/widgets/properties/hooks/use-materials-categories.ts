// /v1/printhouse-config/materials/get-all-materials-categories

import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {materialsState} from "@/store/materials";
import { useMaterials } from "./use-materials";
const useMaterialsCategories = () => {
    const [materialsCategories, setMaterialCategories] = useState([])
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const {materialsDropdown} = useMaterials()
    useEffect(() => {
        getMaterialsCategories().then(
            (res) => {
                let response = res?.data?.data?.data;
                let materialsCategores = response.map((c) => {
                    return{
                        label:materialsDropdown[c.material -1]?.label + "-" + c.name,
                        id: c.id
                    }
                })
                setMaterialCategories(materialsCategores);
            }
        );
    }, []);
    const getMaterialsCategories = async () => {
        return await callApi(
            "GET",
            "/v1/printhouse-config/materials/get-all-materials-categories"
        );
    }

    return{
       getMaterialsCategories,
        materialsCategories
    }
}

export { useMaterialsCategories };