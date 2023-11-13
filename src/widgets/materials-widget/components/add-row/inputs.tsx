import { useRecoilValue } from "recoil";
import { materialHeadersState } from "../../state";
import {EDataTypeEnum} from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";

const rowInputs = (state) => {
    const materialHeaders = useRecoilValue<{ key: string, value: string ,inputType:number }[]>(materialHeadersState);

    return materialHeaders.map((header, index) => ({
        name: `${index + 1}`,
        label: header?.key,
        type: EDataTypeEnum[header?.inputType] == "BOOLEAN" ? "switch" : EDataTypeEnum[header?.inputType],
        placeholder: header?.key,
        required: false,
        parameterKey: header?.key,
        options: [],
        value: state?.parameterKey,
        isValid: true,
        direction: EDataTypeEnum[header?.inputType] == "BOOLEAN" && "row"

    }));
};


export {rowInputs };