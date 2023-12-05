import { useRecoilValue } from "recoil";
import { materialHeadersState } from "../../state";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";

const rowInputs = (state, currencies) => {
    const materialHeaders = useRecoilValue<{ key: string, value: string, inputType: number,values:[] }[]>(materialHeadersState);
    return materialHeaders.filter(header => header.key !== "Active").map((header)=>{
        switch ( EDataTypeEnum[header?.inputType]){
            case "CURRENCY":
                return {
                    name: "Currency",
                    label: "materials.inputs.currency",
                    type: "select",
                    placeholder: "materials.inputs.currency",
                    required: false,
                    parameterKey: "currency",
                    options: currencies.map(currency => ({
                        value: currency.value,
                        text: currency.label
                    })),
                    value: state?.parameterKey,
                    isValid: true,

                }
            case "ARRAY_INPUT":
                return {
                    name: "Unit price",
                    label: "materials.inputs.unitPrice",
                    type: "number",
                    placeholder: "materials.inputs.unitPrice",
                    required: false,
                    parameterKey: "unitPrice",
                    options: [],
                    value: state?.parameterKey,
                    isValid: true,
                }
            case "LIST":
                return {
                    name: header?.key,
                    label: header?.value,
                    type: "select",
                    placeholder: header?.key,
                    required: false,
                    parameterKey:header?.key,
                    options:header.values ? header.values.map(value => ({value:value,text:value}) ) : [],
                    value: "",
                    isValid: true,
                }
            default:
                return {
                    name: header?.key,
                    label: header?.value,
                    type: EDataTypeEnum[header?.inputType] == "BOOLEAN" ? "switch" : EDataTypeEnum[header?.inputType]?.toLowerCase(),
                    placeholder: header?.key,
                    required: false,
                    parameterKey: header?.key,
                    options: [],
                    value: EDataTypeEnum[header?.inputType] == "BOOLEAN" ? state[header?.key] : state?.header?.key,
                    isValid: true,
                }
        }
    });
};

export { rowInputs };