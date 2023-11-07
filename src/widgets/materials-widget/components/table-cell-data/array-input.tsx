import {IRowData} from "@/widgets/materials-widget/interface";
import {useState} from "react";
import Stack from "@mui/material/Stack";
import {useTableCellData} from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import {UpdateValueInput} from "@/components/text-input/update-value-input";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/materials-widget/style";

const ArrayInput = ({valueArray, isEditable, parameterKey, id}: IRowData) => {
    const {classes} = useStyle();
    const [isUpdate, setIsUpdate] = useState<number | null>(null);
    const [updateValue, setUpdateValue] = useState('');
    const {updateCellData} = useTableCellData()
    const onClick = (index) => {
        if (isEditable) {
            setIsUpdate(index);
            setUpdateValue(valueArray[index])
        }
    }

    const onInputChange = (v: string) => {
        setUpdateValue(v)
    }


    const onBlur = async () => {
        if (updateValue !== valueArray[isUpdate]) {
            await updateCellData(id, parameterKey, updateValue, isUpdate);
        }
        setIsUpdate(null);
    }
    return (
        <Stack direction={'row'} justifyContent={'center'} gap={'2px'} alignItems={'center'}>
            {
                valueArray?.flatMap((value, index, array) => {
                    if (index < array.length - 1) {
                        return [
                            isUpdate === index ?
                                <UpdateValueInput clickedOut={()=>onBlur().then()} onInputChange={onInputChange} onCancel={() => setIsUpdate(null)}
                                                  onUpdate={() => onBlur().then()} value={updateValue}/> :
                                <PrimaryButton sx={classes.clickableData} onClick={() => onClick(index)} variant={'text'}>{value}</PrimaryButton>,
                            <span>/</span>
                        ];
                    } else {
                        return [isUpdate === index ?
                            <UpdateValueInput clickedOut={onBlur} onInputChange={onInputChange} onUpdate={onBlur}
                                              onCancel={() => setIsUpdate(null)} value={updateValue}/> :
                            <PrimaryButton sx={classes.clickableData} onClick={() => onClick(index)} variant={'text'}>{value}</PrimaryButton>,

                        ];
                    }
                })
            }
        </Stack>
    );
}

export {ArrayInput}

