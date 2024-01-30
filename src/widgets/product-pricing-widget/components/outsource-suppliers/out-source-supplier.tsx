import {EOutsourceSupplierStatus} from "@/widgets/product-pricing-widget/enums";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {Fade} from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {UpdateValueInput} from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";
import {useState} from "react";
import {IOutSourceSupplier} from "@/widgets/product-pricing-widget/interface";
import {PrimaryButton} from "@/components/button/primary-button";
import {useOutsourceSupplier} from "@/widgets/product-pricing-widget/components/outsource-suppliers/use-outsource-supplier";
import {useTranslation} from "react-i18next";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";

interface IProps {
    value: number;
    unit: string;
    onUpdate: (v: number) => void;
    valueColor?: string;
    label: string;
    isEditable: boolean;
}

const OutSourceSupplierComponent = ({
                                        supplierName,
                                        supplierId,
                                        cost,
                                        status,
                                        workHours,
                                        finalPrice,
                                        profit
                                    }: IOutSourceSupplier) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {secondColor} = useGomakeTheme();
    const {updatePrice, updateWorHours, updateProfit, updateCost, addItem} = useOutsourceSupplier();
    const handleDeliveryTimeUpdate = (newValue: number) => {
        updateWorHours(supplierId, +newValue);
    }

    const handleCostUpdate = (newCost: number) => {
        updateCost(supplierId, newCost);
    }
    const handleProfitUpdate = (profit: number) => {
        updateProfit(supplierId, +profit)
    }
    const handleUpdatePrice = (price: number) => {
        updatePrice(supplierId, price);
    }
    const systemCurrency = useRecoilValue<any>(systemCurrencyState);

    return (
        <Fade in={true} timeout={700}>
            <Stack direction={"row"} alignItems={'center'} justifyContent={'space-between'}
                   style={{...classes.actionContainer, padding: '10px 16px'}}>
                <Stack alignItems={'center'} direction={"row"} gap={'10px'} flexWrap={'wrap'}>
                    <span style={classes.sectionTitle}>{supplierName}</span>
                    <Divider orientation={'vertical'} flexItem/>
                    <EditableValue unit={'W.H'} isEditable={status === EOutsourceSupplierStatus.Manually}
                                   label={t('pricingWidget.endTime')} value={workHours} onUpdate={handleDeliveryTimeUpdate}/>
                    <Divider orientation={'vertical'} flexItem/>
                    <EditableValue unit={systemCurrency} isEditable={status === EOutsourceSupplierStatus.Manually} label={t('pricingWidget.cost')}
                                   value={cost} onUpdate={handleCostUpdate}/>
                    <Divider orientation={'vertical'} flexItem/>
                    <EditableValue unit={'%'} isEditable={status === EOutsourceSupplierStatus.Manually} label={t('pricingWidget.profit')}
                                   value={profit} onUpdate={handleProfitUpdate}/>
                    <Divider orientation={'vertical'} flexItem/>
                    <EditableValue unit={systemCurrency} isEditable={status === EOutsourceSupplierStatus.Manually}
                                   valueColor={secondColor(500)} label={t('pricingWidget.finalPrice')} value={finalPrice}
                                   onUpdate={handleUpdatePrice}/>
                </Stack>
                <PrimaryButton onClick={() => addItem(supplierId)} style={{width: 'fit-content', height: 35}} variant={'contained'}>{t('pricingWidget.add')}</PrimaryButton>
            </Stack>
        </Fade>
    )
}


const EditableValue = ({value, onUpdate, valueColor, label, isEditable, unit}: IProps) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<number>(0);
    const {classes} = useStyle();
    const handleValueClick = (e) => {
        e.stopPropagation();
        if (isEditable) {
            setEdit(true);
        }
    }

    const handleCancelUpdate = () => {
        setEdit(false);
        setEditValue(0);
    }

    const onInputChange = (v: string) => {
        setEditValue(+v);
    };

    const handleValueUpdate = () => {
        onUpdate(editValue);
        setEdit(false);
    }

    return (
        <Stack direction={'row'} gap={'10x'} alignItems={'center'}>
            <span style={classes.detailTitle}>{label}</span>
            {edit ? <UpdateValueInput value={editValue.toString()} onUpdate={handleValueUpdate}
                                      onInputChange={onInputChange}
                                      clickedOut={handleValueUpdate} onCancel={handleCancelUpdate}/> :
                <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{`${value} ${unit}`}</Button>
            }
        </Stack>
    );
}


export {OutSourceSupplierComponent}

