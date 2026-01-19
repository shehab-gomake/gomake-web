import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IWorkFlowAction } from "@/widgets/product-pricing-widget/interface";
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
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentProductItemValueState,
  outsourceSuppliersState,
} from "@/widgets/product-pricing-widget/state";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { _renderIconLogs } from "@/utils/constants";
import { TableOutPutComponent } from "../table-output/table-output-component";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { isActionEmployeeUpdatedState, permissionsState } from "@/store";
import { ModalType } from "@/enums";
import { _renderDeliveryDate, renderExceptionMessage } from "@/utils/helpers";
import { formatValueWithUnit } from "@/utils/is-currency";

interface IMobileActionContainerComponentProps extends IWorkFlowAction {
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
}

const MobileActions = ({
  actions,
  workFlowId,
  productType,
  widgetType,
  selectedWorkFlowCalculatedIsLoaded,
  isFromSetting = false,
  deleteActionFromProduct,
  updateProductAction,
}: IActionsComponentProps) => {
  const [actionsList, setActionsList] = useState(actions);

  useEffect(() => {
    setActionsList(actions);
  }, [actions]);

  return (
    <>
      {actionsList?.map((action, index) => (
        <div style={{ marginBottom: "16px" }}>
          <MobileActionContainerComponent
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
            {...action}
          />
        </div>
      ))}
    </>
  );
};

const MobileActionContainerComponent = ({
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
}: IMobileActionContainerComponentProps) => {
  const { classes } = useStyle();
  const { secondColor } = useGomakeTheme();
  source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const [chooseMaterial, setChooseMaterial] = useState<boolean>(false);
  const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);
  const [chooseFold, setChooseFold] = useState<boolean>(false);
  const [selectedfold, setSelectedFold] = useState<any>();

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
    employeesList,
    machinesList,
    materialsList,
    foldOptions,
  } = useActionUpdateValues();

  const suppliersState = useRecoilValue(outsourceSuppliersState);
  const [isActionEmployeeUpdated, setIsActionEmployeeUpdated] = useRecoilState(
    isActionEmployeeUpdatedState
  );

  const suppliers = useMemo(() => {
    return suppliersState?.map((s) => ({
      value: s.supplierId,
      label: s.supplierName,
    }));
  }, [suppliersState]);

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
      parameter?.htmlElementType === HtmlElementType.TEXT_AREA &&
      !(source === EWorkSource.INTERNAL && (parameter?.name === "Purchase Order Details" || parameter?.orginalName === "PurchaseOrderDetails"))
  );

  const tableOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );

  const handleDeliveryTimeUpdate = (newValue: string) => {
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

  const handleCostUpdate = (newCost: string) => {
    if (isFromSetting) {
      updateProductAction({ actionId, value: newCost, fieldName: "totalcost" });
    } else {
      updateActionData(id, +newCost, "totalCost", productType).then();
    }
  };

  const handleProfitUpdate = (profit: string) => {
    updateActionData(id, +profit, "profit", productType).then();
  };

  const handleUpdatePrice = (price: string) => {
    updateActionData(id, +price, "totalPrice", productType).then();
  };

  const handleSourceChange = (source: EWorkSource) => {
    if (isFromSetting) {
      updateProductAction({ actionId, value: source, fieldName: "source" });
    } else {
      updateActionData(id, source, "source", productType).then();
    }
  };

  const handleSupplierChange = (e, value) => {
    if (isFromSetting) {
      updateProductAction({
        actionId,
        value: value?.value,
        fieldName: "supplierid",
      });
    } else {
      updateActionData(id, value?.value, "supplierId", productType).then();
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

  const getSupplierId = useCallback(() => {
    if (supplierId) {
      const supplier = suppliers?.find((sup) => sup.value === supplierId);
      return !!supplier ? supplier.label : "";
    }
    return "";
  }, [supplierId, suppliers, suppliersState]);

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
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen && !isFromSetting);
              }}
              style={{
                ...classes.actionContainer,
                border: isOpen ? classes.actionContainerBorder : "unset",
              }}
            >
              <Stack
                onClick={(e) => e.stopPropagation()}
                padding={"5px 0px 10px 0px"}
                direction={"column"}
                justifyContent={"space-between"}
              >
                {/* Icons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 10,
                    alignSelf: "flex-end",
                    height: "100%",
                  }}
                >
                  {actionException?.exceptionKey && (
                    <Tooltip title={renderExceptionMessage(actionException?.exceptionKey, actionException?.values, t)}>
                      <IconButton>
                        {_renderIconLogs(
                          actionException?.exceptionType,
                          20,
                          20
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e);
                    }}
                  >
                    <SettingsIcon
                      stroke={"var(--theme-secondary-color, #ED028C)"}
                      width={20}
                      height={20}
                    />
                  </IconButton> */}
                  {!isFromSetting && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                      }}
                      style={classes.toggleActionButtonMobile}
                    >
                      {isOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  )}
                </div>
                {/* Content */}
                <Stack
                  direction={"row"}
                  gap={"8px"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                >
                  <Stack
                    style={classes.mobileSectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    <span>{actionName}</span>
                    {source == EWorkSource.OUT ? (
                      <Stack
                        gap={"10px"}
                        direction={"row"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Divider
                          orientation={"vertical"}
                          flexItem
                          color={"#000"}
                          sx={{
                            height: "25px",
                            alignSelf: "center",
                          }}
                        />
                        <GoMakeAutoComplate
                          key={supplierId + suppliers}
                          placeholder={t("materials.sheetPaper.selectSupplier")}
                          value={getSupplierId()}
                          style={{ width: "100px" }}
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
                          <Divider
                            orientation={"vertical"}
                            flexItem
                            color={"#000"}
                            sx={{
                              height: "25px",
                              alignSelf: "center",
                            }}
                          />
                          {!chooseMachine ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseMachine(true);
                                onClickGetMachineForAction(actionId);
                              }}
                              variant={"text"}
                              style={classes.mobileSectionTitle}
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
                                      actionIndex,
                                      v?.label,
                                      true
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
                                style={{ width: "100px" }}
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
                    style={classes.mobileSectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    {isNeedEmployee && source != EWorkSource.OUT && (
                      <>
                        {!chooseEmployee ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChooseEmployee(true);
                              onClickGetEmployeeForAction(actionId);
                            }}
                            variant={"text"}
                            style={classes.mobileSectionTitle}
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
                              style={{ width: "100px" }}
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
                    style={classes.mobileSectionTitle}
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
                            style={classes.mobileSectionTitle}
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
                              onChange={(e, v) => {
                                selectNewMaterials(
                                  v?.value,
                                  actionId,
                                  productType,
                                  actionIndex,
                                  v?.label,
                                  true
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
                              style={{ width: "100px" }}
                              options={materialsList}
                              placeholder={t(
                                "materials.sheetPaper.chooseMaterial"
                              )}
                              value={materials[0]?.materialCategories?.[0]?.name}
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
                    style={classes.mobileSectionTitle}
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
                            style={classes.mobileSectionTitle}
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
                              onChange={(e, v) => {
                                selectNewFold(
                                  v?.id,
                                  actionId,
                                  productType,
                                  actionIndex,
                                  v?.label
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
                              style={{ width: "100px" }}
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
                            {`(${source === EWorkSource.OUT
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
                      {!isFromSetting && (
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
                {outputsParameters?.length > 0 &&
                  source === EWorkSource.INTERNAL && (
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
                        {/* {imageOutputs.map((parameter) => (
                          <PrintImageComponent {...parameter} />
                        ))} */}
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
                      </Stack>
                    </>
                  )}
              </Collapse>
              {/* <SettingsMenu
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
              /> */}
              <GoMakeDeleteModal
                modalType={ModalType.ADD}
                insideStyle={classes.insideStyle}
                openModal={openModalMachine}
                onClose={onClickCloseModalMachine}
                title={t("pricingWidget.machineMsg")}
                hideIcon={true}
                yesBtn={t("modal.confirm")}
                onClickDelete={updateWorkFlowForMachine}
              />
              <GoMakeDeleteModal
                modalType={ModalType.ADD}
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
        </>
      )}
    </>
  );
};

const MobileActionComponent = ({
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
            style={classes.mobileSectionTitle}
            direction={"row"}
            alignItems={"center"}
            gap={"10px"}
          >
            <span>{actionName}</span>
            {source === EWorkSource.OUT ? (
              <>
                <Divider
                  orientation={"vertical"}
                  flexItem
                  color={"#000"}
                  sx={{
                    height: "25px",
                    alignSelf: "center",
                  }}
                />
                <span>{getSupplierId()}</span>
              </>
            ) : (
              machineName && (
                <>
                  <Divider
                    orientation={"vertical"}
                    flexItem
                    color={"#000"}
                    sx={{
                      height: "25px",
                      alignSelf: "center",
                    }}
                  />
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

export { MobileActionContainerComponent, MobileActions, MobileActionComponent };
