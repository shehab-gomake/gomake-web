import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentCalculationSessionIdState,
  currentProductItemValueDraftId,
  currentProductItemValuePriceState,
  jobActionsState,
  openModalMaterialState,
  openModalMachineState,
  sliderCurrentProductItemValuePriceState,
  attributesDataState,
} from "@/widgets/product-pricing-widget/state";
import { useEffect, useState } from "react";
import {
  changeWorkFlw,
  updateActionEmployeeApi,
  updateProductItemDraftActionData,
  updateProductItemDraftActionMachine,
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { currentCalculationConnectionId, foldOptionsState } from "@/store";
import {
  getEmployeesByActionIdApi,
  getMachineByActionIdNewApi,
} from "@/services/api-service/customers/employees-api";
import { getMaterialsSizesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

interface AttributesData {
  machineName?: string;
  actionId?: string;
  productType?: any;
  actionIndex?: number;
  machineId?: string;
  printingActionId?: string;
  printHouseMaterialSizeName?: string;
  printHouseMaterialSizeId?: string;
  emplyeeId?: string;
  emplyeeName?: string;
  foldOptionValueId?: string;
}
const useActionUpdateValues = () => {
  const actions = useRecoilValue(jobActionsState);
  const currentProductItemValue = useRecoilValue<any>(
    currentProductItemValueDraftId
  );
  const [attributesData, setAttributesData] = useRecoilState<AttributesData>(attributesDataState);
  console.log("attributesData", attributesData);
  const [openModalMachine, setOpenModalMachine] = useRecoilState(openModalMachineState);
  const [openModalMaterial, setOpenModalMaterial] = useRecoilState(openModalMaterialState);
  const [currentCalculationSessionId, setCurrentCalculationSessionId] =
    useRecoilState<any>(currentCalculationSessionIdState);
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);
  const [
    sliderCurrentProductItemValueTotalPrice,
    setSliderCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(sliderCurrentProductItemValuePriceState);
  const onClickOpenModalMachine = () => {
    setOpenModalMachine(true);
  };
  const onClickCloseModalMachine = () => {
    setOpenModalMachine(false);
  };
  const onClickOpenModalMaterial = () => {
    setOpenModalMaterial(true);
  };
  const onClickCloseModalMaterial = () => {
    setOpenModalMaterial(false);
  };
  const connectionId = useRecoilValue(currentCalculationConnectionId);
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const getActionMachinesList = (
    actionId: string,
    productType: string | null
  ) => {
    const action = actions.find(
      (action) =>
        action.actionId === actionId && productType === action.productType
    );
    if (action) {
      return action?.machineCategories
        ?.flatMap((category) => category.machines)
        ?.map((machine) => ({
          value: machine.machineId,
          label: machine.machineName,
        }));
    }
    return [];
  };

  const getActionEmloyeeList = (
    actionId: string,
    productType: string | null
  ) => {
    const employees = actions.find(
      (action) =>
        action.actionId === actionId && productType === action.productType
    );
    if (employees) {
      return employees?.employees?.map((employee) => ({
        value: employee.id,
        label: employee.name,
      }));
    }
    return [];
  };

  const getActionMaterialsList = (
    actionId: string,
    productType: string | null
  ) => {
    const material = actions.find(
      (action) =>
        action.actionId === actionId && productType === action.productType
    );
    if (material) {
      return material?.materials
        ?.flatMap((category) => category.materialCategories)
        ?.map((machine) => ({
          value: machine.printHouseMaterialId,
          label: machine.name,
        }));
    }
    return [];
  };
  const apiCallBack = (res: { success: boolean }) => {
    if (res.success) {
      alertSuccessUpdate();
    } else {
      alertFaultUpdate();
    }
  };
  const apiCallBackMachine = (res: any) => {
    if (res.success) {
      const { item1, item2 } = res.data || {};
      setCurrentCalculationSessionId(item2);
  
      if (item1?.exceptionType === 0) {
        onClickOpenModalMachine();
      } else {
        setCurrentProductItemValueTotalPrice(null);
        setSliderCurrentProductItemValueTotalPrice(null);
        setCurrentCalculationSessionId(item2);
        alertSuccessUpdate();
      }
    } else {
      onClickOpenModalMachine();
    }
  };
  const apiCallBackMaterial = (res) => {
    if (res.success) {
      if (res.data?.item1?.exceptionType === 0) {
        onClickOpenModalMaterial();
      } else {
        setCurrentCalculationSessionId(res.data.item2);
        setCurrentProductItemValueTotalPrice(null);
        setSliderCurrentProductItemValueTotalPrice(null); //!new
        alertSuccessUpdate();
      }
    } else {
      onClickOpenModalMaterial();
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const selectNewMachine = (
    machineId: string,
    actionId: string,
    productType: string,
    actionIndex: number,
    machineName: string
  ) => {
    updateProductItemDraftActionMachine(callApi, apiCallBackMachine, {
      actionId: actionId,
      machineId: machineId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      tabName: machineName
    }).then();
  };
  const selectNewMaterials = (
    printHouseMaterialSizeId: string,
    actionId: string,
    productType: string,
    actionIndex: number,
    materialName: string
  ) => {
    updateProductItemDraftActionMachine(callApi, apiCallBackMaterial, {
      actionId: actionId,
      printHouseMaterialSizeId: printHouseMaterialSizeId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      tabName: materialName
    }).then();
  };

  const selectNewFold = (
    FoldOptionValueId: string,
    actionId: string,
    productType: string,
    actionIndex: number,
    foldName: string
  ) => {
    updateProductItemDraftActionMachine(callApi, apiCallBackMaterial, {
      actionId: actionId,
      foldOptionValueId: FoldOptionValueId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      tabName: foldName
    }).then();
  };

  const updateWorkFlowForMachine = () => {
    changeWorkFlw(callApi, apiCallBack, {
      actionId: attributesData.actionId,
      machineId: attributesData.machineId,
      productType: attributesData.productType,
      productItemValueId: currentProductItemValue,
      actionIndex: attributesData.actionIndex,
      signalRConnectionId: connectionId,
      machineName: attributesData.machineName,
      printingActionId: attributesData.printingActionId,
    }).then();
  };
  const updateWorkFlowForMaterials = () => {
    changeWorkFlw(callApi, apiCallBack, {
      actionId: attributesData.actionId,
      productType: attributesData.productType,
      productItemValueId: currentProductItemValue,
      actionIndex: attributesData.actionIndex,
      signalRConnectionId: connectionId,
      printingActionId: attributesData.printingActionId,
      printHouseMaterialSizeId: attributesData.printHouseMaterialSizeId,
      printHouseMaterialSizeName: attributesData.printHouseMaterialSizeName,
    }).then();
  };

  const updateWorkFlowForEmployees = (
    actionId,
    productType,
    actionIndex,
    emplyeeName,
    emplyeeId,
    printingActionId
  ) => {
    updateActionEmployeeApi(callApi, apiCallBack, {
      actionId: actionId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      printingActionId: printingActionId,
      emplyeeId: emplyeeId,
      emplyeeName: emplyeeName,
    }).then();
  };

  const updateWorkFlowForFold = (
    actionId,
    productType,
    actionIndex,
    FoldOptionValueId,
    printingActionId
  ) => {
    changeWorkFlw(callApi, apiCallBack, {
      actionId: actionId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      printingActionId: printingActionId,
      foldOptionValueId: FoldOptionValueId,
    }).then();
  };


  const changeWorkFlowOutputDTOApi = (
    actionId,
    productType,
    actionIndex,
    printingActionId,
    outputs
  ) => {
    updateProductItemDraftActionMachine(callApi, apiCallBackMachine, {
      actionId: actionId,
      productType: productType,
      productItemValueId: currentProductItemValue,
      actionIndex: actionIndex,
      signalRConnectionId: connectionId,
      outputs
    }).then();
    // changeWorkFlw(callApi, apiCallBack, {
    //   actionId: actionId,
    //   productType: productType,
    //   productItemValueId: currentProductItemValue,
    //   actionIndex: actionIndex,
    //   signalRConnectionId: connectionId,
    //   printingActionId: printingActionId,
    //   outputs
    // }).then();
  };

  const updateActionData = async (
    actionId: string,
    newValue: number,
    key: string,
    productType: string
  ) => {
    await updateProductItemDraftActionData(callApi, apiCallBack, {
      productItemValueId: currentProductItemValue,
      actionId: actionId,
      value: newValue,
      fieldName: key,
      productType: productType,
      signalRConnectionId: connectionId,
    });
  };

  const [employeesList, setemployeesList] = useState([]);
  const [machinesList, setMachinesList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const foldOptions = useRecoilValue(foldOptionsState);

  const onClickGetEmployeeForAction = async (actionId) => {
    const callBack = (res) => {
      if (res.success) {
        const employeeList = res.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setemployeesList(employeeList);
      } else {
        setemployeesList([]);
      }
    };
    await getEmployeesByActionIdApi(callApi, callBack, { ActionId: actionId });
  };

  const onClickGetMachineForAction = async (actionId) => {
    const callBack = (res) => {
      if (res.success) {
        const machinesList = res.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setMachinesList(machinesList);
      } else {
        setMachinesList([]);
      }
    };
    await getMachineByActionIdNewApi(callApi, callBack, { actionId });
  };

  const onClickGetMaterialsForAction = async (materials) => {
    const callBack = (res) => {
      if (res.success) {
        const materialList = res.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setMaterialsList(materialList);
      } else {
        setMaterialsList([]);
      }
    };
    await getMaterialsSizesApi(callApi, callBack, {
      ...materials?.printingMaterialInfo,
    });
  };

  return {
    getActionMachinesList,
    getActionMaterialsList,
    selectNewMachine,
    selectNewMaterials,
    updateActionData,
    selectNewFold,
    open,
    anchorEl,
    handleClick,
    handleClose,
    openModalMachine,
    openModalMaterial,
    onClickCloseModalMachine,
    onClickCloseModalMaterial,
    setAttributesData,
    updateWorkFlowForMachine,
    updateWorkFlowForMaterials,
    getActionEmloyeeList,
    updateWorkFlowForEmployees,
    onClickGetEmployeeForAction,
    onClickGetMachineForAction,
    employeesList,
    machinesList,
    onClickGetMaterialsForAction,
    materialsList,
    foldOptions,
    updateWorkFlowForFold,
    changeWorkFlowOutputDTOApi
  };
};

export { useActionUpdateValues };
