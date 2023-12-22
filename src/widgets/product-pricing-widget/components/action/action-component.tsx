import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useCallback, useMemo, useState } from "react";
import { IWorkFlowAction } from "@/widgets/product-pricing-widget/interface";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  EditableKeyValueViewComponent,
  ParametersMapping,
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
import { GoMakeAutoComplate } from "@/components";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { PrintImageComponent } from "@/widgets/product-pricing-widget/components/print-image/print-image-component";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { SettingsIcon } from "@/icons/settings";
import { SettingNavBar, SettingNewIcon } from "@/icons";
import { SettingsMenu } from "./settings-menu";

interface IActionContainerComponentProps extends IWorkFlowAction {
  delay: number;
}

interface IActionsComponentProps {
  actions: IWorkFlowAction[];
}

const Actions = ({ actions }: IActionsComponentProps) => {
  return (
    <Stack gap={"10px"}>
      {actions?.map((action, index) => (
        <ActionContainerComponent delay={index * 800} {...action} />
      ))}
    </Stack>
  );
};
const ActionContainerComponent = ({
  actionId,
  actionName,
  outputs,
  delay,
  machineName,
  profit,
  totalPrice,
  totalProductionTime,
  totalCost,
  source,
  supplierId,
}: IActionContainerComponentProps) => {
  source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const currentProductItemValue = useRecoilValue(currentProductItemValueState);
  const {
    updateDeliveryTime,
    updateCost,
    updateProfit,
    updatePrice,
    changeActionWorkSource,
    updateActionSupplier,
    getActionMachinesList,
    selectNewMachine,
    handleClick,
    handleClose,
    anchorEl,
    open,
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
  const inputsParameters = outputs.filter(
    (parameter) =>
      parameter.propertyType === RuleType.PARAMETER &&
      parameter.htmlElementType === HtmlElementType.TEXT
  );
  const outputsParameters = outputs.filter(
    (parameter) =>
      parameter.propertyType === RuleType.OUTPUT &&
      parameter.htmlElementType === HtmlElementType.TEXT
  );
  const imageOutputs = outputs.filter(
    (parameter) =>
      parameter.propertyType === RuleType.OUTPUT &&
      parameter.htmlElementType === HtmlElementType.IMAGE
  );
  const handleDeliveryTimeUpdate = (newValue: string) => {
    const object = {
      ...totalProductionTime,
      values:
        source === EWorkSource.INTERNAL
          ? [newValue]
          : totalProductionTime.values,
      outSourceValues:
        source === EWorkSource.OUT
          ? [newValue]
          : totalProductionTime.outSourceValues,
    };
    updateDeliveryTime(object, actionId);
  };

  const handleCostUpdate = (newCost: string) => {
    updateCost(
      newCost,
      EWorkSource.OUT ? profit?.outSourceValues[0] : profit.values[0],
      actionId,
      source
    );
  };

  const handleProfitUpdate = (profit: string) => {
    updateProfit(
      source === EWorkSource.OUT
        ? totalCost?.outSourceValues[0]
        : totalCost.values[0],
      profit,
      actionId,
      source
    );
  };

  const handleUpdatePrice = (price: string) => {
    updatePrice(
      price,
      source === EWorkSource.OUT
        ? totalCost?.outSourceValues[0]
        : totalCost.values[0],
      actionId,
      source
    );
  };

  const handleSourceChange = (source: EWorkSource) => {
    changeActionWorkSource(source, actionId);
  };
  const handleSupplierChange = (e, value) => {
    updateActionSupplier(value?.value, actionId);
  };
  const getSupplierId = useCallback(() => {
    if (supplierId) {
      const supplier = suppliers?.find((sup) => sup.value === supplierId);
      return !!supplier ? supplier.label : "";
    }
    return "";
  }, [supplierId, suppliers]);
  return (
    <Fade in={true} timeout={delay}>
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
                !!machineName && (
                  <>
                    <Divider orientation={"vertical"} flexItem color={"#000"} />
                    {!chooseMachine ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChooseMachine(true);
                        }}
                        variant={"text"}
                        style={classes.sectionTitle}
                      >
                        {machineName.length > 20
                          ? machineName.slice(0, 20) + "..."
                          : machineName}
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
                            if (selectNewMachine(v?.value, actionId)) {
                              setChooseMachine(false);
                            }
                          }}
                          style={{ width: "200px" }}
                          options={getActionMachinesList(actionId)}
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
            <Stack direction={"row"} gap={"3px"} alignItems={"center"}>
              <EditableKeyValueViewComponent
                onUpdate={handleProfitUpdate}
                {...profit}
                source={source}
              />
              <span>
                {source === EWorkSource.OUT
                  ? `(${
                      +totalPrice.outSourceValues[0] -
                      +totalCost.outSourceValues[0]
                    } ${totalPrice.defaultUnit})`
                  : `(${+totalPrice.values[0] - +totalCost.values[0]} ${
                      totalPrice.defaultUnit
                    })`}
              </span>
            </Stack>
            <Divider
              orientation={"vertical"}
              style={{ height: "50%", margin: "auto 0" }}
              flexItem
            />
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
            <IconButton onClick={handleClick}>
              <SettingsIcon
                stroke={"rgba(237, 2, 140, 1)"}
                width={24}
                height={24}
              />
            </IconButton>
          </Stack>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            style={classes.toggleActionButton}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Stack>
        <Collapse
          in={isOpen}
          collapsedSize={0}
          orientation={"vertical"}
          onClick={(e) => e.stopPropagation()}
        >
          {inputsParameters.length > 0 && (
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
          {outputsParameters.length > 0 && source === EWorkSource.INTERNAL && (
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
    totalProductionTime,
    totalCost,
    profit,
    {
      ...totalPrice,
      valueColor: secondColor(500),
    },
  ];
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
          <ParametersMapping source={source} parameters={parameters} />
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
