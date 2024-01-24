import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  productQuantityTypesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { IInput } from "@/components/form-inputs/interfaces";
import { useEffect, useMemo, useState } from "react";
import { productSetsParamState, subProductsParametersState } from "@/store";
import { getParameterByParameterId } from "@/utils/constants";

interface QuantityTypesInputs extends IInput {
  onChange: (key, value: string) => void;
  readonly?: boolean;
}
const useQuantityTypes = () => {
  const [state] = useRecoilState(productQuantityTypesState);
  const [save, setSave] = useState<boolean>(false);
  const [quantityState, setQuantityState] = useRecoilState(
    productQuantityTypesState
  );
  const [newTypesValue, setNewTypesValue] = useState("");
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );

  const updateTypesValues = (newValues) => {
    const updatedSubProducts = JSON.parse(JSON.stringify(subProducts));

    const typesParameter = updatedSubProducts[0]?.parameters.find(
      (param) => param.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"
    );

    if (typesParameter) {
      typesParameter.values = [newValues];
      setSubProducts(updatedSubProducts);
    }
  };
  const handleInputChange = (event, myvalue) => {
    const value = myvalue;
    setNewTypesValue(value);
    updateTypesValues(value);
  };
  const initialTypesValues = subProducts[0]?.parameters
    .find(
      (param) => param.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"
    )
    ?.values.join(", ");

  const resultParameter = getParameterByParameterId(
    subProducts,
    "4991945c-5e07-4773-8f11-2e3483b70b53"
  );
  useEffect(() => {
    if (resultParameter) {
      setQuantityState((state) => ({
        ...state,
        equalQuantity: Number(resultParameter?.values[0]),
      }));
    }
  }, [resultParameter]);

  const quantityTypesValues = useRecoilValue(
    tempProductQuantityTypesValuesState
  );
  const setValuesState = useSetRecoilState(tempProductQuantityTypesValuesState);
  const quantity = useMemo(() => {
    return quantityTypesValues
      .reduce((acc, val) => acc + val.quantity, 0)
      .toString();
  }, [quantityTypesValues]);
  const toggleDuplicateName = () => {
    setQuantityState((state) => ({
      ...state,
      duplicatedName: !state.duplicatedName,
    }));
  };
  const equalQuantityChange = (key: string, newValue: string) => {
    setQuantityState((state) => ({
      ...state,
      equalQuantity: +newValue,
    }));
    setValuesState((prevState) =>
      prevState.map((value) => ({ ...value, quantity: +newValue }))
    );
  };
  const inputs: QuantityTypesInputs[] = useMemo(() => {
    return [
      {
        name: "quantity",
        label: "quantityTypes.quantity",
        type: "number",
        placeholder: "quantityTypes.quantity",
        required: false,
        parameterKey: "quantity",
        value: quantity,
        options: [],
        isValid: true,
        onChange: () => {},
      },
      {
        name: "typeAmount",
        label: "quantityTypes.typeAmount",
        type: "number",
        placeholder: "quantityTypes.typeAmount",
        required: false,
        parameterKey: "typeAmount",
        // value: productTypesNumber.toString(),
        value: initialTypesValues,
        options: [],
        isValid: true,
        // readonly: true,
        onChange: handleInputChange,
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
        onChange: equalQuantityChange,
      },
    ];
  }, [quantityTypesValues, quantityState, quantity]);

  return {
    inputs,
    isDuplicateName: quantityState.duplicatedName,
    toggleDuplicateName,
    save,
    setSave,
  };
};

export { useQuantityTypes };
