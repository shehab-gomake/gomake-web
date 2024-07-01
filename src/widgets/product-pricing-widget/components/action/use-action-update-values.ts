import { useRecoilValue} from "recoil";
import {
    currentProductItemValueDraftId,
    jobActionsState,
} from "@/widgets/product-pricing-widget/state";
import {useState} from "react";
import {
    changeWorkFlw,
    updateActionEmployeeApi,
    updateProductItemDraftActionData,
    updateProductItemDraftActionMachine
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {currentCalculationConnectionId} from "@/store";

interface AttributesData {
    machineName?: string; 
    actionId?:string,
    productType?:any;
    actionIndex?:number;
    machineId?:string;
    printingActionId?:string;
    printHouseMaterialSizeName?:string;
    printHouseMaterialSizeId?:string;
    emplyeeId?:string;
    emplyeeName?:string;
}
const useActionUpdateValues = () => {
    const actions = useRecoilValue(jobActionsState);
    const currentProductItemValue = useRecoilValue<any>(currentProductItemValueDraftId);
    const [attributesData,setAttributesData] =useState<AttributesData>({})
    const [openModalMachine,setOpenModalMachine]=useState(false);
    const [openModalMaterial,setOpenModalMaterial]=useState(false);
    
    const onClickOpenModalMachine=()=>{
        setOpenModalMachine(true)
    }
    const onClickCloseModalMachine=()=>{
        setOpenModalMachine(false)
    }
    const onClickOpenModalMaterial=()=>{
        setOpenModalMaterial(true)
    }
    const onClickCloseModalMaterial=()=>{
        setOpenModalMaterial(false)
    }
    const connectionId = useRecoilValue(currentCalculationConnectionId);
    const {callApi} = useGomakeAxios();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
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

    const getActionMaterialsList  = (
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
    const apiCallBack = (res: {success: boolean}) => {
        if (res.success) {
            alertSuccessUpdate()
        }else {
            alertFaultUpdate()
        }
    }
    const apiCallBackMachine = (res: {success: boolean}) => {
        if (res.success) {
            alertSuccessUpdate()
        }else {
            onClickOpenModalMachine()
        }
    }
    const apiCallBackMaterial = (res: {success: boolean}) => {
        if (res.success) {
            alertSuccessUpdate()
        }else {
            onClickOpenModalMaterial()
        }
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const selectNewMachine = (machineId: string, actionId: string, productType: string, actionIndex: number) => {
        updateProductItemDraftActionMachine(callApi, apiCallBackMachine, {
            actionId: actionId,
            machineId: machineId,
            productType: productType,
            productItemValueId: currentProductItemValue,
            actionIndex: actionIndex,
            signalRConnectionId: connectionId
        }).then()
    }
    const selectNewMaterials = (printHouseMaterialSizeId: string, actionId: string, productType: string, actionIndex: number) => {
        updateProductItemDraftActionMachine(callApi, apiCallBackMaterial, {
            actionId: actionId,
            printHouseMaterialSizeId: printHouseMaterialSizeId,
            productType: productType,
            productItemValueId: currentProductItemValue,
            actionIndex: actionIndex,
            signalRConnectionId: connectionId
        }).then()
    }

    const selectNewEmployee = (printHouseMaterialSizeId: string, actionId: string, productType: string, actionIndex: number) => {
        updateProductItemDraftActionMachine(callApi, apiCallBackMaterial, {
            actionId: actionId,
            printHouseMaterialSizeId: printHouseMaterialSizeId,
            productType: productType,
            productItemValueId: currentProductItemValue,
            actionIndex: actionIndex,
            signalRConnectionId: connectionId
        }).then()
    }

    const updateWorkFlowForMachine = () => {
            changeWorkFlw(callApi, apiCallBack, {
            actionId: attributesData.actionId,
            machineId: attributesData.machineId,
            productType: attributesData.productType,
            productItemValueId: currentProductItemValue,
            actionIndex: attributesData.actionIndex,
            signalRConnectionId: connectionId,
            machineName:attributesData.machineName,
            printingActionId: attributesData.printingActionId
        }).then()
    }
    const updateWorkFlowForMaterials = () => {
            changeWorkFlw(callApi, apiCallBack, {
            actionId: attributesData.actionId,
            productType: attributesData.productType,
            productItemValueId: currentProductItemValue,
            actionIndex: attributesData.actionIndex,
            signalRConnectionId: connectionId,
            printingActionId: attributesData.printingActionId,
            printHouseMaterialSizeId: attributesData.printHouseMaterialSizeId,
            printHouseMaterialSizeName: attributesData.printHouseMaterialSizeName
        }).then()
    }

    const updateWorkFlowForEmployees = (actionId,productType,actionIndex,emplyeeName,emplyeeId,printingActionId) => {
        updateActionEmployeeApi(callApi, apiCallBack, {
        actionId: actionId,
        productType: productType,
        productItemValueId: currentProductItemValue,
        actionIndex: actionIndex,
        signalRConnectionId: connectionId,
        printingActionId: printingActionId,
        emplyeeId: emplyeeId,
        emplyeeName: emplyeeName
    }).then()
}


    const updateActionData = async (actionId: string, newValue: number, key: string, productType: string) => {
        await updateProductItemDraftActionData(callApi, apiCallBack, {
            productItemValueId: currentProductItemValue,
            actionId: actionId,
            value: newValue,
            fieldName: key,
            productType: productType,
            signalRConnectionId: connectionId
        })
    }

    return {
        getActionMachinesList,
        getActionMaterialsList,
        selectNewMachine,
        selectNewEmployee,
        selectNewMaterials,
        updateActionData,
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
        updateWorkFlowForEmployees
    };
};

export {useActionUpdateValues};
