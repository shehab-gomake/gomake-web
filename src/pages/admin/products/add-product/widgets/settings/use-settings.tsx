import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getAllGroups,
  getAllTemplets,
  getAlltProductSKU,
} from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();

  const [allProductSKU, setAllProductSKU] = useState<any>();
  const [allTemplate, setAllTemplate] = useState<any>();
  const [allGroups, setAllGroups] = useState<any>();
  const getAllProductsSKU = useCallback(async () => {
    await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);

  const getAllTemplate = useCallback(async () => {
    await getAllTemplets(callApi, setAllTemplate);
  }, []);

  const getAllGroupsF = useCallback(async () => {
    await getAllGroups(callApi, setAllGroups);
  }, []);

  useEffect(() => {
    getAllProductsSKU();
    getAllTemplate();
    getAllGroupsF();
  }, []);

  /// Add Product SKU Modal
  const [isProductSKU, setIsProductSKU] = useState(false);
  const onClickCloseProductSKU = () => {
    setIsProductSKU(false);
  };
  const onClickOpenProductSKU = () => {
    setIsProductSKU(true);
  };

  const [productSKU, setProductSKU] = useState<any>([]);
  const onChangeStateProductSKU = useCallback(
    (filedName: string, value: any) => {
      setProductSKU((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [productSKU]
  );
  const createNewProductSKU = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/productsSKU/create-product-sku`,
      {
        name: productSKU?.name,
        code: productSKU?.code,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      getAllProductsSKU();
      onClickCloseProductSKU();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [productSKU]);
  return {
    t,
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
  };
};

export { useSettings };
