import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetPrintingMaterialsCategores,
  getAndSetPrintingMaterialsSize,
} from "@/services/hooks";

const usePrintingMaterials = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [printingMaterialsCategores, setPrintingMaterialsCategores] = useState(
    []
  );
  const [supplierId, setSupplierId] = useState("");

  const [printingMaterialsSizes, setPrintingMaterialsSizes] = useState([]);
  useEffect(() => {
    getPrintingMaterialsSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getPrintingMaterialsCategores();
  }, []);

  const getPrintingMaterialsCategores = useCallback(async () => {
    const data = await getAndSetPrintingMaterialsCategores(
      callApi,
      setPrintingMaterialsCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getPrintingMaterialsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetPrintingMaterialsSize(
        callApi,
        setPrintingMaterialsSizes,
        {
          categoryName,
          supplierId: supplierId || "",
        }
      );
      return data;
    }
    return null;
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    supplierId,
    printingMaterialsCategores,
    categoryName,
    printingMaterialsSizes,
    getPrintingMaterialsSizes,
    setPrintingMaterialsSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { usePrintingMaterials };
