import { useRecoilValue } from "recoil";
import { materialHeadersState } from "../../state";
import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";

const rowInputs = (state, currencies) => {
    const materialHeaders = useRecoilValue<{ key: string, value: string, inputType: number }[]>(materialHeadersState);

    return materialHeaders.filter(header => header.key !== "Active").map((header) => (
        
        EDataTypeEnum[header?.inputType] == "CURRENCY" ?
            {
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

            } : EDataTypeEnum[header?.inputType] == "ARRAY_INPUT" ?
                {
                    name: "Unit price",
                    label: "materials.inputs.unitPrice",
                    type: "number",
                    placeholder: "materials.inputs.unitPrice",
                    required: false,
                    parameterKey: "unitPrice",
                    options: [],
                    value: state?.parameterKey,
                    isValid: true,
                } :
                {
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
    ));
};

export { rowInputs };