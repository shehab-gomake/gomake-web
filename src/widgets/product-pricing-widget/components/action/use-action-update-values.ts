import {IOutput, IWorkFlowAction} from "@/widgets/product-pricing-widget/interface";
import {useRecoilState} from "recoil";
import {workFlowsState} from "@/widgets/product-pricing-widget/state";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";

const useActionUpdateValues = () => {
    const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
    const updateDeliveryTime = (updatedObj: IOutput, actionId: string) => {
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalRealProductionTimeO: updatedObj
            });
            updateSelectedWorkFlow(updatedActions);
        }
    }

    const updateCost = (cost: string, profit: string = '0', actionId: string, source: EWorkSource) => {
        const price = +cost + (+profit * +cost / 100);
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalCostO: {
                    ...action.totalCostO,
                    values: source === EWorkSource.INTERNAL ? [cost] : action.totalCostO.values,
                    outSourceValues: source === EWorkSource.OUT ? [cost] : action.totalCostO.outSourceValues
                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: [price.toString()],
                    outSourceValues: source === EWorkSource.OUT ? [price.toString()] : action.totalPriceO.outSourceValues

                }
            })
            updateSelectedWorkFlow(updatedActions);
        }
    };

    const updateProfit = (cost: string, profit: string, actionId: string, source: EWorkSource) => {
        const price = +cost + (+profit * +cost / 100);
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profitO: {
                    ...action.profitO,
                    values: source === EWorkSource.INTERNAL ? [profit.toString()] : action.profitO.values,
                    outSourceValues: source === EWorkSource.OUT ? [profit.toString()] : action.profitO.outSourceValues
                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: source === EWorkSource.INTERNAL ? [price.toString()] : action.totalPriceO.values,
                    outSourceValues: source === EWorkSource.OUT ? [price.toString()] : action.totalPriceO.values
                }
            })
            updateSelectedWorkFlow(updatedActions);
        }
    }

    const updatePrice = (price: string, cost: string, actionId: string, source: EWorkSource) => {
        const profit = +price - +cost;
        const profitPercentage = profit / +cost * 100;
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profitO: {
                    ...action.profitO,
                    values: source === EWorkSource.INTERNAL ?  [profitPercentage.toString()] : action.profitO.values,
                    outSourceValues: source === EWorkSource.OUT ?  [profitPercentage.toString()] : action.profitO.outSourceValues,

                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: source === EWorkSource.INTERNAL ? [price] : action.totalPriceO.values,
                    outSourceValues: source === EWorkSource.OUT ? [price] : action.totalPriceO.outSourceValues
                }
            })

            updateSelectedWorkFlow(updatedActions)
        }
    }

    const updateSelectedWorkFlow = (actions: IWorkFlowAction[]) => {
        const totalPrice = actions.reduce((sum, action) => action.source === EWorkSource.OUT ?
            action.totalPriceO?.outSourceValues && action.totalPriceO?.outSourceValues[0] ? sum + +action.totalPriceO?.outSourceValues[0] :
                sum :
            sum + +action.totalPriceO.values[0], 0);
        const totalCost = actions.reduce((sum, action) => action.source === EWorkSource.OUT ?
            action.totalCostO?.outSourceValues && action.totalCostO?.outSourceValues[0] ? sum + +action.totalCostO?.outSourceValues[0] :
                sum :
            sum + +action.totalCostO.values[0], 0);

        const deliveryTime = actions.reduce((sum, action) =>action.source === EWorkSource.OUT ?
            action.totalRealProductionTimeO?.outSourceValues && action.totalRealProductionTimeO?.outSourceValues[0] ? sum + +action.totalRealProductionTimeO?.outSourceValues[0] :
                sum :
            sum + +action.totalRealProductionTimeO.values[0], 0);

        const profit = (totalPrice - totalCost) / totalCost * 100;
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: actions,
            totalPrice,
            totalPriceO: {
                ...flow.totalPriceO,
                values: [totalPrice.toString()],
            },
            totalCost: totalCost,
            totalCostO: {
                ...flow.totalCostO,
                values: [totalCost.toString()]
            },
            profitO: {
                ...flow.profitO,
                values: [!!profit ? profit.toString() : '0']
            },
            totalProductionTime: deliveryTime,
            totalRealProductionTimeO: {
                ...flow.totalRealProductionTimeO,
                values: [deliveryTime.toString()]
            }
        }))
    }

    const changeActionWorkSource = (source: EWorkSource, actionId: string) => {
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                source: source
            })

            updateSelectedWorkFlow(updatedActions)
        }
    }

    const updateActionSupplier = (supplierId: string, actionId: string) => {
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: flow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                supplierId: supplierId
            })
        }));
    }

    return {
        updateDeliveryTime,
        updateCost,
        updateProfit,
        updatePrice,
        changeActionWorkSource,
        updateActionSupplier
    }
}

export {useActionUpdateValues}