import {
  EOutsourceSupplierStatus,
  RuleType,
  HtmlElementType,
} from "@/widgets/product-pricing-widget/enums";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Fade, IconButton, Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { IOutSourceSupplier } from "@/widgets/product-pricing-widget/interface";
import { useOutsourceSupplier } from "@/widgets/product-pricing-widget/components/outsource-suppliers/use-outsource-supplier";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { systemCurrencyState } from "@/store";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import {
  calculationResultState,
  currentProductItemValuePriceState,
  sliderCurrentProductItemValuePriceState,
} from "../../state";
import { GomakePrimaryButton, UpdateValueAutoComplete } from "@/components";
import { TextAreaActionsMapping } from "../action/key-value-view";
import { WastebasketNew2 } from "@/icons";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useCustomerDropDownList } from "@/hooks";

interface IProps {
  value: number;
  unit: string;
  onUpdate: (v: number) => void;
  valueColor?: string;
  label: string;
  isEditable: boolean;
}

interface ISelectProps {
  value: any;
  onUpdate: (v: any) => void;
  valueColor?: string;
  label: string;
  isEditable: boolean;
  options?: any;
}

const OutSourceSuppliersRowComponent = ({
  widgetType,
  options,
  onClickAddOutSourceAction,
  onClickRemoveOutSourceAction,
  selectedWorkFlow,
  selectedWorkFlowCalculatedIsLoaded,
}: {
  widgetType: EWidgetProductType;
  options: IOutSourceSupplier[];
  onClickAddOutSourceAction: () => void;
  onClickRemoveOutSourceAction: (actionId: string) => void;
  selectedWorkFlow: any;
  selectedWorkFlowCalculatedIsLoaded: boolean;
}) => {
  const { t } = useTranslation();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const { secondColor } = useGomakeTheme();
  const [supplier, setSupplier] = useState<IOutSourceSupplier | null>();
  const {
    updatePrice,
    updateWorkHours,
    updateProfit,
    updateSupplierId,
    updateCost,
    productItemValueByEdit,
    currentProductItemValue,
  } = useOutsourceSupplier({ supplier, setSupplier, options });
  const setCurrentProductItemValueTotalPrice = useSetRecoilState<number>(
    currentProductItemValuePriceState
  );
  const setSliderCurrentProductItemValueTotalPrice = useSetRecoilState<number>(
    sliderCurrentProductItemValuePriceState
  );

  const calculationResult = useRecoilValue(calculationResultState);
  useEffect(() => {
    debugger;
    if (options?.length > 0) {
      const isEditOrDuplicate =
        widgetType === EWidgetProductType.EDIT ||
        widgetType === EWidgetProductType.DUPLICATE;
      const suppId = isEditOrDuplicate
        ? productItemValueByEdit?.supplierId
        : selectedWorkFlow?.actions?.supplierId;
      const foundSupplier =
        options.find((x) => x.supplierId == suppId) || options[0];
      if (isEditOrDuplicate && foundSupplier) {
        setSupplier({
          ...foundSupplier,
          finalPrice: productItemValueByEdit?.outSourceTotalPrice,
          cost: productItemValueByEdit?.outSourceCost,
          profit: productItemValueByEdit?.outSourceProfits,
          workHours: productItemValueByEdit?.outSourceTotalRealProductionTime,
        });
      } else {
        setSupplier(foundSupplier);
      }
    }
  }, []);
  const handleDeliveryTimeUpdate = (
    newValue: number,
    actionId: string,
    supplierId: string
  ) => {
    updateWorkHours(supplierId, +newValue, actionId);
  };
  const handleCostUpdate = (
    newCost: number,
    actionId: string,
    supplierId: string
  ) => {
    updateCost(supplierId, newCost, actionId);
  };
  const handleProfitUpdate = (
    profit: number,
    actionId: string,
    supplierId: string
  ) => {
    updateProfit(supplierId, +profit, actionId);
  };
  const handleUpdatePrice = (
    price: number,
    actionId: string,
    supplierId: string
  ) => {
    updatePrice(supplierId, price, actionId);
  };

  const handleSupplierUpdate = (supplierId, actionId) => {
    debugger;
    const selectedSupp = options.find((x) => x.supplierId == supplierId);
    updateSupplierId(supplierId, actionId);
    // setCurrentProductItemValueTotalPrice(selectedSupp.finalPrice)
    //setSliderCurrentProductItemValueTotalPrice(selectedSupp.finalPrice)
    //setSupplier(selectedSupp);
  };

  useEffect(() => {
    if (supplier?.finalPrice > 0) {
      setCurrentProductItemValueTotalPrice(supplier.finalPrice);
      setSliderCurrentProductItemValueTotalPrice(supplier.finalPrice); //!new
    }
  }, [supplier?.finalPrice, setCurrentProductItemValueTotalPrice]);

  return (
    <>
      {selectedWorkFlowCalculatedIsLoaded ? (
        <Skeleton variant="rectangular" width={"100%"} height={"100px"} />
      ) : (
        <Fade in={true} timeout={700}>
          <Stack
            direction={"column"}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            gap={"15px"}
          >
            {!selectedWorkFlowCalculatedIsLoaded &&
              selectedWorkFlow?.actions?.map((action, index) => {
                return (
                  <OutSourceSupplierRow
                    action={action}
                    currentProductItemValue={currentProductItemValue}
                    selectedWorkFlow={selectedWorkFlow}
                    options={options}
                    handleSupplierUpdate={handleSupplierUpdate}
                    handleDeliveryTimeUpdate={handleDeliveryTimeUpdate}
                    handleCostUpdate={handleCostUpdate}
                    handleProfitUpdate={handleProfitUpdate}
                    handleUpdatePrice={handleUpdatePrice}
                    onClickRemoveOutSourceAction={onClickRemoveOutSourceAction}
                    t={t}
                    secondColor={secondColor}
                    systemCurrency={systemCurrency}
                  />
                );
                //return OutSourceSupplierRow(action,currentProductItemValue,selectedWorkFlow,options,handleSupplierUpdate,handleDeliveryTimeUpdate,handleCostUpdate,handleProfitUpdate,handleUpdatePrice,onClickRemoveOutSourceAction,t,secondColor,systemCurrency);
              })}
          </Stack>
        </Fade>
      )}
      <GomakePrimaryButton
        onClick={onClickAddOutSourceAction}
        style={{
          width: "fit-content",
          alignSelf: "flex-end",
          marginTop: 10,
          height: 40,
          marginRight: 10,
        }}
      >
        {t("pricingWidget.addNewOutSourceAction")}
      </GomakePrimaryButton>
    </>
  );
};
const OutSourceSupplierRow = ({
  action,
  currentProductItemValue,
  selectedWorkFlow,
  options,
  handleSupplierUpdate,
  handleDeliveryTimeUpdate,
  handleCostUpdate,
  handleProfitUpdate,
  handleUpdatePrice,
  onClickRemoveOutSourceAction,
  t,
  secondColor,
  systemCurrency,
}) => {
  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    listClient,
  } = useCustomerDropDownList({ clientType: CLIENT_TYPE.SUPPLIER });
  const { classes } = useStyle();
  // const isEditOrDuplicate = widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE;
  // const suppId = isEditOrDuplicate ? productItemValueByEdit?.supplierId : action?.supplierId;
  const foundSupplier = options.find((x) => x.supplierId == action?.supplierId);
  if (
    (foundSupplier && customer && customer.id != foundSupplier.supplierId) ||
    !customer
  ) {
    setCustomer({
      id: foundSupplier?.supplierId,
      name: foundSupplier?.supplierName,
    });
  }

  const textAreaOutputs = action?.outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT_AREA
  );

  const mappedSuppliers = renderOptions()?.map((supplier) => ({
    text: supplier?.name,
    id: supplier?.id,
    ...supplier,
  }));

  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<any>(null);

  const onBlurBusinessName = async () => {
    setIsUpdateBusinessName(null);
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      style={{ ...classes.actionContainer }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        position={"relative"}
        style={{
          ...classes.actionContainer,
          padding: "10px 16px",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          gap={"10px"}
          flexWrap={"wrap"}
        >
          <ClientAutocomplete
            uiType="updated"
            key={customer?.id}
            clientType={CLIENT_TYPE.SUPPLIER}
            disableClearable={true}
            options={mappedSuppliers ? mappedSuppliers : []}
            style={{ width: "200px" }}
            getOptionLabel={(item) => item.text}
            defaultFiltering={false}
            onChangeTextField={checkWhatRenderArray}
            value={customer?.name ?? t("sales.quote.chooseSupplier")}
            loading={isFetching}
            onChange={(e, v) => handleSupplierUpdate(v?.id, action?.id)}
            isUpdate={isUpdateBusinessName}
            setIsUpdate={setIsUpdateBusinessName}
            onBlur={onBlurBusinessName}
          />
          {/*<EditableSelect
                isEditable={true}
                label={t("suppliers.supplierName")}
                value={
                  foundSupplier?.supplierName
                      ? foundSupplier?.supplierName
                      : "Select Supplier"
                }
                // onUpdate={handleSupplierUpdate}
                onUpdate={(v) => {
                  handleSupplierUpdate(v, action?.id);
                }}
                options={options}
            />*/}
          <Divider orientation={"vertical"} flexItem />
          <EditableValue
            unit={"W.H"}
            isEditable={
              foundSupplier?.status === EOutsourceSupplierStatus.Manually
            }
            label={t("pricingWidget.endTime")}
            value={
              Array.isArray(action?.totalProductionTime?.outSourceValues) &&
              action?.totalProductionTime?.outSourceValues.length > 0
                ? action?.totalProductionTime?.outSourceValues[0]
                : 0
            }
            onUpdate={(v) => {
              handleDeliveryTimeUpdate(
                +v,
                action?.id,
                foundSupplier?.supplierId
              );
            }}
          />
          <Divider orientation={"vertical"} flexItem />
          <EditableValue
            unit={systemCurrency}
            isEditable={
              foundSupplier?.status === EOutsourceSupplierStatus.Manually
            }
            label={t("pricingWidget.cost")}
            value={
              Array.isArray(action?.totalCost?.outSourceValues) &&
              action?.totalCost?.outSourceValues.length > 0
                ? action?.totalCost?.outSourceValues[0]
                : 0
            }
            onUpdate={(v) => {
              handleCostUpdate(+v, action?.id, foundSupplier?.supplierId);
            }}
          />
          <Divider orientation={"vertical"} flexItem />
          <EditableValue
            unit={"%"}
            isEditable={
              foundSupplier?.status === EOutsourceSupplierStatus.Manually
            }
            label={t("pricingWidget.profit")}
            value={
              Array.isArray(action?.profit?.outSourceValues) &&
              action?.profit?.outSourceValues.length > 0
                ? action?.profit?.outSourceValues[0]
                : 0
            }
            onUpdate={(v) => {
              handleProfitUpdate(+v, action?.id, foundSupplier?.supplierId);
            }}
          />
          <Divider orientation={"vertical"} flexItem />
          <EditableValue
            unit={systemCurrency}
            isEditable={
              foundSupplier?.status === EOutsourceSupplierStatus.Manually &&
              foundSupplier?.cost !== 0
            }
            valueColor={secondColor(500)}
            label={t("pricingWidget.finalPrice")}
            value={
              Array.isArray(action?.totalPrice?.outSourceValues) &&
              action?.totalPrice?.outSourceValues.length > 0
                ? action?.totalPrice?.outSourceValues[0]
                : 0
            }
            onUpdate={(v) => {
              handleUpdatePrice(+v, action?.id, foundSupplier?.supplierId);
            }}
          />
          <Divider orientation={"vertical"} flexItem />
          <TextAreaActionsMapping
            parameters={textAreaOutputs}
            actionId={action?.id}
            currentProductItemValue={currentProductItemValue}
            productType={action?.productType}
            isOutSource={true}
            supplierId={foundSupplier?.supplierId}
          />
        </Stack>
        {selectedWorkFlow?.actions.length > 1 && (
          <IconButton
            onClick={() => {
              onClickRemoveOutSourceAction(action?.id);
            }}
            style={classes.toggleActionButton}
          >
            <WastebasketNew2 />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};
const EditableValue = ({
  value,
  onUpdate,
  valueColor,
  label,
  isEditable,
  unit,
}: IProps) => {
  const { classes } = useStyle();
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<number>(value || 0);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleValueClick = (e) => {
    e.stopPropagation();
    if (isEditable) {
      setEdit(true);
    }
  };

  const handleCancelUpdate = () => {
    setEdit(false);
    setEditValue(value);
  };

  const onInputChange = (v: string) => {
    setEditValue(+v);
  };

  const handleValueUpdate = () => {
    onUpdate(editValue);
    setEdit(false);
  };

  return (
    <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
      <span style={classes.detailTitle}>{label}</span>
      {edit ? (
        <UpdateValueInput
          value={editValue.toString()}
          onUpdate={handleValueUpdate}
          onInputChange={onInputChange}
          clickedOut={handleValueUpdate}
          onCancel={handleCancelUpdate}
        />
      ) : (
        <Button
          onClick={handleValueClick}
          variant={"text"}
          style={
            valueColor
              ? {
                  ...classes.detailValue,
                  color: valueColor,
                }
              : classes.detailValue
          }
        >{`${value} ${unit}`}</Button>
      )}
    </Stack>
  );
};

const EditableSelect = ({
  value,
  onUpdate,
  valueColor,
  label,
  isEditable,
  options,
}: ISelectProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<any>(null);
  const { classes } = useStyle();

  const handleValueClick = (e) => {
    e.stopPropagation();
    if (isEditable) {
      setEdit(true);
      setEditValue(value); // Set the current value when entering edit mode
    }
  };

  const onInputChange = (v: string) => {
    setEditValue(v);
  };

  const handleValueUpdate = (newValue: any) => {
    onUpdate(newValue);
    setEdit(false);
  };

  const handleClickOut = () => {
    setEdit(false);
  };

  return (
    <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
      <span style={classes.detailTitle}>{label}</span>
      {edit ? (
        <UpdateValueAutoComplete
          clickedOut={handleClickOut}
          value={editValue}
          options={options?.map((op) => ({
            label: op?.supplierName,
            value: op?.supplierId,
          }))}
          onChangeTextField={(event) => onInputChange(event.target.value)}
          onChange={(event, newValue) => handleValueUpdate(newValue)}
          getOptionLabel={(option) => option.label}
        />
      ) : (
        <Button
          onClick={handleValueClick}
          variant={"text"}
          style={
            valueColor
              ? {
                  ...classes.detailValue,
                  color: valueColor,
                }
              : classes.detailValue
          }
        >{`${value}`}</Button>
      )}
    </Stack>
  );
};

export { OutSourceSuppliersRowComponent };
