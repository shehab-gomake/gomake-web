import {ICalculatedWorkFlow, IOutput, IWorkFlowAction} from "@/widgets/product-pricing-widget/interface";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    currentProductItemValueDraftId,
    jobActionsState,
    selectedWorkFlowState,
    workFlowsState
} from "@/widgets/product-pricing-widget/state";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {useGomakeAxios} from "@/hooks";
import {
    updateProductItemDraftActionData,
    updateProductItemDraftActionMachine
} from "@/services/api-service/quotes/save-product-item-value-draft-api";

const useActionUpdateValues = (workFlowId: string, isSubWorkFlow: boolean) => {
    const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
    const actions = useRecoilValue(jobActionsState);
    const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
    const selectedSubWorkFlow = selectedWorkFlow?.subWorkFlows?.find(flow => flow.id === workFlowId);
    const flow = isSubWorkFlow ? selectedSubWorkFlow : selectedWorkFlow;
    const currentProductItemValue = useRecoilValue<any>(currentProductItemValueDraftId);

    const {callApi} = useGomakeAxios();
    const updateDeliveryTime = (updatedObj: IOutput, actionId: string) => {
        if (flow) {
            const updatedActions = flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalProductionTime: updatedObj
            });
            updateSelectedWorkFlow(updatedActions);
        }
    }

    const updateCost = (cost: string, profit: string = '0', actionId: string, source: EWorkSource) => {
        const price = +cost + (+profit * +cost / 100);
        if (flow) {
            const updatedActions = flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalCost: {
                    ...action.totalCost,
                    values: source === EWorkSource.INTERNAL ? [cost] : action.totalCost.values,
                    outSourceValues: source === EWorkSource.OUT ? [cost] : action.totalCost.outSourceValues
                },
                totalPrice: {
                    ...action.totalPrice,
                    values: [price.toString()],
                    outSourceValues: source === EWorkSource.OUT ? [price.toString()] : action.totalPrice.outSourceValues

                }
            })
            updateSelectedWorkFlow(updatedActions);
        }
    };

    const updateProfit = (cost: string, profit: string, actionId: string, source: EWorkSource) => {
        const price = +cost + (+profit * +cost / 100);
        if (flow) {
            const updatedActions = flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profit: {
                    ...action.profit,
                    values: source === EWorkSource.INTERNAL ? [profit.toString()] : action.profit.values,
                    outSourceValues: source === EWorkSource.OUT ? [profit.toString()] : action.profit.outSourceValues
                },
                totalPrice: {
                    ...action.totalPrice,
                    values: source === EWorkSource.INTERNAL ? [price.toString()] : action.totalPrice.values,
                    outSourceValues: source === EWorkSource.OUT ? [price.toString()] : action.totalPrice.values
                }
            })
            updateSelectedWorkFlow(updatedActions);
        }
    }

    const updatePrice = (price: string, cost: string, actionId: string, source: EWorkSource) => {
        const profit = +price - +cost;
        const profitPercentage = profit / +cost * 100;
        if (flow) {
            const updatedActions = flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profit: {
                    ...action.profit,
                    values: source === EWorkSource.INTERNAL ? [profitPercentage.toString()] : action.profit.values,
                    outSourceValues: source === EWorkSource.OUT ? [profitPercentage.toString()] : action.profit.outSourceValues,

                },
                totalPrice: {
                    ...action.totalPrice,
                    values: source === EWorkSource.INTERNAL ? [price] : action.totalPrice.values,
                    outSourceValues: source === EWorkSource.OUT ? [price] : action.totalPrice.outSourceValues
                }
            })

            updateSelectedWorkFlow(updatedActions)
        }
    }

    const calculateWorkFlowActionsTotalPrice = (actions: IWorkFlowAction[]) => {
        return actions.reduce((sum, action) => action.source === EWorkSource.OUT ?
            action.totalPrice?.outSourceValues && action.totalPrice?.outSourceValues[0] ? sum + +action.totalPrice?.outSourceValues[0] :
                sum :
            sum + +action.totalPrice.values[0], 0);
    }
    const calculateWorkFlowActionsTotalCost = (actions: IWorkFlowAction[]) => {
        return actions.reduce((sum, action) => action.source === EWorkSource.OUT ?
            action.totalCost?.outSourceValues && action.totalCost?.outSourceValues[0] ? sum + +action.totalCost?.outSourceValues[0] :
                sum :
            sum + +action.totalCost.values[0], 0);

    }
    const calculateWorkFlowActionsDeliveryTime = (actions: IWorkFlowAction[]) => {
        return actions.reduce((sum, action) => action.source === EWorkSource.OUT ?
            action.totalCost?.outSourceValues && action.totalCost?.outSourceValues[0] ? sum + +action.totalCost?.outSourceValues[0] :
                sum :
            sum + +action.totalCost.values[0], 0);

    }

    const calculateSubsWorkFlow = (subWorkFlows: ICalculatedWorkFlow[]) => {
        const subsTotalPrice = subWorkFlows?.reduce((sum, flow) => calculateWorkFlowActionsTotalPrice(flow.actions), 0)
        const subsTotalCost = subWorkFlows?.reduce((sum, flow) => calculateWorkFlowActionsTotalCost(flow.actions), 0)
        const subsDeliveryTime = subWorkFlows?.reduce((sum, flow) => calculateWorkFlowActionsDeliveryTime(flow.actions), 0)
        return {
            subsTotalPrice,
            subsTotalCost,
            subsDeliveryTime
        }
    }
    const updateSelectedWorkFlow = (actions: IWorkFlowAction[]) => {
        const totalPrice = calculateWorkFlowActionsTotalPrice(actions);
        const totalCost = calculateWorkFlowActionsTotalCost(actions);
        const deliveryTime = calculateWorkFlowActionsDeliveryTime(actions);
        const profit = (totalPrice - totalCost) / totalCost * 100;

        const subWorkFlows = selectedWorkFlow?.subWorkFlows?.map(subFlow => subFlow.id !== workFlowId ? subFlow : {
            ...subFlow,
            actions: actions,
            totalPrice: {
                ...flow.totalPrice,
                values: [totalPrice.toString()],
            },
            totalCost: {
                ...flow.totalCost,
                values: [totalCost.toString()]
            },
            profit: {
                ...flow.profit,
                values: [!!profit ? profit.toString() : '0']
            },
            totalRealProductionTime: {
                ...flow.totalRealProductionTime,
                values: [deliveryTime.toString()]
            }
        })

        const {subsTotalPrice, subsTotalCost, subsDeliveryTime} = calculateSubsWorkFlow(subWorkFlows);

        setWorkFlows(workFlows.map(flow =>
            !flow.selected ? flow :
                isSubWorkFlow ?
                    {
                        ...flow,
                        subWorkFlows: subWorkFlows,
                        totalPrice: {
                            ...flow.totalPrice,
                            values: [(subsTotalPrice + calculateWorkFlowActionsTotalPrice(flow.actions)).toString()]
                        },
                        totalCost: {
                            ...flow.totalCost,
                            values: [(subsTotalCost + calculateWorkFlowActionsTotalCost(flow.actions)).toString()]
                        },
                        totalRealProductionTime: {
                            ...flow.totalRealProductionTime,
                            values: [(subsDeliveryTime + calculateWorkFlowActionsDeliveryTime(flow.actions)).toString()]
                        }
                    }
                    :
                    {
                        ...flow,
                        actions: actions,
                        totalPrice: {
                            ...flow.totalPrice,
                            values: [(subsTotalPrice + totalPrice).toString()],
                        },
                        totalCost: {
                            ...flow.totalCost,
                            values: [(subsTotalCost + totalCost).toString()]
                        },
                        profit: {
                            ...flow.profit,
                            values: [!!profit ? profit.toString() : '0']
                        },
                        totalRealProductionTime: {
                            ...flow.totalRealProductionTime,
                            values: [(subsDeliveryTime + calculateWorkFlowActionsDeliveryTime(actions)).toString()]
                        }
                    }))
    }

    const changeActionWorkSource = (source: EWorkSource, actionId: string) => {
        if (flow) {
            const updatedActions = flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                source: source
            })

            updateSelectedWorkFlow(updatedActions)
        }
    }

    const updateActionSupplier = (supplierId: string, actionId: string) => {
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: isSubWorkFlow ? flow.actions : flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                supplierId: supplierId,
            }),
            subWorkFlows: isSubWorkFlow ? flow?.subWorkFlows?.map(subFlow => subFlow.id === workFlowId ? {
                ...subFlow,
                actions: subFlow?.actions?.map(action => action.actionId !== actionId ? action : {
                    ...action,
                    supplierId: supplierId,
                }),
            } : subFlow) : flow?.subWorkFlows
        }));
    };

    const getActionMachinesList = (actionId: string, productType: string | null) => {
        const action = actions.find(action => action.actionId === actionId && productType === action.productType);
        if (action) {
            return action?.machineCategories?.flatMap(category => category.machines)?.map(machine => ({
                value: machine.machineId,
                label: machine.machineName
            }));
        }
        return [];
    }

    const selectNewMachine = (machineId: string, actionId: string, productType: string) => {
        const callBack = (res) => {
            if (res.success) {
                // alert(res.data);
                // setWorkFlows(workFlows.map(flow => flow.id === res.data ? {...flow, selected: true} : {...flow, selected: false}))
            }
        }
        updateProductItemDraftActionMachine(callApi, callBack, {
            actionId: actionId,
            machineId: machineId,
            productType: productType,
            productItemValueId: currentProductItemValue,
            actionIndex: 0
        }).then()
    }

    const updateActionData = async (actionId: string, newValue: number, key: string) => {
        await updateProductItemDraftActionData(callApi, () => {}, {
            productItemValueId: currentProductItemValue,
            actionId: actionId,
            value: newValue,
            fieldName: key,
            signalRConnectionId: "string"
        })
    }
    return {
        updateDeliveryTime,
        updateCost,
        updateProfit,
        updatePrice,
        changeActionWorkSource,
        updateActionSupplier,
        getActionMachinesList,
        selectNewMachine,
        updateActionData
    }
}

export {useActionUpdateValues}