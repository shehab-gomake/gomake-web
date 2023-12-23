import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllGroups,
  getAllTemplets,
  getAlltProductSKU,
} from "@/services/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const useSettings = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
}) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const {push, query} = useRouter();
  const {settingsRoute, id} = query;
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const [RandomId, setRandomId] = useState();
  useEffect(() => {
    setRandomId(uuidv4());
  }, []);
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

  const [isProductSKU, setIsProductSKU] = useState(false);
  const onClickCloseProductSKU = () => {
    setIsProductSKU(false);
  };
  const onClickOpenProductSKU = () => {
    setIsProductSKU(true);
  };

  const [productSKU, setProductSKU] = useState<any>([]);
  const [errorName, setErrorName] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
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
    if (productSKU?.name?.length > 0 && productSKU?.code?.length > 0) {
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
    } else {
      if (productSKU?.name?.length > 0) {
        setErrorName(false);
      } else {
        setErrorName(true);
      }
      if (productSKU?.code?.length > 0) {
        setErrorCode(false);
      } else {
        setErrorCode(true);
      }
    }
  }, [productSKU, errorName, errorCode]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPickerForNoteColor, setShowColorPickerForNoteColor] =
    useState(false);
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  const toggleColorPickerForNoteColor = () => {
    setShowColorPickerForNoteColor(!showColorPickerForNoteColor);
  };
  const closeColorPicker = () => {
    if (showColorPicker) {
      setShowColorPicker(false);
    }
  };

  const createNewProduct = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/products/create-product`,
      {
        id: RandomId,
        name: productState?.name,
        details: productState?.details,
        groups: productState?.groups?.map((item) => {
          return item;
        }),
        deliveryTime: productState?.deliveryTime,
        startingPrice: productState?.startingPrice,
        additionPrice: productState?.additionPrice,
        noteColor: productState?.noteColor,
        textColor: productState?.textColor,
        productSKUId: productState?.productSKUId?.id,
        templateId: productState?.templateId?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      navigate("/settings/products");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [productState, RandomId]);
  const createNewProductAndGoToParameterList = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/products/create-product`,
      {
        id: RandomId,
        name: productState?.name,
        details: productState?.details,
        groups: productState?.groups?.map((item) => {
          return item;
        }),
        deliveryTime: productState?.deliveryTime,
        startingPrice: productState?.startingPrice,
        additionPrice: productState?.additionPrice,
        noteColor: productState?.noteColor,
        textColor: productState?.textColor,
        productSKUId: productState?.productSKUId?.id,
        templateId: productState?.templateId?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      navigate(`/settings/products/edit/${RandomId}`);
      onClickParametersTab();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [productState, RandomId]);

  const updatedProduct = useCallback(async () => {
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/products/update-product-settings`,
      {
        id: id,
        name: productState?.name,
        details: productState?.details,
        groups: productState?.groups?.map((item) => {
          return item;
        }),
        deliveryTime: productState?.deliveryTime,
        startingPrice: productState?.startingPrice,
        additionPrice: productState?.additionPrice,
        noteColor: productState?.noteColor,
        textColor: productState?.textColor,
        productSKUId:
          typeof productState?.productSKUId === "string"
            ? productState?.productSKUId
            : productState?.productSKUId?.id,
        templateId:
          typeof productState?.templateId === "string"
            ? productState?.templateId
            : productState?.templateId?.id,
        status: true,
        //sections: productState?.sections,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [productState, RandomId]);
  return {
    t,
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    showColorPicker,
    showColorPickerForNoteColor,
    productState,
    onChangeStateProduct,
    errorName,
    errorCode,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    toggleColorPicker,
    toggleColorPickerForNoteColor,
    closeColorPicker,
    createNewProduct,
    createNewProductAndGoToParameterList,
    updatedProduct,
  };
};

export { useSettings };
