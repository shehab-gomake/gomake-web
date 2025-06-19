import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IOutSourceSupplier,
  IWorkFlowAction,
} from "@/widgets/product-pricing-widget/interface";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton, Skeleton, Tooltip } from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  EditableKeyValueViewComponent,
  ParametersMapping,
  TextAreaActionsMapping,
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { InOutSourceSelect } from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import {
  EWorkSource,
  HtmlElementType,
  RuleType,
} from "@/widgets/product-pricing-widget/enums";
import { useActionUpdateValues } from "@/widgets/product-pricing-widget/components/action/use-action-update-values";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentProductItemValueState,
  outsourceSuppliersState,
  workFlowsState,
} from "@/widgets/product-pricing-widget/state";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { PrintImageComponent } from "@/widgets/product-pricing-widget/components/print-image/print-image-component";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { SettingsIcon } from "@/icons/settings";
import { SettingsMenu } from "./settings-menu";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { _renderIconLogs } from "@/utils/constants";
import { TableOutPutComponent } from "../table-output/table-output-component";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import {
  isActionEmployeeUpdatedState,
  permissionsState,
  userState,
} from "@/store";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { SortIcon } from "@/icons/sort-icon";
import { _renderDeliveryDate } from "@/utils/helpers";
import { ReloadPriceIcon } from "@/icons/reload-price";
import { formatValueWithUnit } from "@/utils/is-currency";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";

interface IActionContainerComponentProps extends IWorkFlowAction {
  delay?: number;
  workFlowId?: string;
  productType?: string | null;
  widgetType?: EWidgetProductType;
  selectedWorkFlowCalculatedIsLoaded?: boolean;
  sectionName?: string;
  isFromSetting?: boolean;
  deleteActionFromProduct?: (selectedAction: any) => void;
  updateProductAction?: (data: any) => void;
  deliveryDate?: string;
  showSaveChangesButton?: boolean;
}

interface IActionsComponentProps {
  actions: IWorkFlowAction[];
  workFlowId?: string;
  productType?: string | null;
  widgetType?: EWidgetProductType;
  selectedWorkFlowCalculatedIsLoaded?: boolean;
  sectionName?: string;
  reOderMainActions?: (data: any) => void;
  isFromSetting?: boolean;
  deleteActionFromProduct?: (selectedAction: any) => void;
  updateActionsOrderInProduct?: (actions: any) => void;
  updateProductAction?: (data: any) => void;
  customer?: any;
  renderOptions?: () => any[];
  checkWhatRenderArray?: (arg: any) => void;
  setCustomer?: any;
  isFetching?: boolean;
}

const Actions = ({
  actions,
  workFlowId,
  productType,
  widgetType,
  selectedWorkFlowCalculatedIsLoaded,
  reOderMainActions,
  isFromSetting = false,
  deleteActionFromProduct,
  updateActionsOrderInProduct,
  updateProductAction,
  customer,
  setCustomer,
  renderOptions,
  checkWhatRenderArray,
  isFetching,
}: IActionsComponentProps) => {
  const [actionsList, setActionsList] = useState(actions);

  useEffect(() => {
    setActionsList(actions);
  }, [actions]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedActions = Array.from(actionsList);
    const [movedAction] = reorderedActions.splice(result.source.index, 1);
    reorderedActions.splice(result.destination.index, 0, movedAction);
    const formattedActions = reorderedActions.map(
      (action: any, index: number) => ({
        printingActionId: action?.id,
        productType: action?.productType,
        orderIndex: index,
      })
    );
    setActionsList(reorderedActions);
    if (isFromSetting) {
      updateActionsOrderInProduct(formattedActions);
    } else {
      reOderMainActions(formattedActions);
    }
  };

  const permissions = useRecoilValue(permissionsState);

  return (
    <>
      {permissions.includes(Permissions.CUSTOMIZE_WORKFLOW) ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="actionsDroppable">
            {(provided) => (
              <Stack
                gap={"10px"}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {actionsList?.map((action, index) => (
                  <Draggable
                    key={action.id}
                    draggableId={action.id}
                    index={index}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div {...provided.dragHandleProps}>
                            <SortIcon />
                          </div>
                          <ActionContainerComponent
                            data-toure={"action"}
                            widgetType={widgetType}
                            productType={productType}
                            workFlowId={workFlowId}
                            selectedWorkFlowCalculatedIsLoaded={
                              selectedWorkFlowCalculatedIsLoaded
                            }
                            delay={index * 800}
                            isFromSetting={isFromSetting}
                            deleteActionFromProduct={deleteActionFromProduct}
                            updateProductAction={updateProductAction}
                            customer={customer}
                            setCustomer={setCustomer}
                            renderOptions={renderOptions}
                            checkWhatRenderArray={checkWhatRenderArray}
                            isFetching={isFetching}
                            {...action}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <>
          {actionsList?.map((action, index) => (
            <div style={{ marginBottom: "16px" }}>
              <ActionContainerComponent
                data-toure={"action"}
                widgetType={widgetType}
                productType={productType}
                workFlowId={workFlowId}
                selectedWorkFlowCalculatedIsLoaded={
                  selectedWorkFlowCalculatedIsLoaded
                }
                delay={index * 800}
                isFromSetting={isFromSetting}
                deleteActionFromProduct={deleteActionFromProduct}
                updateProductAction={updateProductAction}
                customer={customer}
                setCustomer={setCustomer}
                renderOptions={renderOptions}
                checkWhatRenderArray={checkWhatRenderArray}
                isFetching={isFetching}
                {...action}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};

const ActionContainerComponent = ({
  id,
  actionId,
  actionName,
  outputs,
  delay = 0,
  machineName,
  profit,
  totalPrice,
  totalProductionTime,
  deliveryDate,
  totalCost,
  source,
  supplierId,
  productType,
  actionIndex,
  categoryId,
  isCalculated,
  actionException,
  materials,
  employeeId,
  employeeName,
  isNeedEmployee,
  isNeedMachine,
  isNeedMaterial,
  widgetType,
  totalCostValue,
  totalPriceValue,
  profitValue,
  isNeedFolds,
  foldOptionValueId,
  selectedWorkFlowCalculatedIsLoaded,
  sectionName,
  isFromSetting,
  deleteActionFromProduct,
  updateProductAction,
  relatedActions,
  showSaveChangesButton,
  customer,
  setCustomer,
  renderOptions,
  checkWhatRenderArray,
  isFetching,
}: IActionContainerComponentProps) => {
  source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const [chooseMaterial, setChooseMaterial] = useState<boolean>(false);
  const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);
  const [chooseFold, setChooseFold] = useState<boolean>(false);
  const [selectedfold, setSelectedFold] = useState<any>();
  const [changeWorkFlowOutputDTO, setChangeWorkFlowOutputDTO] = useState<any>(
    []
  );

  const currentProductItemValue = useRecoilValue(currentProductItemValueState);
  const { t } = useTranslation();
  const {
    selectNewMachine,
    selectNewMaterials,
    selectNewFold,
    anchorEl,
    open,
    handleClick,
    handleClose,
    updateActionData,
    openModalMachine,
    openModalMaterial,
    onClickCloseModalMachine,
    onClickCloseModalMaterial,
    setAttributesData,
    updateWorkFlowForMachine,
    updateWorkFlowForMaterials,
    updateWorkFlowForEmployees,
    onClickGetEmployeeForAction,
    onClickGetMachineForAction,
    onClickGetMaterialsForAction,
    changeWorkFlowOutputDTOApi,
    employeesList,
    machinesList,
    materialsList,
    foldOptions,
  } = useActionUpdateValues();

  const [suppliersState, setOutsourceSuppliers] = useRecoilState(
    outsourceSuppliersState
  );

  const handleAddSupplier = (newSupplier) => {
    const supplierFormatted: IOutSourceSupplier = {
      supplierId: newSupplier.id,
      supplierName: newSupplier.name,
    };

    setOutsourceSuppliers((prev) => [...prev, supplierFormatted]);

    handleSupplierChange(null, {
      id: supplierFormatted.supplierId,
      value: supplierFormatted.supplierId,
      label: supplierFormatted.supplierName,
      text: supplierFormatted.supplierName,
    });
  };

  const [hideRelatedActions, setHideRelatedActions] = useState<boolean>(false);
  const [isActionEmployeeUpdated, setIsActionEmployeeUpdated] = useRecoilState(
    isActionEmployeeUpdatedState
  );

  const suppliers = useMemo(() => {
    return suppliersState?.map((s) => ({
      value: s.supplierId,
      label: s.supplierName,
    }));
  }, [suppliersState]);

  const { classes } = useStyle();
  const { secondColor } = useGomakeTheme();
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;
  const inputsParameters = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.PARAMETER &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const outputsParameters = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const imageOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.IMAGE
  );

  const textAreaOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT_AREA
  );

  const tableOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );
  const handleDeliveryTimeUpdate = (newValue: string) => {
    if (newValue === totalProductionTime?.values[0]?.toString()) {
      return; // Exit early if values match
    }
    if (isFromSetting) {
      updateProductAction({
        actionId,
        value: newValue,
        fieldName: "totalProductionTime",
      });
    } else {
      updateActionData(
        id,
        +newValue,
        "totalProductionTime",
        productType
      ).then();
    }
  };
  const handleDeliveryTimeUpdateRelatedActions = (data, newValue: string) => {
    updateActionData(
      data?.id,
      +newValue,
      "totalProductionTime",
      data?.productType || productType
    ).then();
  };
  const handleCostUpdateRelatedActions = (data, newValue: string) => {
    updateActionData(
      data?.id,
      +newValue,
      "totalCost",
      data?.productType || productType
    ).then();
  };
  const handleProfitUpdateRelatedActions = (data, newValue: string) => {
    updateActionData(
      data?.id,
      +newValue,
      "profit",
      data?.productType || productType
    ).then();
  };
  const handleUpdatePriceRelatedActions = (data, newValue: string) => {
    updateActionData(
      data?.id,
      +newValue,
      "totalPrice",
      data?.productType || productType
    ).then();
  };

  const handleCostUpdate = (newCost: string) => {
    if (newCost === totalCost?.values[0]?.toString()) {
      return; // Exit early if values match
    }
    if (isFromSetting) {
      updateProductAction({ actionId, value: newCost, fieldName: "totalcost" });
    } else {
      updateActionData(id, +newCost, "totalCost", productType).then();
    }
  };

  const handleProfitUpdate = (profitNew: string) => {
    if (profitNew === profit?.values[0]?.toString()) {
      return; // Exit early if values match
    }
    updateActionData(id, +profitNew, "profit", productType).then();
  };

  const handleUpdatePrice = (price: string) => {
    if (price === totalPrice?.values[0]?.toString()) {
      return; // Exit early if values match
    }
    updateActionData(id, +price, "totalPrice", productType).then();
  };

  const handleSourceChange = (source: EWorkSource) => {
    if (isFromSetting) {
      updateProductAction({ actionId, value: source, fieldName: "source" });
    } else {
      updateActionData(id, source, "source", productType).then();
    }
  };
  const handleSourceChangeRelatedActions = (data, source: EWorkSource) => {
    updateActionData(
      data?.id,
      source,
      "source",
      data?.productType || productType
    ).then();
  };

  const [workFlows, setWorkFlows] = useRecoilState(workFlowsState);

  const handleSupplierChange = (e, value) => {
    debugger;
    const aaa = suppliers;

    setIsUpdateBusinessName(null);
    if (isFromSetting) {
      updateProductAction({
        actionId,
        value: value?.id,
        fieldName: "supplierid",
      });
    } else {
      const actionSelected = workFlows[0]?.actions?.find(
        (action) => action.id === id
      );
      if (actionSelected) {
        // Create a new object with the updated supplierId
        const updatedAction = { ...actionSelected, supplierId: value?.id };

        setWorkFlows((prevWorkFlows) => {
          // Create a deep copy of the workFlows array
          const updatedWorkFlows = prevWorkFlows.map((workflow, index) => {
            if (index === 0) {
              // Create a new actions array with the updated action
              const updatedActions = workflow.actions.map((action) =>
                action.id === id ? updatedAction : action
              );
              // Return a new workflow object with the updated actions
              return { ...workflow, actions: updatedActions };
            }
          });
          return updatedWorkFlows;
        });
      }

      updateActionData(id, value?.id ?? null, "supplierId", productType).then();
    }
  };

  const calculateProfitInMoney = () => {
    const totalPriceValues = totalPriceValue ? totalPriceValue : 0;
    const totalCostValues = totalCostValue ? totalCostValue : 0;
    return (totalPriceValues - totalCostValues).toFixed(2);
  };

  const calculateOutSourceProfitInMoney = () => {
    const totalPriceValues = totalPriceValue ? totalPriceValue : 0;
    const totalCostValues = totalCostValue ? totalCostValue : 0;
    return (totalPriceValues - totalCostValues).toFixed(2);
  };

  const calculateProfitInRelaredActionsMoney = (action) => {
    const totalPriceValues = action?.totalPrice
      ? action?.totalPrice?.values[0]
      : 0;
    const totalCostValues = action?.totalCost
      ? action?.totalCost?.values[0]
      : 0;
    return (totalPriceValues - totalCostValues).toFixed(2);
  };

  useEffect(() => {
    if (foldOptionValueId) {
      const selectedFoldOptionName = foldOptions?.find(
        (option) => option.id == foldOptionValueId
      );
      if (selectedFoldOptionName) {
        setSelectedFold(selectedFoldOptionName);
      }
    }
  }, [foldOptionValueId, foldOptions]);
  const permissions = useRecoilValue(permissionsState);

  const mappedSuppliers = renderOptions
    ? renderOptions()?.map((supplier) => ({
        text: supplier?.name,
        id: supplier?.id,
        ...supplier,
      }))
    : [];

  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<any>(null);

  const onBlurBusinessName = async () => {
    setIsUpdateBusinessName(null);
  };

  return (
    <>
      {selectedWorkFlowCalculatedIsLoaded ? (
        <Skeleton variant="rectangular" width={"100%"} height={"100px"} />
      ) : (
        <>
          <Fade
            in={true}
            timeout={delay}
            style={{ width: "100%", position: "relative" }}
          >
            <Stack
              onClick={() => setIsOpen(!isOpen && !isFromSetting)}
              style={{
                ...classes.actionContainer,
                border: isOpen ? classes.actionContainerBorder : "unset",
              }}
            >
              <Stack
                padding={"10px 0"}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Stack
                  direction={"row"}
                  gap={"16px"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                >
                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    <span>{actionName}</span>
                    {source === EWorkSource.OUT ? (
                      <Stack
                        gap={"10px"}
                        direction={"row"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Divider
                          orientation={"vertical"}
                          flexItem
                          color={"#000"}
                        />
                        <ClientAutocomplete
                          uiType="updated"
                          key={customer?.id}
                          clientType={CLIENT_TYPE.SUPPLIER}
                          disableClearable={true}
                          options={mappedSuppliers ? mappedSuppliers : []}
                          getOptionLabel={(item) => item.text}
                          defaultFiltering={false}
                          onChangeTextField={checkWhatRenderArray}
                          value={
                            suppliers?.find((sup) => sup.value === supplierId)
                              ?.label ?? t("sales.quote.chooseSupplier")
                          }
                          loading={isFetching}
                          onChange={handleSupplierChange}
                          isUpdate={isUpdateBusinessName}
                          setIsUpdate={setIsUpdateBusinessName}
                          onBlur={onBlurBusinessName}
                          onAddCustomer={handleAddSupplier}
                        />
                      </Stack>
                    ) : (
                      isNeedMachine && (
                        <>
                          <Divider
                            orientation={"vertical"}
                            flexItem
                            color={"#000"}
                          />
                          {!chooseMachine ? (
                            <Button
                              onClick={(e) => {
                                if (
                                  permissions.includes(
                                    Permissions.CAN_UPDATE_MACHINES_IN_WORK_FLOW_ACTION
                                  )
                                ) {
                                  e.stopPropagation();
                                  setChooseMachine(true);
                                  onClickGetMachineForAction(actionId);
                                }
                              }}
                              variant={"text"}
                              style={classes.sectionTitle}
                            >
                              {machineName != null ? (
                                <>
                                  {machineName?.length > 20
                                    ? machineName.slice(0, 20) + "..."
                                    : machineName}
                                </>
                              ) : (
                                <>
                                  {t("materials.sheetPaper.SelecteNewMachine")}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Stack
                              direction={"row"}
                              gap={"5px"}
                              alignItems={"center"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GoMakeAutoComplate
                                disableClearable={true}
                                onChange={(e, v) => {
                                  if (isFromSetting) {
                                    updateProductAction({
                                      actionId,
                                      value: v?.value,
                                      fieldName: "machineid",
                                      machineName: v?.label,
                                    });
                                  } else {
                                    selectNewMachine(
                                      v?.value,
                                      actionId,
                                      productType,
                                      actionIndex
                                    );
                                    setAttributesData({
                                      actionId,
                                      productType,
                                      actionIndex,
                                      machineName: v?.label,
                                      machineId: v?.value,
                                      printingActionId: id,
                                    });
                                  }
                                  setChooseMachine(false);
                                }}
                                style={{ width: "200px" }}
                                options={machinesList}
                                placeholder={t(
                                  "materials.sheetPaper.chooseMachine"
                                )}
                                value={machineName}
                              />
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChooseMachine(false);
                                }}
                              >
                                <ClearRoundedIcon />
                              </IconButton>
                            </Stack>
                          )}
                        </>
                      )
                    )}
                  </Stack>

                  {source != EWorkSource.OUT && (
                    <Divider orientation={"vertical"} flexItem />
                  )}
                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    {isNeedEmployee && source != EWorkSource.OUT && (
                      <>
                        {!chooseEmployee ? (
                          <Button
                            onClick={(e) => {
                              if (
                                permissions.includes(
                                  Permissions.CAN_UPDATE_EMPLOYEES_IN_WORK_FLOW_ACTION
                                )
                              ) {
                                e.stopPropagation();
                                setChooseEmployee(true);
                                onClickGetEmployeeForAction(actionId);
                              }
                            }}
                            variant={"text"}
                            style={classes.sectionTitle}
                          >
                            {employeeName ? (
                              employeeName
                            ) : (
                              <>{t("materials.sheetPaper.selectNewEmployee")}</>
                            )}
                          </Button>
                        ) : (
                          <Stack
                            direction={"row"}
                            gap={"5px"}
                            alignItems={"center"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GoMakeAutoComplate
                              disableClearable={true}
                              onChange={(e, v) => {
                                if (isFromSetting) {
                                  updateProductAction({
                                    actionId,
                                    emplyeeName: v?.label,
                                    value: v?.value,
                                    fieldName: "employeeid",
                                  });
                                  setChooseEmployee(false);
                                } else {
                                  if (widgetType === EWidgetProductType.EDIT) {
                                    setIsActionEmployeeUpdated(true);
                                  }
                                  updateWorkFlowForEmployees(
                                    actionId,
                                    productType,
                                    actionIndex,
                                    v?.label,
                                    v?.value,
                                    id
                                  );
                                  setChooseEmployee(false);
                                }
                              }}
                              style={{ width: "200px" }}
                              options={employeesList}
                              placeholder={t(
                                "materials.sheetPaper.chooseEmployee"
                              )}
                              value={employeeName}
                            />
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseEmployee(false);
                              }}
                            >
                              <ClearRoundedIcon />
                            </IconButton>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                  {isNeedEmployee && source != EWorkSource.OUT && (
                    <Divider orientation={"vertical"} flexItem />
                  )}

                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    {isNeedMaterial && source != EWorkSource.OUT && (
                      <>
                        {!chooseMaterial ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChooseMaterial(true);
                              onClickGetMaterialsForAction(materials[0]);
                            }}
                            variant={"text"}
                            style={classes.sectionTitle}
                          >
                            {materials[0]?.materialCategories?.length > 0 ? (
                              <>
                                {materials[0]?.materialCategories[0]?.name
                                  ?.length > 20
                                  ? materials[0]?.materialCategories[0]?.name.slice(
                                      0,
                                      20
                                    ) + "..."
                                  : materials[0]?.materialCategories[0]?.name}
                              </>
                            ) : (
                              <>{t("materials.sheetPaper.selectNewMaterial")}</>
                            )}
                          </Button>
                        ) : (
                          <Stack
                            direction={"row"}
                            gap={"5px"}
                            alignItems={"center"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GoMakeAutoComplate
                              disableClearable={true}
                              onChange={(e, v) => {
                                selectNewMaterials(
                                  v?.value,
                                  actionId,
                                  productType,
                                  actionIndex
                                );
                                setAttributesData({
                                  actionId,
                                  productType,
                                  actionIndex,
                                  printHouseMaterialSizeName: v?.label,
                                  printHouseMaterialSizeId: v?.value,
                                  printingActionId: id,
                                });
                                setChooseMaterial(false);
                              }}
                              style={{ width: "200px" }}
                              options={materialsList}
                              placeholder={t(
                                "materials.sheetPaper.chooseMaterial"
                              )}
                              value={materials[0]?.materialCategories[0]?.name}
                            />
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseMaterial(false);
                              }}
                            >
                              <ClearRoundedIcon />
                            </IconButton>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                  {isNeedMaterial && source != EWorkSource.OUT && (
                    <Divider orientation={"vertical"} flexItem />
                  )}

                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    {isNeedFolds && (
                      <>
                        {!chooseFold ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChooseFold(true);
                            }}
                            variant={"text"}
                            style={classes.sectionTitle}
                          >
                            {foldOptionValueId ? (
                              selectedfold?.name
                            ) : (
                              <>{t("materials.sheetPaper.selectNewFolds")}</>
                            )}
                          </Button>
                        ) : (
                          <Stack
                            direction={"row"}
                            gap={"5px"}
                            alignItems={"center"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GoMakeAutoComplate
                              disableClearable={true}
                              onChange={(e, v) => {
                                selectNewFold(
                                  v?.id,
                                  actionId,
                                  productType,
                                  actionIndex
                                );
                                setAttributesData({
                                  actionId,
                                  productType,
                                  actionIndex,
                                  foldOptionValueId: v?.id,
                                  printingActionId: id,
                                });
                                setChooseFold(false);
                              }}
                              style={{ width: "200px" }}
                              options={foldOptions}
                              placeholder={t(
                                "materials.sheetPaper.chooseFoldOption"
                              )}
                              getOptionLabel={(option) => option.name}
                              value={selectedfold}
                            />
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseFold(false);
                              }}
                            >
                              <ClearRoundedIcon />
                            </IconButton>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                  {isNeedFolds && <Divider orientation={"vertical"} flexItem />}

                  <EditableKeyValueViewComponent
                    onUpdate={handleDeliveryTimeUpdate}
                    {...totalProductionTime}
                    source={source}
                    name={t("home.headers.deliveryTime")}
                  />
                  {deliveryDate && (
                    <>
                      <Divider orientation={"vertical"} flexItem />
                      <Stack
                        direction={"row"}
                        gap={"10px"}
                        alignItems={"center"}
                      >
                        <span style={classes.detailTitle}>
                          {t("sales.quote.deliveryDate")}
                        </span>
                        <span style={classes.detailValue}>
                          {_renderDeliveryDate(deliveryDate)}
                        </span>
                      </Stack>
                    </>
                  )}
                  {source === EWorkSource.OUT && (
                    <>
                      <Divider
                        orientation={"vertical"}
                        style={{ height: "50%", margin: "auto 0" }}
                        flexItem
                      />
                      <EditableKeyValueViewComponent
                        onUpdate={handleCostUpdate}
                        {...totalCost}
                        values={totalCostValue}
                        source={source}
                        name={t("machineAttributes.cost")}
                      />
                      <Divider
                        orientation={"vertical"}
                        style={{ height: "50%", margin: "auto 0" }}
                        flexItem
                      />
                      {!isFromSetting && (
                        <Stack
                          direction={"row"}
                          gap={"3px"}
                          alignItems={"center"}
                        >
                          <EditableKeyValueViewComponent
                            onUpdate={handleProfitUpdate}
                            {...profit}
                            values={profitValue}
                            source={source}
                            name={t(
                              "products.profits.pricingListWidget.profit"
                            )}
                          />
                          <span>
                            {`(${
                              source === EWorkSource.OUT
                                ? formatValueWithUnit(
                                    calculateOutSourceProfitInMoney(),
                                    totalPrice?.defaultUnit
                                  )
                                : formatValueWithUnit(
                                    calculateProfitInMoney(),
                                    totalPrice?.defaultUnit
                                  )
                            })`}
                          </span>
                        </Stack>
                      )}
                      {!isFromSetting && source !== EWorkSource.OUT && (
                        <Divider
                          orientation={"vertical"}
                          style={{ height: "50%", margin: "auto 0" }}
                          flexItem
                        />
                      )}

                      {!isFromSetting && source !== EWorkSource.OUT && (
                        <EditableKeyValueViewComponent
                          onUpdate={handleUpdatePrice}
                          {...totalPrice}
                          values={totalPriceValue}
                          source={source}
                          valueColor={secondColor(500)}
                          name={t("sales.quote.price")}
                        />
                      )}
                    </>
                  )}
                  <PermissionCheck
                    userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}
                  >
                    {source !== EWorkSource.OUT && (
                      <>
                        <Divider
                          orientation={"vertical"}
                          style={{ height: "50%", margin: "auto 0" }}
                          flexItem
                        />
                        <EditableKeyValueViewComponent
                          onUpdate={handleCostUpdate}
                          {...totalCost}
                          values={totalCostValue}
                          source={source}
                          name={t("machineAttributes.cost")}
                        />
                        <Divider
                          orientation={"vertical"}
                          style={{ height: "50%", margin: "auto 0" }}
                          flexItem
                        />
                        {!isFromSetting && (
                          <>
                            <Stack
                              direction={"row"}
                              gap={"3px"}
                              alignItems={"center"}
                            >
                              <EditableKeyValueViewComponent
                                onUpdate={handleProfitUpdate}
                                {...profit}
                                values={profitValue}
                                source={source}
                                name={t(
                                  "products.profits.pricingListWidget.profit"
                                )}
                              />
                              <span>
                                {`(${formatValueWithUnit(
                                  calculateProfitInMoney(),
                                  totalPrice?.defaultUnit
                                )})`}
                              </span>
                            </Stack>
                          </>
                        )}
                      </>
                    )}
                  </PermissionCheck>
                  <Divider
                    orientation={"vertical"}
                    style={{ height: "50%", margin: "auto 0" }}
                    flexItem
                  />

                  <EditableKeyValueViewComponent
                    onUpdate={handleUpdatePrice}
                    {...totalPrice}
                    values={totalPriceValue}
                    source={source}
                    valueColor={secondColor(500)}
                    name={t("sales.quote.price")}
                  />
                  {!isFromSetting && (
                    <Divider orientation={"vertical"} flexItem />
                  )}
                  <div onClick={(e) => e.stopPropagation()}>
                    <InOutSourceSelect
                      value={source}
                      onChange={handleSourceChange}
                    />
                  </div>
                </Stack>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {actionException && (
                    <Tooltip
                      title={t(
                        "CalculationExceptions." + actionException?.exceptionKey
                      )}
                    >
                      <IconButton>
                        {_renderIconLogs(
                          actionException?.exceptionType,
                          24,
                          24
                        )}
                      </IconButton>
                    </Tooltip>
                  )}

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setHideRelatedActions(false);
                      handleClick(e);
                    }}
                  >
                    <SettingsIcon
                      stroke={"rgba(237, 2, 140, 1)"}
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  {!isFromSetting && (
                    <IconButton
                      onClick={() => setIsOpen(!isOpen)}
                      style={classes.toggleActionButton}
                    >
                      {isOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  )}
                </div>
              </Stack>
              <Divider />
              {relatedActions?.length > 0 && (
                <div
                  style={{
                    padding: "10px 0",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {relatedActions.map((action) => (
                    <Stack
                      style={classes.sectionTitle}
                      direction={"row"}
                      alignItems={"center"}
                      gap={"16px"}
                      flexWrap={"wrap"}
                    >
                      <span>{action.name}</span>

                      {isNeedFolds && <span style={{ width: 118 }} />}
                      {isNeedMaterial && <span style={{ width: 118 }} />}
                      {isNeedEmployee && <span style={{ width: 118 }} />}
                      {isNeedMachine && <span style={{ width: 118 }} />}
                      <Divider
                        orientation={"vertical"}
                        flexItem
                        style={{ marginRight: 16 }}
                      />
                      <EditableKeyValueViewComponent
                        onUpdate={(v) =>
                          handleDeliveryTimeUpdateRelatedActions(action, v)
                        }
                        {...action?.totalProductionTime}
                        source={action?.source}
                        name={t("home.headers.deliveryTime")}
                      />
                      <Divider
                        orientation={"vertical"}
                        style={{ height: "20px" }}
                      />
                      <EditableKeyValueViewComponent
                        onUpdate={(v) =>
                          handleCostUpdateRelatedActions(action, v)
                        }
                        {...action?.totalCost}
                        source={action?.source}
                        name={t("machineAttributes.cost")}
                      />
                      <Divider
                        orientation={"vertical"}
                        style={{ height: "20px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <EditableKeyValueViewComponent
                          onUpdate={(v) =>
                            handleProfitUpdateRelatedActions(action, v)
                          }
                          {...action?.profit}
                          source={action?.source}
                          name={t("products.profits.pricingListWidget.profit")}
                        />
                        <span>
                          {`(${formatValueWithUnit(
                            calculateProfitInRelaredActionsMoney(action),
                            action?.totalPrice?.defaultUnit
                          )})`}
                        </span>
                      </div>
                      <Divider
                        orientation={"vertical"}
                        style={{ height: "20px" }}
                      />
                      <EditableKeyValueViewComponent
                        onUpdate={(v) =>
                          handleUpdatePriceRelatedActions(action, v)
                        }
                        {...action?.totalPrice}
                        source={action?.source}
                        name={t("sales.quote.price")}
                        valueColor={secondColor(500)}
                      />
                      <Divider orientation={"vertical"} flexItem />
                      <InOutSourceSelect
                        value={action?.source}
                        onChange={(v) =>
                          handleSourceChangeRelatedActions(action, v)
                        }
                      />
                    </Stack>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div onClick={(e) => e.stopPropagation()}></div>
                    <div>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setHideRelatedActions(true);
                          handleClick(e);
                        }}
                      >
                        <SettingsIcon
                          stroke={"rgba(237, 2, 140, 1)"}
                          width={24}
                          height={24}
                        />
                      </IconButton>
                    </div>
                    <div style={{ width: 40 }} />
                  </div>
                </div>
              )}

              <Collapse
                in={isOpen}
                collapsedSize={0}
                orientation={"vertical"}
                onClick={(e) => e.stopPropagation()}
              >
                {inputsParameters?.length > 0 && (
                  <>
                    <Divider />
                    <Stack
                      padding={"10px 0"}
                      direction={"row"}
                      gap={"16px"}
                      flexWrap={"wrap"}
                    >
                      <ParametersMapping parameters={inputsParameters} />
                    </Stack>
                  </>
                )}
                {(outputsParameters?.length > 0 ||
                  textAreaOutputs?.length > 0) &&
                  source === EWorkSource.INTERNAL && (
                    <>
                      <Divider />
                      <Stack
                        padding={"10px 0"}
                        direction={"row"}
                        gap={"16px"}
                        flexWrap={"wrap"}
                        position={"relative"}
                      >
                        <ParametersMapping
                          source={source}
                          parameters={outputsParameters}
                          changeWorkFlowOutputDTO={changeWorkFlowOutputDTO}
                          setChangeWorkFlowOutputDTO={
                            setChangeWorkFlowOutputDTO
                          }
                        />
                        {imageOutputs.map((parameter) => (
                          <PrintImageComponent {...parameter} />
                        ))}
                        <Divider orientation={"vertical"} flexItem />
                        <TextAreaActionsMapping
                          parameters={textAreaOutputs}
                          actionId={id}
                          currentProductItemValue={currentProductItemValue}
                          productType={productType}
                        />
                        {tableOutputs?.map((parameter) => (
                          <TableOutPutComponent {...parameter} />
                        ))}
                        {showSaveChangesButton &&
                          changeWorkFlowOutputDTO?.length > 0 && (
                            <GomakePrimaryButton
                              leftIcon={<ReloadPriceIcon color={"#FFF"} />}
                              onClick={() => {
                                changeWorkFlowOutputDTOApi(
                                  actionId,
                                  productType,
                                  actionIndex,
                                  id,
                                  changeWorkFlowOutputDTO
                                );
                              }}
                              style={{
                                width: "fit-content",
                                height: "40px",
                                marginBottom: "10px",
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(237, 2, 140, 1)",
                              }}
                            >
                              {t("pricingWidget.saveAndReCalculate")}
                            </GomakePrimaryButton>
                          )}
                      </Stack>
                    </>
                  )}
              </Collapse>
              <SettingsMenu
                handleClose={handleClose}
                open={open}
                anchorEl={anchorEl}
                actionId={actionId}
                actionName={actionName}
                currentProductItemValue={currentProductItemValue}
                machineName={machineName}
                categoryId={categoryId}
                id={id}
                productType={productType}
                sectionName={sectionName}
                deleteActionFromProduct={deleteActionFromProduct}
                isFromSetting={isFromSetting}
                hideRelatedActions={hideRelatedActions}
              />
            </Stack>
          </Fade>
        </>
      )}
    </>
  );
};

const ActionComponent = ({
  actionName,
  machineName,
  profit,
  totalPrice,
  totalProductionTime,
  totalCost,
  source,
  supplierId,
}: IWorkFlowAction) => {
  source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();
  const suppliers = useRecoilValue(outsourceSuppliersState);

  const parameters = [
    {
      ...totalProductionTime,
      key: "totalRealProductionTime",
    },
    {
      ...totalCost,
      key: "totalCost",
    },
    {
      ...profit,
      key: "profit",
    },
    {
      ...totalPrice,
      key: "totalPrice",
      valueColor: secondColor(500),
    },
  ];
  const getSupplierId = useCallback(() => {
    if (supplierId && suppliers?.length > 0) {
      const supplier = suppliers?.find((sup) => sup.supplierId === supplierId);
      return !!supplier ? supplier.supplierName : "";
    }
    return "";
  }, [supplierId, suppliers]);
  return (
    <Stack style={{ ...classes.actionContainer, backgroundColor: "#D0D5DD" }}>
      <Stack
        padding={"10px 0"}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
          <Stack
            style={classes.sectionTitle}
            direction={"row"}
            alignItems={"center"}
            gap={"10px"}
          >
            <span>{actionName}</span>
            {source === EWorkSource.OUT ? (
              <>
                <Divider orientation={"vertical"} flexItem color={"#000"} />
                <span>{getSupplierId()}</span>
              </>
            ) : (
              machineName && (
                <>
                  <Divider orientation={"vertical"} flexItem color={"#000"} />
                  <span>{machineName}</span>
                </>
              )
            )}
          </Stack>
          <Divider orientation={"vertical"} flexItem />
          <ParametersMapping
            source={source}
            parameters={parameters}
            isWorkFlows={true}
          />
          <Divider orientation={"vertical"} flexItem />
          <span style={classes.sourceLabel}>
            {source === EWorkSource.OUT
              ? t("pricingWidget.outSource")
              : t("pricingWidget.inSource")}
          </span>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { ActionContainerComponent, Actions, ActionComponent };
