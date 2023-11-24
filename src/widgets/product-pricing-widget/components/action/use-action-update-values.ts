import {IOutput, IWorkFlowAction} from "@/widgets/product-pricing-widget/interface";
import {useRecoilState} from "recoil";
import {workFlowsState} from "@/widgets/product-pricing-widget/state";

const useActionUpdateValues = () => {
    const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
    const updateDeliveryTime = (updatedObj: IOutput, actionId: string) => {
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: flow.actions.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalRealProductionTimeO: updatedObj
            })
        }));
    }

    const updateCost = (cost: string, profit: string, actionId: string) => {
        const price = +cost + (+profit * +cost / 100);
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                totalCostO: {
                    ...action.totalCostO,
                    values: [cost]
                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: [price.toString()]
                }
            })

            updateSelectedWorkFlow(updatedActions);
        }
    };

    const updateProfit = (cost: string, profit: string, actionId: string) => {
        const price = +cost + (+profit * +cost / 100);
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profitO: {
                    ...action.profitO,
                    values: [profit]
                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: [price.toString()]
                }
            })
            updateSelectedWorkFlow(updatedActions);
        }
    }

    const updatePrice = (price: string, cost: string, actionId: string) => {
        const profit = +price - +cost;
        const profitPercentage = profit / +cost * 100;
        const selectedWorkFlow = workFlows?.find(flow => flow.selected);
        if (selectedWorkFlow) {
            const updatedActions = selectedWorkFlow.actions?.map(action => action.actionId !== actionId ? action : {
                ...action,
                profitO: {
                    ...action.profitO,
                    values: [profitPercentage.toString()]
                },
                totalPriceO: {
                    ...action.totalPriceO,
                    values: [price]
                }
            })

            updateSelectedWorkFlow(updatedActions)
        }
    }

    const updateSelectedWorkFlow = (actions: IWorkFlowAction[]) => {
        const totalPrice = actions.reduce((sum, action) => sum + +action.totalPriceO.values[0], 0);
        const totalCost = actions.reduce((sum, action) => sum + +action.totalCostO.values[0], 0);
        const profit = (totalPrice - totalCost) / totalCost * 100;
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: actions,
            totalPrice,
            totalPriceO: {
                ...flow.totalPriceO,
                values: [totalPrice.toString()]
            },
            totalCost: totalCost,
            totalCostO: {
                ...flow.totalCostO,
                values: [totalCost.toString()]
            },
            profitO: {
                ...flow.profitO,
                values: [profit.toString()]
            }
        }))
    }

    return {
        updateDeliveryTime,
        updateCost,
        updateProfit,
        updatePrice
    }
}

export {useActionUpdateValues}