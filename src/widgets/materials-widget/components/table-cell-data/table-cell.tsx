import { IRowData } from "@/widgets/materials-widget/interface";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";
import { SecondSwitch } from "@/components";
import { CurrencyInput } from "@/widgets/materials-widget/components/table-cell-data/currency";
import { ArrayInput } from "@/widgets/materials-widget/components/table-cell-data/array-input";
import { NumberStringInput } from "@/widgets/materials-widget/components/table-cell-data/number-string-input";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { ImageInput } from "./image-input";
import { MultiSelectInput } from "./multi-select-input";
import { SelectInput } from "./select-input";

const TableCellData = ({ value, type, isEditable, parameterKey, id, values }: IRowData) => {
    const { updateCellData } = useTableCellData();

    const toggleIsActive = async () => {
        await updateCellData(id, parameterKey, !value)
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
            return <SelectInput values={values} parameterKey={parameterKey} id={id} value={value as string} />
        case EDataTypeEnum.MACHINES_LIST:
            return <MultiSelectInput values={value as string[]} parameterKey={parameterKey} id={id} />
        default:
            return <NumberStringInput type={type} isEditable={isEditable} parameterKey={parameterKey} id={id} value={value} />
    }

}

export { TableCellData }