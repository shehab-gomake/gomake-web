import { IRowData } from "@/widgets/materials-widget/interface";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import { SecondSwitch } from "@/components";
import { CurrencyInput } from "@/widgets/materials-widget/components/table-cell-data/currency";
import { ArrayInput } from "@/widgets/materials-widget/components/table-cell-data/array-input";
import { NumberStringInput } from "@/widgets/materials-widget/components/table-cell-data/number-string-input";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { ImageInput } from "./image-input";
import { materialsMachinesState, openAddRowModalState } from "../../state";
import { MultiSelectInput } from "./multi-select-input";


const TableCellData = ({ value, type, isEditable, parameterKey, id }: IRowData) => {
    const { updateCellData } = useTableCellData();

    const toggleIsActive = async () => {
        await updateCellData(id, parameterKey, !value)
    }

    return type === EDataTypeEnum.BOOLEAN ? <SecondSwitch checked={value} onChange={toggleIsActive} /> :
        type === EDataTypeEnum.CURRENCY ? <CurrencyInput value={value as string} id={id} key={parameterKey} /> :
            type === EDataTypeEnum.ARRAY_INPUT ?
                <ArrayInput valueArray={value as string[]} type={type} isEditable={isEditable} parameterKey={parameterKey} id={id} /> :
                type === EDataTypeEnum.MACHINES_LIST ?
                    <MultiSelectInput values={value as string[]} parameterKey={parameterKey} id={id} /> :
                    type === EDataTypeEnum.IMAGE ?
                        <ImageInput parameterKey={parameterKey} id={id} value={value.toString()} /> :
                        <NumberStringInput type={type} isEditable={isEditable} parameterKey={parameterKey} id={id} value={value} />
}

export { TableCellData }