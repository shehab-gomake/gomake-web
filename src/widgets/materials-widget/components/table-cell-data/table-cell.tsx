import {IRowData} from "@/widgets/materials-widget/interface";
import {EDataTypeEnum} from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import {GoMakeAutoComplate, SecondSwitch} from "@/components";
import {CurrencyInput} from "@/widgets/materials-widget/components/table-cell-data/currency";
import {ArrayInput} from "@/widgets/materials-widget/components/table-cell-data/array-input";
import {NumberStringInput} from "@/widgets/materials-widget/components/table-cell-data/number-string-input";
import {useTableCellData} from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import {ImageInput} from "./image-input";
import { materialsMachinesState, openAddRowModalState } from "../../state";
import { MultiSelectInput } from "./multi-select-input";
import {SyntheticEvent} from "react";


const TableCellData = ({value, type, isEditable, parameterKey, id, values}: IRowData) => {
    const {updateCellData} = useTableCellData();

    const toggleIsActive = async () => {
        await updateCellData(id, parameterKey, !value)
    }
    const onSelectChange = async (event: SyntheticEvent, value) => {
        await updateCellData(id, parameterKey, value?.id);
    }
    switch (type) {
        case EDataTypeEnum.BOOLEAN:
            return <SecondSwitch checked={value} onChange={toggleIsActive} />
        case EDataTypeEnum.CURRENCY:
            return <CurrencyInput value={value as string} id={id} key={parameterKey} />
        case EDataTypeEnum.ARRAY_INPUT:
            return <ArrayInput valueArray={value as string[]} type={type} isEditable={isEditable} parameterKey={parameterKey} id={id} />
        case EDataTypeEnum.IMAGE:
            return <ImageInput parameterKey={parameterKey} id={id} value={value.toString()} />
        case EDataTypeEnum.LIST:
            return <div style={{minWidth: "80px"}}>
                <GoMakeAutoComplate onChange={onSelectChange} value={value}
                                    options={values ? values.map(inputValue => ({
                                        id: inputValue,
                                        label: inputValue
                                    })) : []}/>
            </div>
        case EDataTypeEnum.MACHINES_LIST:
            return <MultiSelectInput values={value as string[]} parameterKey={parameterKey} id={id} />
        default:
            return <NumberStringInput type={type} isEditable={isEditable} parameterKey={parameterKey} id={id} value={value} />
    }

}

export {TableCellData}