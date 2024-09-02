import { EOutsourceSupplierStatus } from "@/widgets/product-pricing-widget/enums";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Fade } from "@mui/material";
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
import { calculationResultState, currentProductItemValuePriceState } from "../../state";
import { UpdateValueAutoComplete } from "@/components";

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
    options
}: { widgetType: EWidgetProductType; options: IOutSourceSupplier[] }) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { secondColor } = useGomakeTheme();
    const [supplier, setSupplier] = useState<IOutSourceSupplier | null>();
    const { updatePrice, updateWorkHours, updateProfit, updateCost, productItemValueByEdit } = useOutsourceSupplier({ supplier, setSupplier , options});
    const systemCurrency = useRecoilValue<any>(systemCurrencyState);
    const setCurrentProductItemValueTotalPrice = useSetRecoilState<number>(currentProductItemValuePriceState);
    const calculationResult = useRecoilValue(calculationResultState);

    useEffect(() => {
        if (options?.length > 0) {
            const isEditOrDuplicate = widgetType === EWidgetProductType.EDIT || widgetType === EWidgetProductType.DUPLICATE;
            const suppId = isEditOrDuplicate ? productItemValueByEdit?.supplierId : calculationResult?.productItemValue?.supplierId;
            const foundSupplier = options.find(x => x.supplierId == suppId) || options[0];
            if (isEditOrDuplicate && foundSupplier) {
                setSupplier({
                    ...foundSupplier,
                    finalPrice: productItemValueByEdit?.outSourceTotalPrice,
                    cost: productItemValueByEdit?.outSourceCost,
                    profit: productItemValueByEdit?.outSourceProfits,
                    workHours: productItemValueByEdit?.outSourceTotalRealProductionTime
                });
            } else {
                setSupplier(foundSupplier);
            }
        }
    }, []);

    const handleDeliveryTimeUpdate = (newValue: number) => {
        updateWorkHours(supplier?.supplierId, +newValue);
    }
    const handleCostUpdate = (newCost: number) => {
        updateCost(supplier?.supplierId, newCost);
    }
    const handleProfitUpdate = (profit: number) => {
        updateProfit(supplier?.supplierId, +profit)
    }
    const handleUpdatePrice = (price: number) => {
        updatePrice(supplier?.supplierId, price);
    }

    const handleSupplierUpdate = (value) => {
        const selectedSupp = options.find(x => x.supplierId == value?.value);
        setCurrentProductItemValueTotalPrice(selectedSupp.finalPrice)
        setSupplier(selectedSupp);
    }

    useEffect(() => {
        if (supplier?.finalPrice > 0) {
            setCurrentProductItemValueTotalPrice(supplier.finalPrice)
        }
    }, [supplier?.finalPrice, setCurrentProductItemValueTotalPrice])


    return (
        <Fade in={true} timeout={700}>
            <Stack direction={"row"} alignItems={'center'} justifyContent={'space-between'}
                style={{ ...classes.actionContainer, padding: '10px 16px' }}>
                <Stack alignItems={'center'} direction={"row"} gap={'10px'} flexWrap={'wrap'}>
                    <EditableSelect isEditable={supplier?.status === EOutsourceSupplierStatus.Manually}
                        label={t('suppliers.supplierName')} value={supplier?.supplierName} onUpdate={handleSupplierUpdate} options={options} />
                    <Divider orientation={'vertical'} flexItem />
                    <EditableValue unit={'W.H'} isEditable={supplier?.status === EOutsourceSupplierStatus.Manually}
                        label={t('pricingWidget.endTime')} value={supplier?.workHours} onUpdate={handleDeliveryTimeUpdate} />
                    <Divider orientation={'vertical'} flexItem />
                    <EditableValue unit={systemCurrency} isEditable={supplier?.status === EOutsourceSupplierStatus.Manually} label={t('pricingWidget.cost')}
                        value={supplier?.cost} onUpdate={handleCostUpdate} />
                    <Divider orientation={'vertical'} flexItem />
                    <EditableValue unit={'%'} isEditable={supplier?.status === EOutsourceSupplierStatus.Manually} label={t('pricingWidget.profit')}
                        value={supplier?.profit} onUpdate={handleProfitUpdate} />
                    <Divider orientation={'vertical'} flexItem />
                    <EditableValue unit={systemCurrency} isEditable={supplier?.status === EOutsourceSupplierStatus.Manually}
                        valueColor={secondColor(500)} label={t('pricingWidget.finalPrice')} value={supplier?.finalPrice}
                        onUpdate={handleUpdatePrice} />
                </Stack>
            </Stack>
        </Fade>
    )
}

const EditableValue = ({ value, onUpdate, valueColor, label, isEditable, unit }: IProps) => {
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
    }

    const handleCancelUpdate = () => {
        setEdit(false);
        setEditValue(value);
    }

    const onInputChange = (v: string) => {
        setEditValue(+v);
    };

    const handleValueUpdate = () => {
        onUpdate(editValue);
        setEdit(false);
    }


    return (
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{label}</span>
            {edit ? <UpdateValueInput value={editValue.toString()} onUpdate={handleValueUpdate}
                onInputChange={onInputChange}
                clickedOut={handleValueUpdate} onCancel={handleCancelUpdate} /> :
                <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{`${value} ${unit}`}</Button>
            }
        </Stack>
    );
}

const EditableSelect = ({ value, onUpdate, valueColor, label, isEditable, options }: ISelectProps) => {
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
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{label}</span>
            {edit ?
                <UpdateValueAutoComplete
                    clickedOut={handleClickOut}
                    value={editValue}
                    options={options?.map(op => ({
                        label: op?.supplierName,
                        value: op?.supplierId,
                    }))}
                    onChangeTextField={(event) => onInputChange(event.target.value)}
                    onChange={(event, newValue) => handleValueUpdate(newValue)}
                    getOptionLabel={(option) => option.label}
                /> :
                <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{`${value}`}</Button>
            }
        </Stack>
    );
};

export { OutSourceSuppliersRowComponent }

