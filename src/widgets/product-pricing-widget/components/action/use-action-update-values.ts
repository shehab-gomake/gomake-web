import {
  ICalculatedWorkFlow,
  IOutput,
  IWorkFlowAction,
} from "@/widgets/product-pricing-widget/interface";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  jobActionsState,
  selectedWorkFlowState,
  workFlowsState,
} from "@/widgets/product-pricing-widget/state";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { useState } from "react";

const useActionUpdateValues = (workFlowId: string, isSubWorkFlow: boolean) => {
  const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);
  const actions = useRecoilValue(jobActionsState);
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const selectedSubWorkFlow = selectedWorkFlow?.subWorkFlows?.find(
    (flow) => flow.id === workFlowId
  );
  const flow = isSubWorkFlow ? selectedSubWorkFlow : selectedWorkFlow;
  const updateDeliveryTime = (updatedObj: IOutput, actionId: string) => {
    if (flow) {
      const updatedActions = flow.actions?.map((action) =>
        action.actionId !== actionId
          ? action
          : {
              ...action,
              totalProductionTime: updatedObj,
            }
      );
      updateSelectedWorkFlow(updatedActions);
    }
  };

  const updateCost = (
    cost: string,
    profit: string = "0",
    actionId: string,
    source: EWorkSource
  ) => {
    const price = +cost + (+profit * +cost) / 100;
    if (flow) {
      const updatedActions = flow.actions?.map((action) =>
        action.actionId !== actionId
          ? action
          : {
              ...action,
              totalCost: {
                ...action.totalCost,
                values:
                  source === EWorkSource.INTERNAL
                    ? [cost]
                    : action.totalCost.values,
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [cost]
                    : action.totalCost.outSourceValues,
              },
              totalPrice: {
                ...action.totalPrice,
                values: [price.toString()],
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [price.toString()]
                    : action.totalPrice.outSourceValues,
              },
            }
      );
      updateSelectedWorkFlow(updatedActions);
    }
  };

  const updateProfit = (
    cost: string,
    profit: string,
    actionId: string,
    source: EWorkSource
  ) => {
    const price = +cost + (+profit * +cost) / 100;
    if (flow) {
      const updatedActions = flow.actions?.map((action) =>
        action.actionId !== actionId
          ? action
          : {
              ...action,
              profit: {
                ...action.profit,
                values:
                  source === EWorkSource.INTERNAL
                    ? [profit.toString()]
                    : action.profit.values,
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [profit.toString()]
                    : action.profit.outSourceValues,
              },
              totalPrice: {
                ...action.totalPrice,
                values:
                  source === EWorkSource.INTERNAL
                    ? [price.toString()]
                    : action.totalPrice.values,
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [price.toString()]
                    : action.totalPrice.values,
              },
            }
      );
      updateSelectedWorkFlow(updatedActions);
    }
  };

  const updatePrice = (
    price: string,
    cost: string,
    actionId: string,
    source: EWorkSource
  ) => {
    const profit = +price - +cost;
    const profitPercentage = (profit / +cost) * 100;
    if (flow) {
      const updatedActions = flow.actions?.map((action) =>
        action.actionId !== actionId
          ? action
          : {
              ...action,
              profit: {
                ...action.profit,
                values:
                  source === EWorkSource.INTERNAL
                    ? [profitPercentage.toString()]
                    : action.profit.values,
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [profitPercentage.toString()]
                    : action.profit.outSourceValues,
              },
              totalPrice: {
                ...action.totalPrice,
                values:
                  source === EWorkSource.INTERNAL
                    ? [price]
                    : action.totalPrice.values,
                outSourceValues:
                  source === EWorkSource.OUT
                    ? [price]
                    : action.totalPrice.outSourceValues,
              },
            }
      );

      updateSelectedWorkFlow(updatedActions);
    }
  };

  const calculateWorkFlowActionsTotalPrice = (actions: IWorkFlowAction[]) => {
    return actions.reduce(
      (sum, action) =>
        action.source === EWorkSource.OUT
          ? action.totalPrice?.outSourceValues &&
            action.totalPrice?.outSourceValues[0]
            ? sum + +action.totalPrice?.outSourceValues[0]
            : sum
          : sum + +action.totalPrice.values[0],
      0
    );
  };
  const calculateWorkFlowActionsTotalCost = (actions: IWorkFlowAction[]) => {
    return actions.reduce(
      (sum, action) =>
        action.source === EWorkSource.OUT
          ? action.totalCost?.outSourceValues &&
            action.totalCost?.outSourceValues[0]
            ? sum + +action.totalCost?.outSourceValues[0]
            : sum
          : sum + +action.totalCost.values[0],
      0
    );
  };
  const calculateWorkFlowActionsDeliveryTime = (actions: IWorkFlowAction[]) => {
    return actions.reduce(
      (sum, action) =>
        action.source === EWorkSource.OUT
          ? action.totalCost?.outSourceValues &&
            action.totalCost?.outSourceValues[0]
            ? sum + +action.totalCost?.outSourceValues[0]
            : sum
          : sum + +action.totalCost.values[0],
      0
    );
  };

  const calculateSubsWorkFlow = (subWorkFlows: ICalculatedWorkFlow[]) => {
    const subsTotalPrice = subWorkFlows?.reduce(
      (sum, flow) => calculateWorkFlowActionsTotalPrice(flow.actions),
      0
    );
    const subsTotalCost = subWorkFlows?.reduce(
      (sum, flow) => calculateWorkFlowActionsTotalCost(flow.actions),
      0
    );
    const subsDeliveryTime = subWorkFlows?.reduce(
      (sum, flow) => calculateWorkFlowActionsDeliveryTime(flow.actions),
      0
    );
    return {
      subsTotalPrice,
      subsTotalCost,
      subsDeliveryTime,
    };
  };
  const updateSelectedWorkFlow = (actions: IWorkFlowAction[]) => {
    const totalPrice = calculateWorkFlowActionsTotalPrice(actions);
    const totalCost = calculateWorkFlowActionsTotalCost(actions);
    const deliveryTime = calculateWorkFlowActionsDeliveryTime(actions);
    const profit = ((totalPrice - totalCost) / totalCost) * 100;

    const subWorkFlows = selectedWorkFlow?.subWorkFlows?.map((subFlow) =>
      subFlow.id !== workFlowId
        ? subFlow
        : {
            ...subFlow,
            actions: actions,
            totalPrice: {
              ...flow.totalPrice,
              values: [totalPrice.toString()],
            },
            totalCost: {
              ...flow.totalCost,
              values: [totalCost.toString()],
            },
            profit: {
              ...flow.profit,
              values: [!!profit ? profit.toString() : "0"],
            },
            totalRealProductionTime: {
              ...flow.totalRealProductionTime,
              values: [deliveryTime.toString()],
            },
          }
    );

    const { subsTotalPrice, subsTotalCost, subsDeliveryTime } =
      calculateSubsWorkFlow(subWorkFlows);

    setWorkFlows(
      workFlows.map((flow) =>
        !flow.selected
          ? flow
          : isSubWorkFlow
          ? {
              ...flow,
              subWorkFlows: subWorkFlows,
              totalPrice: {
                ...flow.totalPrice,
                values: [
                  (
                    subsTotalPrice +
                    calculateWorkFlowActionsTotalPrice(flow.actions)
                  ).toString(),
                ],
              },
              totalCost: {
                ...flow.totalCost,
                values: [
                  (
                    subsTotalCost +
                    calculateWorkFlowActionsTotalCost(flow.actions)
                  ).toString(),
                ],
              },
              totalRealProductionTime: {
                ...flow.totalRealProductionTime,
                values: [
                  (
                    subsDeliveryTime +
                    calculateWorkFlowActionsDeliveryTime(flow.actions)
                  ).toString(),
                ],
              },
            }
          : {
              ...flow,
              actions: actions,
              totalPrice: {
                ...flow.totalPrice,
                values: [(subsTotalPrice + totalPrice).toString()],
              },
              totalCost: {
                ...flow.totalCost,
                values: [(subsTotalCost + totalCost).toString()],
              },
              profit: {
                ...flow.profit,
                values: [!!profit ? profit.toString() : "0"],
              },
              totalRealProductionTime: {
                ...flow.totalRealProductionTime,
                values: [
                  (
                    subsDeliveryTime +
                    calculateWorkFlowActionsDeliveryTime(actions)
                  ).toString(),
                ],
              },
            }
      )
    );
  };

  const changeActionWorkSource = (source: EWorkSource, actionId: string) => {
    if (flow) {
      const updatedActions = flow.actions?.map((action) =>
        action.actionId !== actionId
          ? action
          : {
              ...action,
              source: source,
            }
      );

      updateSelectedWorkFlow(updatedActions);
    }
  };

  const updateActionSupplier = (supplierId: string, actionId: string) => {
    setWorkFlows(
      workFlows.map((flow) =>
        !flow.selected
          ? flow
          : {
              ...flow,
              actions: isSubWorkFlow
                ? flow.actions
                : flow.actions?.map((action) =>
                    action.actionId !== actionId
                      ? action
                      : {
                          ...action,
                          supplierId: supplierId,
                        }
                  ),
              subWorkFlows: isSubWorkFlow
                ? flow?.subWorkFlows?.map((subFlow) =>
                    subFlow.id === workFlowId
                      ? {
                          ...subFlow,
                          actions: subFlow?.actions?.map((action) =>
                            action.actionId !== actionId
                              ? action
                              : {
                                  ...action,
                                  supplierId: supplierId,
                                }
                          ),
                        }
                      : subFlow
                  )
                : flow?.subWorkFlows,
            }
      )
    );
  };

  const getActionMachinesList = (
    actionId: string,
    productType: string | null
  ) => {
    const action = actions.find(
      (action) =>
        action.actionId === actionId && productType === action.productType
    );
    if (action) {
      return action?.machineCategories?.flatMap((category) => {
        return category.machines.map((machine) => ({
          machineCategoryId: category.machineCategoryId,
          value: machine.machineId,
          label: machine.machineName,
        }));
      });
    }
    return [];
  };

  const compareArrays = (
    array1: { id: string; machineId: string }[],
    array2: { id: string; machineId: string }[]
  ): boolean => {
    return (
      array1.length === array2.length &&
      array1.every((element) =>
        array2.some(
          (otherElement) => otherElement.machineId === element.machineId
        )
      )
    );
  };

  const selectNewMachine = (machineId: string, actionId: string) => {
    if (selectedWorkFlow) {
      const workFlowMachines = selectedWorkFlow?.actions?.map((action) => ({
        id: action.actionId,
        machineId:
          action.actionId === actionId ? machineId : action.mongoDBMachineId,
      }));
      const workFlowSameMachines = workFlows.find((flow) => {
        const machines = flow.actions?.map((action) => ({
          id: action.actionId,
          machineId: action.mongoDBMachineId,
        }));
        return compareArrays(workFlowMachines, machines);
      });
      if (!!workFlowSameMachines) {
        setWorkFlows(
          workFlows.map((flow) =>
            workFlowSameMachines.id === flow.id
              ? {
                  ...flow,
                  selected: true,
                }
              : { ...flow, selected: false }
          )
        );
        return true;
      } else {
        const workFlowHasMachine = workFlows?.find((flow) => {
          return flow.actions
            ?.flatMap((action) => action.mongoDBMachineId)
            ?.includes(machineId);
        });
        if (!!workFlowHasMachine) {
          setWorkFlows(
            workFlows?.map((flow) =>
              flow.id === workFlowHasMachine.id
                ? {
                    ...flow,
                    selected: true,
                  }
                : { ...flow, selected: false }
            )
          );
          return true;
        }
      }
    }
    return false;
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    updateDeliveryTime,
    updateCost,
    updateProfit,
    updatePrice,
    changeActionWorkSource,
    updateActionSupplier,
    getActionMachinesList,
    selectNewMachine,
    open,
    anchorEl,
    handleClick,
    handleClose,
  };
};

export { useActionUpdateValues };
