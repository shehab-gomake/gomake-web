import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetPrintingMaterialsCategores,
  getAndSetPrintingMaterialsSuppliers,
  getAndSetPrintingMaterialsSize,
} from "@/services/hooks";

const usePrintingMaterials = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [printingMaterialsCategores, setPrintingMaterialsCategores] = useState(
    []
  );
  const [supplierId, setSupplierId] = useState("");
  const [printingMaterialsSuppliers, setPrintingMaterialsSuppliers] = useState(
    []
  );
  const [printingMaterialsSizes, setPrintingMaterialsSizes] = useState([]);
  useEffect(() => {
    getPrintingMaterialsCategores();
    getPrintingMaterialsSuppliers();
    getPrintingMaterialsSizes();
  }, [categoryName, supplierId]);

  const getPrintingMaterialsCategores = useCallback(async () => {
    const data = await getAndSetPrintingMaterialsCategores(
      callApi,
      setPrintingMaterialsCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getPrintingMaterialsSuppliers = useCallback(async () => {
    const data = await getAndSetPrintingMaterialsSuppliers(
      callApi,
      setPrintingMaterialsSuppliers
    );
  }, [supplierId]);

  const getPrintingMaterialsSizes = useCallback(async () => {
    await getAndSetPrintingMaterialsSize(callApi, setPrintingMaterialsSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId, setPrintingMaterialsSizes]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    categoryName,
    printingMaterialsCategores,
    printingMaterialsSuppliers,
    printingMaterialsSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { usePrintingMaterials };
