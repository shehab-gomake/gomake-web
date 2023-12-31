import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {productTypesNumberState} from "@/store";
import {
    IQuantityTypesValue,
    openQuantityComponentModalState,
    productQuantityTypesDuplicatedNameState,
    productQuantityTypesEqualQuantityState,
    productQuantityTypesState
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import {useEffect, useState} from "react";

const useQuantityTypesTable = (save: boolean) => {
    const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
    const [quantityTypes, setQuantityTypes] = useRecoilState(productQuantityTypesState);
    const [valuesState, setValuesState] = useState<IQuantityTypesValue[]>([]);
    const equalQuantity = useRecoilValue(productQuantityTypesEqualQuantityState);
    const isDuplicatedName = useRecoilValue(productQuantityTypesDuplicatedNameState);
    const setOpenModal = useSetRecoilState(openQuantityComponentModalState);

    useEffect(() => {
        let values = [...quantityTypes.values];
        if (values.length !== productTypesNumber) {
            for (let i = 1; i <= productTypesNumber; i++) {
                values.push({name: 'Name ' + i, quantity: 0})
            }
        }
        setValuesState(values)
    }, [productTypesNumber, quantityTypes]);

    useEffect(() => {
        if (save) {
            setQuantityTypes({
                ...quantityTypes,
                values: valuesState
            });
            setOpenModal(false)
        }
    }, [save])

    const onQuantityTypeChange = (index: number, key: 'quantity' | 'name', newValue: number | string) => {
        const v = [...valuesState];
        v[index] = {
            ...v[index],
            [key]: newValue
        }
        setValuesState(v);
    }

    useEffect(() => {
        console.log(quantityTypes.values)
    }, [quantityTypes])
    useEffect(() => {
        if (!!equalQuantity) {
            setValuesState((prevState) => prevState.map(value => ({...value, quantity: equalQuantity})))
        }
    }, [equalQuantity])

    useEffect(() => {
        if (isDuplicatedName) {
            setValuesState((prevState) => prevState.map((value, index) => ({...value, name: 'Name ' + (index + 1)})))
        }
    }, [isDuplicatedName])

    return {
        values: valuesState,
        onQuantityTypeChange,
        canUpdateQuantity: !equalQuantity,
        canUpdateName: !isDuplicatedName
    }
}

export {useQuantityTypesTable}