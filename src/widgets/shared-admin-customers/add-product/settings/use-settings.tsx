import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  getAllGroups,
  getAllTemplets,
  getAlltProductSKU,
  getAndSetAllCustomers,
  getAndSetClientTypes,
} from "@/services/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { EProductClient, ProductClient } from "./settings-data";
import { EHttpMethod } from "@/services/api-service/enums";

const useSettings = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
}) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { push, query } = useRouter();
  const { settingsRoute, id } = query;
  const { t } = useTranslation();
  const { setSnackbarStateValue, alertFaultAdded, alertSuccessAdded } =
    useSnackBar();
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
        clients: productState?.clients,
        clientsTypes: productState?.clientsTypes,
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
        clients: productState?.clients,
        clientsTypes: productState?.clientsTypes,
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
        clients: productState?.clients,
        clientsTypes: productState?.clientsTypes,
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
  const [SelectproductClient, setSelectProductClient] =
    useState<ProductClient>();
  const [customersList, setCustomersList] = useState([]);
  const [clientTypesList, setClientTypesList] = useState([]);
  const productClientsList: ProductClient[] = useMemo(
    () => [
      {
        label: t("products.addProduct.admin.allCustomers"),
        id: EProductClient.ALL_CUSTOMERS,
      },
      {
        label: t("products.addProduct.admin.byClient"),
        id: EProductClient.BY_CLIENT,
      },
      {
        label: t("products.addProduct.admin.byClientType"),
        id: EProductClient.BY_CLIENT_TYPE,
      },
    ],
    []
  );

  const getAllClients = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersList, {
      ClientType: "C",
      onlyCreateOrderClients: false,
      searchTerm: SearchTerm,
    });
  }, []);
  const getAllClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesList);
  }, []);
  useEffect(() => {
    getAllClients();
    getAllClientTypes();
  }, []);

  const UploadProductImage = useCallback(async (productId: any, fileBase64) => {
    const res: any = await callApi(
      EHttpMethod.POST,
      `/v1/printhouse-config/products/upload-product-image`,
      {
        productId: productId,
        fileBase64: fileBase64,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      onChangeStateProduct("img", res?.data?.data?.result);
    } else {
      alertFaultAdded();
    }
  }, []);

  return {
    t,
    productClientsList,
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
    SelectproductClient,
    customersList,
    clientTypesList,
    UploadProductImage,
    setSelectProductClient,
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
