import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getPrintHouseMaterialCategoriesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

interface Material {
  categoryKey: string;
  categoryName: string;
}

export const useMaterialCategories = (materialKey: string) => {
  const { callApi } = useGomakeAxios();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const getMaterialCategories = async (material: string) => {
    const callBack = (res) => {
      if (res?.success) {
        setMaterials(res?.data);
      }
    };

    await getPrintHouseMaterialCategoriesApi(callApi, callBack, material);
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      await getMaterialCategories(materialKey);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [materialKey]);

  return {
    materials,
    loading,
    refetch: fetchMaterials,
  };
};
