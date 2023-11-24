import {IOutput} from "@/widgets/product-pricing-widget/interface";
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
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: flow.actions.map(action => action.actionId !== actionId ? action : {
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
        }));
    }
    const updateProfit = (cost: string, profit: string, actionId: string) => {
        const price = +cost + (+profit * +cost / 100);
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: flow.actions.map(action => action.actionId !== actionId ? action : {
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
        }));
    }

    const updatePrice = (price: string, cost: string, actionId: string) => {
        const profit = +price - +cost;
        const profitPercentage = profit / +cost * 100;
        setWorkFlows(workFlows.map(flow => !flow.selected ? flow : {
            ...flow,
            actions: flow.actions.map(action => action.actionId !== actionId ? action : {
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
        }));
    }

    return {
        updateDeliveryTime,
        updateCost,
        updateProfit,
        updatePrice
    }
}

export {useActionUpdateValues}