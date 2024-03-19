import { useRecoilState, useRecoilValue,  } from "recoil";
import {
  openQuantityComponentModalState,
  productQuantityTypesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { IInput } from "@/components/form-inputs/interfaces";
import { useEffect, useMemo, useState } from "react";
import { subProductsParametersState } from "@/store";
import { getParameterByParameterCode } from "@/utils/constants";

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

  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const initialTypesValues = subProducts[0]?.parameters
    .find(
      (param) => param.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"
    )
    ?.values.join(", ");
  const [newTypesValue, setNewTypesValue] = useState(initialTypesValues);

  const JobNameParameter = getParameterByParameterCode(subProducts,"JobName");
  const quantityParameter = getParameterByParameterCode(subProducts,"quantity");
  const [openModal, setOpenModal] = useRecoilState<boolean>(openQuantityComponentModalState);
  const updateTypesValues = (newValues) => {
    const updatedSubProducts = JSON.parse(JSON.stringify(subProducts));
    const typesParameter = updatedSubProducts[0]?.parameters.find(
      (param) => param.parameterCode === "types"
    );

    if (typesParameter) {
      typesParameter.values = [newValues];
      setSubProducts(updatedSubProducts);
    }
    setOpenModal(false)
  };
  const handleInputChange = (event, myvalue) => {
    const value = myvalue;
    setNewTypesValue(value);
    if (quantityTypesValues.length === Number(myvalue)) {
      setValuesState(quantityTypesValues);
    } else if (quantityTypesValues.length < Number(myvalue)) {
      const array = [];
      for (let i = quantityTypesValues.length + 1; i <= Number(myvalue); i++) {
        array.push({
          name: JobNameParameter?.values[0] + " " + i,
          quantity: +valueState[0]?.quantity,
        });
        setValuesState([...quantityTypesValues, ...array]);
      }
    } else if (quantityTypesValues.length > Number(myvalue)) {
      setValuesState(quantityTypesValues.slice(0, Number(myvalue)));
    }
  };
  useEffect(() => {
    if (save) {
      updateTypesValues(newTypesValue);
    }
  }, [save, newTypesValue]);

  const resultParameter = getParameterByParameterCode(
    subProducts,
    "quantity"
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
  const [valueState,setValuesState] = useRecoilState(tempProductQuantityTypesValuesState);
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
        readonly: true,
        
      },
      {
        name: "typeAmount",
        label: "quantityTypes.typeAmount",
        type: "number",
        placeholder: "quantityTypes.typeAmount",
        required: false,
        parameterKey: "typeAmount",
        value: newTypesValue,
        options: [],
        isValid: true,
        onChange: handleInputChange,
      },
      {
        name: "equalQuantity",
        label: "quantityTypes.equalQuantity",
        type: "number",
        placeholder: "quantityTypes.equalQuantity",
        required: false,
        parameterKey: "equalQuantity",
        value: valueState[0]?.quantity?.toString(),
        options: [],
        isValid: true,
        onChange: equalQuantityChange,
      },
    ];
  }, [quantityTypesValues, quantityState, quantity, newTypesValue]);

  return {
    inputs,
    isDuplicateName: quantityState.duplicatedName,
    toggleDuplicateName,
    save,
    setSave,
  };
};

export { useQuantityTypes };
