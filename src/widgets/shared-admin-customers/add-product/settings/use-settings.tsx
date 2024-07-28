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
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";

const useSettings = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
}) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { query } = useRouter();
  const { id } = query;
  const { t } = useTranslation();
  const { setSnackbarStateValue, alertFaultAdded, alertSuccessAdded, alertSuccessDelete, alertFault,
    alertFaultDelete, } =
    useSnackBar();
  const [RandomId, setRandomId] = useState();
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
  const [openPricingTypeModal, setOpenPricingTypeModal] = useState<boolean>(false);
  const [selectPricingType, setPricingType] = useState({})

  const onClickOpenPricingType = (value) => {
    setPricingType(value)
    setOpenPricingTypeModal(true)
  }
  const onClickClosePricingType = () => {
    setOpenPricingTypeModal(false)
  }

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
    setErrorName(false)
    setErrorCode(false)
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
        // onClickCloseProductSKU();
        onChangeStateProductSKU("name", "");
        onChangeStateProductSKU("code", "");
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



  const createNewProduct = useCallback(async () => {
    if (!productState.name || !productState.productSKUId || !productState.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
    } else {
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
        if (res?.errors?.statusCode === 2627) {
          alertFault(t("products.offsetPrice.admin.productAlreadyExists"));
        }
        else {
          alertFaultAdded()
        }
      }
    }
  }, [productState, RandomId]);
  const createNewProductAndGoToParameterList = useCallback(async () => {
    if (!productState.name || !productState.productSKUId || !productState.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.addProduct.admin.requiredField"),
        type: "error",
      });
    } else {
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
          additionProfits: productState?.additionProfits,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        navigate(`/settings/products/edit/${RandomId}?isParameter=${true}`);
        onClickParametersTab();
      } else {
        if (res?.errors?.statusCode === 2627) {
          alertFault(t("products.offsetPrice.admin.productAlreadyExists"));
        }
        else {
          alertFaultAdded()
        }

      }
    }
  }, [productState, RandomId]);

  const updatedProduct = useCallback(async () => {
    if (!productState?.name || !productState?.productSKUId || !productState?.templateId) {
      setSnackbarStateValue({
        state: true,
        message: t("products.offsetPrice.admin.errorReq"),
        type: "error",
      });
    } else {
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
          additionProfits: productState?.additionProfits ,
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
    await getAndSetClientTypes(callApi, setClientTypesList, { cardType: CLIENT_TYPE_Id.CUSTOMER });
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

  const onClickOpenDeleteRowModal = (id: string) => {
    setSelectedProductId(id)
    setOpenDeleteRowModal(true);
  };
  const onClickCloseDeleteRowModal = () => {
    setOpenDeleteRowModal(false);
  };
  const deleteProductSKURow = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/printhouse-config/productsSKU/delete-product-sku-by-id`,
      {
        Id: selectedProductId

      }
    );
    if (res?.success) {
      alertSuccessDelete()
      getAllProductsSKU();
      onClickCloseDeleteRowModal()
    } else {
      alertFaultDelete()
    }
  }, [selectedProductId]);

  return {
    t,
    productClientsList,
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    productState,
    onChangeStateProduct,
    errorName,
    errorCode,
    SelectproductClient,
    customersList,
    clientTypesList,
    openDeleteRowModal,
    onClickOpenDeleteRowModal,
    onClickCloseDeleteRowModal,
    UploadProductImage,
    setSelectProductClient,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    createNewProduct,
    createNewProductAndGoToParameterList,
    updatedProduct,
    deleteProductSKURow,
    openPricingTypeModal,
    onClickOpenPricingType,
    onClickClosePricingType,
    selectPricingType
  };
};

export { useSettings };
