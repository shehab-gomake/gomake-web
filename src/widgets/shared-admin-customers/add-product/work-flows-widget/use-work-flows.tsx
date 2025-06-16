import { useCallback, useEffect } from "react";
import { getAllActionsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import {
  addActionToProductApi,
  deleteActionFromProductApi,
  getProductActionsApi,
  updateActionsOrderInProductApi,
  updateProductActionApi,
} from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { getOutsourcingSuppliersListApi } from "@/services/api-service/suppliers/suppliers-endpoints";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { useSetRecoilState } from "recoil";
import { EHttpMethod } from "@/services/api-service/enums";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { EPricingViews, EWorkSource } from "@/widgets/product-pricing-widget/enums";

const useWorkFlows = ({ getProductById, sourceTypeFromProduct }: any) => {
  const { callApi } = useGomakeAxios();
  const {
    alertFaultUpdate,
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessUpdate,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);

  const [productActions, setProductActions] = useState([]);
  const [actionListDropDown, setActionListDropDown] = useState([]);
  const [actionNameSelected, setActionNameSelected] = useState<any>();
  const router = useRouter();
  const [isAddNewAction, setIsAddNewAction] = useState(false);
  const [anchorElActionsListMenu, setAnchorElActionsListMenu] =
    useState<null | HTMLElement>(null);
  const openActionsListMenu = Boolean(anchorElActionsListMenu);

  const [openCopyAnotherProductsModal, setOpenCopyAnotherProductsModal] =
    useState(false);
  const handleOpenCopyAnotherProductsModal = () => {
    setOpenCopyAnotherProductsModal(true);
  };

  const handleCloseCopyAnotherProductsModal = () => {
    setOpenCopyAnotherProductsModal(false);
  };

  const [view, setView] = useState(EPricingViews.SELECTED_WORKFLOW);
  const [sourceType, setSourceType] = useState(EWorkSource.INTERNAL);



  const handleCloseActionsListMenu = () => {
    setAnchorElActionsListMenu(null);
  };

  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
  } = useCustomerDropDownList({
    clientType: CLIENT_TYPE.SUPPLIER,
  });

  const handleOpenActionsListMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElActionsListMenu(event.currentTarget);
  };
  const onClickAddNewAction = () => {
    setIsAddNewAction(true);
  };

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActionListDropDown(res?.data);
      }
    };
    await getAllActionsApi(callApi, callBack, {
      includeOutSourceAction: false,
    });
  };
  useEffect(() => {
    getActions();
  }, []);

  const addActionToProduct = async (actionNameSelected: any) => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        getProductActions();
      } else {
        alertFaultAdded();
      }
    };
    await addActionToProductApi(callApi, callBack, {
      productId: productId,
      actionId: actionNameSelected?.id,
      // productType: "string",
      // sectionName: "string"
    });
  };
  const deleteActionFromProduct = async (selectedAction: any) => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        getProductActions();
      } else {
        alertFaultDelete();
      }
    };
    await deleteActionFromProductApi(callApi, callBack, {
      productId: productId,
      actionId: selectedAction,
    });
  };

  const updateActionsOrderInProduct = async (data: any) => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await updateActionsOrderInProductApi(callApi, callBack, {
      productId: productId,
      data,
    });
  };
  const updateProductAction = async (data: any) => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getProductActions();
      } else {
        alertFaultUpdate();
      }
    };
    const requestBody: any = {
      productId: productId,
      actionId: data?.actionId,
      value: data?.value?.toString(),
    };

    if (data?.fieldName) {
      requestBody.fieldName = data.fieldName;
    }
    if (data?.emplyeeName) {
      requestBody.emplyeeName = data?.emplyeeName;
    }
    if (data?.machineName) {
      requestBody.machineName = data?.machineName;
    }

    await updateProductActionApi(callApi, callBack, requestBody);
  };

  const getProductActions = async () => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        setProductActions(res?.data);
      }
    };
    await getProductActionsApi(callApi, callBack, {
      productId,
      translateActions: true,
    });
  };
  useEffect(() => {
    getProductActions();
  }, []);

  const getOutSourcingSuppliers = () => {
    const callBack = (res) => {
      if (res.success) {
        setOutSuppliers(res.data);
      }
    };
    getOutsourcingSuppliersListApi(callApi, callBack, {}).then();
  };
  useEffect(() => {
    getOutSourcingSuppliers();
  }, []);

  const toggleIgnoreCalculatedWorkflows = useCallback(async () => {
    const res: any = await callApi(
      EHttpMethod.PUT,
      "/v1/printhouse-config/products/toggle-ignore-calculated-workflows",
      {
        productId: router.query?.id,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      getProductById();
    } else {
      alertFaultUpdate();
    }
  }, []);

  const updateProductSourceType = useCallback(async (sourceType: EWorkSource) => {
    const res: any = await callApi(
      EHttpMethod.PUT,
      "/v1/printhouse-config/products/update-product-source-type",
      {
        productId: router.query?.id,
        sourceType,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      setView(
        sourceType === EWorkSource.OUT
          ? EPricingViews.OUTSOURCE_WORKFLOW
          : EPricingViews.SELECTED_WORKFLOW
      );
      getProductActions();
      getProductById();
    } else {
      alertFaultUpdate();
    }
  }, []);

  useEffect(() => {
    console.log("sourceTypeFromProduct", sourceTypeFromProduct);
    if (sourceTypeFromProduct === EWorkSource.OUT) {
      setView(EPricingViews.OUTSOURCE_WORKFLOW);
    } else {
      setView(EPricingViews.SELECTED_WORKFLOW);
    }
  }, [sourceTypeFromProduct]);
  return {
    actionListDropDown,
    anchorElActionsListMenu,
    openActionsListMenu,
    productActions,
    setActionNameSelected,
    handleCloseActionsListMenu,
    handleOpenActionsListMenu,
    onClickAddNewAction,
    addActionToProduct,
    deleteActionFromProduct,
    updateActionsOrderInProduct,
    updateProductAction,
    toggleIgnoreCalculatedWorkflows,
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    openCopyAnotherProductsModal,
    handleOpenCopyAnotherProductsModal,
    handleCloseCopyAnotherProductsModal,
    view,
    setView,
    updateProductSourceType,
    sourceType,
    setSourceType,
  };
};

export { useWorkFlows };
