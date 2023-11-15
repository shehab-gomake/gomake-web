import React, {SyntheticEvent, useCallback, useRef, useState} from "react";
import {GoMakeAutoComplate} from "@/components";
import {useRecoilValue} from "recoil";
import {currenciesState} from "@/widgets/materials-widget/state";
import {useTableCellData} from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import {ClickOutside} from "@/components/click-out-side/click-out-side";
import {Paper} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/materials-widget/style";

interface ICurrencyInputProps {
    value: string;
    id: string
}

const CurrencyInput = ({value, id}: ICurrencyInputProps) => {
    const {classes} = useStyle();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const currencies = useRecoilValue(currenciesState);
    const {updateCellData} = useTableCellData();
    const popUpRef = useRef(null);
    const onSelectLanguage = async (event: SyntheticEvent, value) => {
        await updateCellData(id, 'currency', value?.value);
        setIsUpdate(false);

    }
    const currencyName = useCallback(() => {
        return currencies?.find(c => c.value.toLowerCase() === value.toLowerCase())?.label
    }, [value, currencies])
    return (
        <>
            {
                isUpdate ? <div style={{minWidth: '80px'}}>
                        <ClickOutside exceptionRef={popUpRef} onClick={() => setIsUpdate(false)}>
                            <GoMakeAutoComplate disableClearable={true} value={value} options={currencies}
                                                onChange={onSelectLanguage} PaperComponent={(props) => {
                                return <Paper ref={popUpRef} elevation={8} {...props} >
                                    {props?.children}
                                </Paper>;
                            }}/>
                        </ClickOutside>
                    </div> :
                    <PrimaryButton sx={classes.clickableData} onClick={() => setIsUpdate(true)} variant={'text'}>{currencyName()}</PrimaryButton>
            }
        </>
    )
}

export {CurrencyInput}