import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useCallback, useMemo, useState } from "react";
import { IWorkFlowAction } from "@/widgets/product-pricing-widget/interface";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton, Tooltip } from "@mui/material";

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
import { useRecoilValue } from "recoil";
import {
  currentProductItemValueState,
  outsourceSuppliersState,
} from "@/widgets/product-pricing-widget/state";
import { GoMakeAutoComplate, GoMakeDeleteModal, GoMakeModal } from "@/components";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { PrintImageComponent } from "@/widgets/product-pricing-widget/components/print-image/print-image-component";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { SettingsIcon } from "@/icons/settings";
import { SettingsMenu } from "./settings-menu";
import { PlusIcon, WarningIcon } from "@/icons";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { NotesForActionModal } from "./notes-for-action-modal";
interface IActionContainerComponentProps extends IWorkFlowAction {
  delay?: number;
  workFlowId?: string;
  productType: string | null;

}

interface IActionsComponentProps {
  actions: IWorkFlowAction[];
  workFlowId?: string;
  productType: string | null;
}

const Actions = ({
  actions,
  workFlowId,
  productType,
}: IActionsComponentProps) => {
  console.log("actions", actions)
  return (
    <Stack gap={"10px"}>
      {actions?.map((action, index) => {
        if (!action.isCalculated && action.profit === null) {
          // Create a new object with updated profit property
          const updatedAction = {
            ...action,
            profit: {
              id: '00000000-0000-0000-0000-000000000000',
              name: 'Profit',
              values: ['----'],
              outSourceValues: ['0'],
              index: null,
              rectangles: null,
              materialWidth: 0,
              materialLength: 0,
              unitType: 6,
              defaultUnit: '%',
              displayInOutputId: null,
              propertyType: 0,
              htmlElementType: 1,
              isEditable: true
            },
            totalCost: {
              "id": "00000000-0000-0000-0000-000000000000",
              "name": "Cost",
              "values": ["----"],
              "outSourceValues": null,
              "index": null,
              "rectangles": null,
              "materialWidth": 0,
              "materialLength": 0,
              "unitType": 2,
              "defaultUnit": "₪",
              "displayInOutputId": null,
              "propertyType": 0,
              "htmlElementType": 1,
              "isEditable": false
            },
            totalPrice: {
              "id": "00000000-0000-0000-0000-000000000000",
              "name": "Price",
              "values": ["----"],
              "outSourceValues": [
                "0"
              ],
              "index": null,
              "rectangles": null,
              "materialWidth": 0,
              "materialLength": 0,
              "unitType": 2,
              "defaultUnit": "₪",
              "displayInOutputId": null,
              "propertyType": 0,
              "htmlElementType": 1,
              "isEditable": true
            },
            totalProductionTime: {
              "id": "00000000-0000-0000-0000-000000000000",
              "name": "Delivery Time",
              "values": ["----"],
              "outSourceValues": null,
              "index": null,
              "rectangles": null,
              "materialWidth": 0,
              "materialLength": 0,
              "unitType": 5,
              "defaultUnit": "min",
              "displayInOutputId": null,
              "propertyType": 0,
              "htmlElementType": 1,
              "isEditable": false
            }
          };
          return (
            <ActionContainerComponent
              key={action.id}
              data-toure={'action'}
              productType={productType}
              workFlowId={workFlowId}
              delay={index * 800}
              {...updatedAction}
            />
          );
        } else {
          return (
            <ActionContainerComponent
              key={action.id}
              data-toure={'action'}
              productType={productType}
              workFlowId={workFlowId}
              delay={index * 800}
              {...action}
            />

          );
        }
      })}
    </Stack>
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
}: IActionContainerComponentProps) => {
  source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const [chooseMaterial, setChooseMaterial] = useState<boolean>(false);
  const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);

  const currentProductItemValue = useRecoilValue(currentProductItemValueState);
  const { t } = useTranslation();
  const {
    getActionMachinesList,
    getActionMaterialsList,
    getActionEmloyeeList,
    selectNewMachine,
    selectNewMaterials,
    selectNewEmployee,
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
    employeesList,
    machinesList,
    materialsList
  } = useActionUpdateValues();
  const suppliersState = useRecoilValue(outsourceSuppliersState);
  const suppliers = useMemo(() => {
    return suppliersState?.map((s) => ({
      value: s.supplierId,
      label: s.supplierName,
    }));
  }, [suppliersState]);
  const { classes } = useStyle();
  const { secondColor } = useGomakeTheme();
  const inputsParameters = outputs?.filter(
    (parameter) =>
      parameter.propertyType === RuleType.PARAMETER &&
      parameter.htmlElementType === HtmlElementType.TEXT
  );
  const outputsParameters = outputs?.filter(
    (parameter) =>
      parameter.propertyType === RuleType.OUTPUT &&
      parameter.htmlElementType === HtmlElementType.TEXT
  );
  const imageOutputs = outputs?.filter(
    (parameter) =>
      parameter.propertyType === RuleType.OUTPUT &&
      parameter.htmlElementType === HtmlElementType.IMAGE
  );

  const textAreaOutputs = outputs?.filter(
    (parameter) =>
      parameter.propertyType === RuleType.OUTPUT &&
      parameter.htmlElementType === HtmlElementType.TEXT_AREA
  );
  const handleDeliveryTimeUpdate = (newValue: string) => {
    updateActionData(
      id,
      +newValue,
      "totalProductionTime",
      productType
    ).then();
  };
  const handleCostUpdate = (newCost: string) => {
    updateActionData(id, +newCost, "totalCost", productType).then();
  };

  const handleProfitUpdate = (profit: string) => {
    updateActionData(id, +profit, "profit", productType).then();
  };

  const handleUpdatePrice = (price: string) => {
    updateActionData(id, +price, "totalPrice", productType).then();
  };

  const handleSourceChange = (source: EWorkSource) => {
    updateActionData(id, source, "source", productType).then();
  };
  const handleSupplierChange = (e, value) => {
    updateActionData(id, value?.value, "supplierId", productType).then();
  };
  const calculateProfitInMoney = () => {
    const totalPriceValue = totalPrice && totalPrice.values && totalPrice.values.length > 0 ? +totalPrice.values[0] : 0;
    const totalCostValue = totalCost && totalCost.values && totalCost.values.length > 0 ? +totalCost.values[0] : 0;
    return (totalPriceValue - totalCostValue).toFixed(2);
  }
  const calculateOutSourceProfitInMoney = () => {
    const totalPriceValue = totalPrice && totalPrice.outSourceValues && totalPrice.outSourceValues.length > 0 ? +totalPrice.outSourceValues[0] : 0;
    const totalCostValue = totalCost && totalCost.outSourceValues && totalCost.outSourceValues.length > 0 ? +totalCost.outSourceValues[0] : 0;
    return (totalPriceValue - totalCostValue).toFixed(2);
  }
  const getSupplierId = useCallback(() => {
    if (supplierId) {
      const supplier = suppliers?.find((sup) => sup.value === supplierId);
      return !!supplier ? supplier.label : "";
    }
    return "";
  }, [supplierId, suppliers]);





  return (
    <Fade
      in={true}
      timeout={delay}
      style={{ width: "100%", position: "relative" }}
    >
      <Stack
        onClick={() => setIsOpen(!isOpen)}
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
                  <Divider orientation={"vertical"} flexItem color={"#000"} />
                  <GoMakeAutoComplate
                    placeholder={"Select supplier"}
                    value={getSupplierId()}
                    style={{ width: "200px" }}
                    onChange={handleSupplierChange}
                    options={suppliersState?.map((s) => ({
                      value: s.supplierId,
                      label: s.supplierName,
                    }))}
                  />
                </Stack>
              ) : (
                isNeedMachine && (
                  <>
                    <Divider orientation={"vertical"} flexItem color={"#000"} />
                    {!chooseMachine ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChooseMachine(true);
                          onClickGetMachineForAction(actionId)
                        }}
                        variant={"text"}
                        style={classes.sectionTitle}
                      >
                        {
                          machineName != null ? <>
                            {machineName?.length > 20
                              ? machineName.slice(0, 20) + "..."
                              : machineName}
                          </> : <>
                            Selecte New Machine
                          </>
                        }

                      </Button>
                    ) : (
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GoMakeAutoComplate
                          onChange={(e, v) => {
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
                              machineName: v.label,
                              machineId: v?.value,
                              printingActionId: id,

                            })
                            setChooseMachine(false);
                          }}
                          style={{ width: "200px" }}
                          options={machinesList}
                          placeholder={"Choose machine"}
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

            <Divider orientation={"vertical"} flexItem />
            <Stack
              style={classes.sectionTitle}
              direction={"row"}
              alignItems={"center"}
              gap={"10px"}
            >
              {
                isNeedEmployee && (
                  <>
                    {!chooseEmployee ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChooseEmployee(true);
                          onClickGetEmployeeForAction(id)
                        }}
                        variant={"text"}
                        style={classes.sectionTitle}
                      >
                        {employeeName ? employeeName : <>Select New Employee</>}
                      </Button>
                    ) : (
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GoMakeAutoComplate
                          onChange={(e, v) => {
                            updateWorkFlowForEmployees(actionId, productType, actionIndex, v?.label, v?.value, id)
                            setChooseEmployee(false);
                          }}
                          style={{ width: "200px" }}
                          options={employeesList}
                          placeholder={"Choose Employee"}
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
                )
              }
            </Stack>
            {
              isNeedEmployee && <Divider orientation={"vertical"} flexItem />
            }

            <Stack
              style={classes.sectionTitle}
              direction={"row"}
              alignItems={"center"}
              gap={"10px"}
            >
              {
                isNeedMaterial && (
                  <>
                    {!chooseMaterial ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChooseMaterial(true);
                          onClickGetMaterialsForAction(materials[0])
                        }}
                        variant={"text"}
                        style={classes.sectionTitle}
                      >
                        {materials[0]?.materialCategories?.length > 0 ? <>
                          {materials[0]?.materialCategories[0]?.name?.length > 20
                            ? materials[0]?.materialCategories[0]?.name.slice(0, 20) + "..."
                            : materials[0]?.materialCategories[0]?.name}</> : <>
                          Select New Material
                        </>}

                      </Button>
                    ) : (
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GoMakeAutoComplate
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
                              printHouseMaterialSizeName: v.label,
                              printHouseMaterialSizeId: v?.value,
                              printingActionId: id,
                            })
                            setChooseMaterial(false);

                          }}
                          style={{ width: "200px" }}
                          options={materialsList}
                          placeholder={"Choose material"}
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
                )
              }
            </Stack>
            {
              isNeedMaterial && <Divider orientation={"vertical"} flexItem />
            }

            <EditableKeyValueViewComponent
              onUpdate={handleDeliveryTimeUpdate}
              {...totalProductionTime}
              source={source}
            />
            <Divider
              orientation={"vertical"}
              style={{ height: "50%", margin: "auto 0" }}
              flexItem
            />
            <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}>
              <EditableKeyValueViewComponent
                onUpdate={handleCostUpdate}
                {...totalCost}
                source={source}
              />
              <Divider
                orientation={"vertical"}
                style={{ height: "50%", margin: "auto 0" }}
                flexItem
              />
              <PermissionCheck userPermission={Permissions.SHOW_PROFITS_IN_CALCULATIONS}>
                <Stack direction={"row"} gap={"3px"} alignItems={"center"}>
                  <EditableKeyValueViewComponent
                    onUpdate={handleProfitUpdate}
                    {...profit}
                    source={source}
                  />
                  <span>
                    {source === EWorkSource.OUT
                      ? `(${calculateOutSourceProfitInMoney()
                      } ${totalPrice ? totalPrice.defaultUnit : ""})`
                      : `(${calculateProfitInMoney()} ${totalPrice ? totalPrice.defaultUnit : ""
                      })`}
                  </span>
                </Stack>
                <Divider
                  orientation={"vertical"}
                  style={{ height: "50%", margin: "auto 0" }}
                  flexItem
                />
              </PermissionCheck>


            </PermissionCheck>

            <EditableKeyValueViewComponent
              onUpdate={handleUpdatePrice}
              {...totalPrice}
              source={source}
              valueColor={secondColor(500)}
            />
            <Divider orientation={"vertical"} flexItem />
            <div onClick={(e) => e.stopPropagation()}>
              <InOutSourceSelect value={source} onChange={handleSourceChange} />
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
            {!isCalculated && (
              <Tooltip title={t("CalculationExceptions." + actionException?.exceptionKey)}>
                <IconButton>
                  <WarningIcon />
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <SettingsIcon
                stroke={"rgba(237, 2, 140, 1)"}
                width={24}
                height={24}
              />
            </IconButton>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              style={classes.toggleActionButton}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </Stack>
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
          {outputsParameters?.length > 0 && source === EWorkSource.INTERNAL && (
            <>
              <Divider />
              <Stack
                padding={"10px 0"}
                direction={"row"}
                gap={"16px"}
                flexWrap={"wrap"}
              >
                <ParametersMapping
                  source={source}
                  parameters={outputsParameters}
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
        />
        <GoMakeDeleteModal
          insideStyle={classes.insideStyle}
          openModal={openModalMachine}
          onClose={onClickCloseModalMachine}
          title={t("pricingWidget.machineMsg")}
          hideIcon={true}
          yesBtn={t("modal.confirm")}
          onClickDelete={updateWorkFlowForMachine}
        />
        <GoMakeDeleteModal
          insideStyle={classes.insideStyle}
          openModal={openModalMaterial}
          onClose={onClickCloseModalMaterial}
          title={t("pricingWidget.materialMsg")}
          hideIcon={true}
          yesBtn={t("modal.confirm")}
          onClickDelete={updateWorkFlowForMaterials}
        />
      </Stack>

    </Fade>
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
      key: 'totalRealProductionTime',
    },
    {
      ...totalCost,
      key: 'totalCost',
    },
    {
      ...profit,
      key: "profit"
    },
    {
      ...totalPrice,
      key: "totalPrice",
      valueColor: secondColor(500),
    },
  ]
  const getSupplierId = useCallback(() => {
    if (supplierId) {
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
          <ParametersMapping source={source} parameters={parameters} isWorkFlows={true} />
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
