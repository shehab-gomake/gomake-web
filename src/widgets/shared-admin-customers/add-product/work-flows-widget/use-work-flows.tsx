import { useEffect } from "react";
import { getAllActionsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { addActionToProductApi, deleteActionFromProductApi, getProductActionsApi, updateActionsOrderInProductApi, updateProductActionApi } from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { getOutsourcingSuppliersListApi } from "@/services/api-service/suppliers/suppliers-endpoints";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { useSetRecoilState } from "recoil";

const useWorkFlows = () => {
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
  const generalInformation = [
    {
      "name": "Quantity",
      "index": null,
      "values": [
        "1000"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 0,
      "defaultUnit": null,
      "id": "4991945c-5e07-4773-8f11-2e3483b70b53",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "quantity"
    },
    {
      "name": "Job Name",
      "index": null,
      "values": [
        "Test1"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 0,
      "defaultUnit": null,
      "id": "a330193f-492c-40a8-86f3-8edf5c8f0d5e",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "Job Name"
    },
    {
      "name": "Sheet category",
      "index": null,
      "values": [
        "Gray back Duplex"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 0,
      "defaultUnit": null,
      "id": "d7b058c4-0409-43e8-b446-8f70a7027a02",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "Sheet category"
    },
    {
      "name": "Length",
      "index": null,
      "values": [
        "29.7"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 1,
      "defaultUnit": "cm",
      "id": "d2c965d3-6b08-4380-9d4b-17c361d7e484",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "Height"
    },
    {
      "name": "Width",
      "index": null,
      "values": [
        "21"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 1,
      "defaultUnit": "cm",
      "id": "4ba9a275-4fbc-4313-b284-e9b1cf8b452e",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "Width"
    },
    {
      "name": "Size",
      "index": null,
      "values": [
        "A4"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 0,
      "defaultUnit": null,
      "id": "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "size"
    },
    {
      "name": "Types",
      "index": null,
      "values": [
        "1"
      ],
      "outSourceValues": null,
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 0,
      "defaultUnit": null,
      "id": "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b",
      "propertyType": 1,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "types"
    },
    {
      "name": "Delivery Time",
      "index": null,
      "values": [
        "1.1"
      ],
      "outSourceValues": [
        "0"
      ],
      "rectangles": null,
      "useableWasteRectangels": null,
      "unuseableWasteRectangels": null,
      "materialWidth": 0,
      "materialLength": 0,
      "unitType": 5,
      "defaultUnit": "hr",
      "id": "00000000-0000-0000-0000-000000000000",
      "propertyType": 0,
      "htmlElementType": 1,
      "isEditable": false,
      "displayInOutputId": null,
      "tableHeaders": null,
      "tableRows": null,
      "orginalName": "Total time"
    }
  ]
  const [productActions, setProductActions] = useState([]);
  const [actionListDropDown, setActionListDropDown] = useState([]);
  const [actionNameSelected, setActionNameSelected] = useState<any>()
  const router = useRouter();
  const [isAddNewAction, setIsAddNewAction] = useState(false)
  const [anchorElActionsListMenu, setAnchorElActionsListMenu] = useState<null | HTMLElement>(null);
  const openActionsListMenu = Boolean(anchorElActionsListMenu);
  const handleCloseActionsListMenu = () => {
    setAnchorElActionsListMenu(null);
  };
  const handleOpenActionsListMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElActionsListMenu(event.currentTarget);
  };
  const onClickAddNewAction = () => {
    setIsAddNewAction(true)
  }

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActionListDropDown(res?.data);
      }
    };
    await getAllActionsApi(callApi, callBack);
  };
  useEffect(() => {
    getActions();
  }, []);

  const addActionToProduct = async (actionNameSelected: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded()
        getProductActions()
      }
      else {
        alertFaultAdded()
      }
    }
    await addActionToProductApi(callApi, callBack, {
      productId: productId,
      actionId: actionNameSelected?.id,
      // productType: "string",
      // sectionName: "string"
    });
  }
  const deleteActionFromProduct = async (selectedAction: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete()
        getProductActions()
      }
      else {
        alertFaultDelete()
      }
    }
    await deleteActionFromProductApi(callApi, callBack, {
      productId: productId,
      actionId: selectedAction,
    });
  }

  const updateActionsOrderInProduct = async (data: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      if (res.success) {
      }
    }
    await updateActionsOrderInProductApi(callApi, callBack, {
      productId: productId,
      data
    });
  }
  const updateProductAction = async (data: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate()
        getProductActions()
      }
      else {
        alertFaultUpdate()
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
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      console.log(res)
      if (res.success) {
        setProductActions(res?.data);
      }
    }
    await getProductActionsApi(callApi, callBack, { productId, translateActions: true });
  }
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
  return {
    generalInformation,
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
    updateProductAction
  };
};

export { useWorkFlows };
