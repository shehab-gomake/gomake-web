import { useRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { materialsState } from "@/store";
import { useCallback, useEffect } from "react";
import { getAllMaterials } from "@/services/hooks/get-all-materials";

const useMaterials = () => {
  const { callApi } = useGomakeAxios();
  const [allMaterials, setAllMaterials] = useRecoilState<any>(materialsState);
  
  const getAllMaterial = async ()=>{
    return new Promise((resolve, reject) => {
      const callBack = (result)=>{
        setAllMaterials(result);
        resolve(result);
      }
      getAllMaterials(callApi, callBack);
    });
   
  }

  return { allMaterials,getAllMaterial };
};

export { useMaterials };
