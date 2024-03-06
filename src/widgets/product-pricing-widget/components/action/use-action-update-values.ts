import { useRecoilValue} from "recoil";
import {
    currentProductItemValueDraftId,
    jobActionsState,
} from "@/widgets/product-pricing-widget/state";
import {useState} from "react";
import {
    updateProductItemDraftActionData,
    updateProductItemDraftActionMachine
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {currentCalculationConnectionId} from "@/store";

const useActionUpdateValues = () => {
    const actions = useRecoilValue(jobActionsState);
    const currentProductItemValue = useRecoilValue<any>(currentProductItemValueDraftId);
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

    const apiCallBack = (res: {success: boolean}) => {
        if (res.success) {
            alertSuccessUpdate()
        }else {
            alertFaultUpdate()
        }
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const selectNewMachine = (machineId: string, actionId: string, productType: string, actionIndex: number) => {
        updateProductItemDraftActionMachine(callApi, apiCallBack, {
            actionId: actionId,
            machineId: machineId,
            productType: productType,
            productItemValueId: currentProductItemValue,
            actionIndex: actionIndex,
            signalRConnectionId: connectionId
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
        selectNewMachine,
        updateActionData,
        open,
        anchorEl,
        handleClick,
        handleClose,
    };
};

export {useActionUpdateValues};
