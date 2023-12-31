import {useRecoilState, useRecoilValue} from "recoil";
import {
    productQuantityTypesState
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import {IInput} from "@/components/form-inputs/interfaces";
import {useState} from "react";
import {productTypesNumberState} from "@/store";

interface QuantityTypesInputs extends IInput{
    onChange: (key, value: string) => void;
    readonly?: boolean;
}
const useQuantityTypes = () => {
    const [state] = useRecoilState(productQuantityTypesState);
    const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
    const [save, setSave] = useState<boolean>(false);
    const [quantityState, setQuantityState] = useRecoilState(productQuantityTypesState);

    const toggleDuplicateName = () => {
        setQuantityState((state) => ({
            ...state,
            duplicatedName: !state.duplicatedName
        }));
    }
    const equalQuantityChange = (key: string, newValue: string) => {
        setQuantityState((state) =>({
            ...state,
            equalQuantity: +newValue,
        }))
    }
    const inputs: QuantityTypesInputs[] = [
        {
            name: "quantity",
            label: "quantityTypes.quantity",
            type: "number",
            placeholder: "quantityTypes.quantity",
            required: false,
            parameterKey: "quantity",
            value: state.quantity?.toString(),
            options: [],
            isValid: true,
            onChange: () => {}
        },
        {
            name: "typeAmount",
            label: "quantityTypes.typeAmount",
            type: "number",
            placeholder: "quantityTypes.typeAmount",
            required: false,
            parameterKey: "typeAmount",
            value: productTypesNumber.toString(),
            options: [],
            isValid: true,
            readonly: true,
            onChange: () => {}
        },
        {
            name: "equalQuantity",
            label: "quantityTypes.equalQuantity",
            type: "number",
            placeholder: "quantityTypes.equalQuantity",
            required: false,
            parameterKey: "equalQuantity",
            value: state.equalQuantity?.toString(),
            options: [],
            isValid: true,
            onChange: equalQuantityChange
        },
    ];


    return {
        inputs,
        isDuplicateName: quantityState.duplicatedName,
        toggleDuplicateName,
        save,
        setSave
    }
}

export {useQuantityTypes}