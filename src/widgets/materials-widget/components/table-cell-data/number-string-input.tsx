import {IRowData} from "@/widgets/materials-widget/interface";
import { useCallback, useState} from "react";
import {useTableCellData} from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import {UpdateValueInput} from "@/components/text-input/update-value-input";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/materials-widget/style";


const NumberStringInput = ({value, isEditable, parameterKey, id}: IRowData) => {
    const {classes} = useStyle();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [updateValue, setUpdateValue] = useState('');
    const {updateCellData} = useTableCellData();
    const onClick = () => {
        if (isEditable) {
            setIsUpdate(true);
            setUpdateValue(value as string);
        }
    }
    const onInputChange = (v: string) => {
        setUpdateValue(v)
    }

    const onBlur = () => {
        if (updateValue !== value) {
            updateCellData(id, parameterKey, updateValue).then();
        }
        setIsUpdate(false);
    }

    const onClickOut = useCallback(() => {
        return onBlur
    }, [updateValue])

    return (
        isUpdate ? <UpdateValueInput clickedOut={onClickOut()} onInputChange={onInputChange} value={updateValue as string} onUpdate={onBlur}
                                  onCancel={() => setIsUpdate(false)}/> :
            isEditable ? <PrimaryButton sx={classes.clickableData} onClick={onClick} variant={'text'}>{value}</PrimaryButton> :  <span>{value}</span>
    )
}

export {NumberStringInput}