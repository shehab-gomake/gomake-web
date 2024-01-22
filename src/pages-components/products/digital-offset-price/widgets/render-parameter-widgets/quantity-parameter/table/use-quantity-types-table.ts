import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productTypesNumberState, subProductsParametersState } from "@/store";
import {
  openQuantityComponentModalState,
  productQuantityTypesDuplicatedNameState,
  productQuantityTypesEqualQuantityState,
  productQuantityTypesValuesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";

const useQuantityTypesTable = (save: boolean) => {
  const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
  const [quantityTypes, setQuantityTypes] = useRecoilState(
    productQuantityTypesValuesState
  );
  const [valuesState, setValuesState] = useRecoilState(
    tempProductQuantityTypesValuesState
  );
  const equalQuantity = useRecoilValue(productQuantityTypesEqualQuantityState);
  const isDuplicatedName = useRecoilValue(
    productQuantityTypesDuplicatedNameState
  );
  const setOpenModal = useSetRecoilState(openQuantityComponentModalState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  function getParameterByParameterName(subProductArray, paramId) {
    for (let i = 0; i < subProductArray.length; i++) {
      const parameters = subProductArray[i].parameters;
      for (let j = 0; j < parameters.length; j++) {
        if (parameters[j].parameterId === paramId) {
          return parameters[j];
        }
      }
    }
    return null; // Return null if not found
  }
  const resultParameter = getParameterByParameterName(
    subProducts,
    "a330193f-492c-40a8-86f3-8edf5c8f0d5e"
  );
  useEffect(() => {
    if (quantityTypes.length === productTypesNumber) {
      setValuesState(quantityTypes);
    } else if (quantityTypes.length < productTypesNumber) {
      const array = [];
      for (let i = quantityTypes.length + 1; i <= productTypesNumber; i++) {
        array.push({ name: resultParameter?.values[0] + " " + i, quantity: 0 });
        setValuesState([...quantityTypes, ...array]);
      }
    } else if (quantityTypes.length > productTypesNumber) {
      setValuesState(quantityTypes.slice(0, productTypesNumber));
    }
  }, [productTypesNumber, quantityTypes]);

  useEffect(() => {
    if (save) {
      setQuantityTypes(valuesState);
      setOpenModal(false);
    }
  }, [save]);

  const onQuantityTypeChange = (
    index: number,
    key: "quantity" | "name",
    newValue: number | string
  ) => {
    const v = [...valuesState];
    v[index] = {
      ...v[index],
      [key]: newValue,
    };
    setValuesState(v);
  };

  useEffect(() => {
    console.log("valuesState", {
      valuesState,
      productTypesNumber,
      quantityTypes,
      subProducts,
      resultParameter,
    });
  }, [valuesState, quantityTypes, resultParameter]);
  useEffect(() => {
    if (!!equalQuantity) {
      setValuesState((prevState) =>
        prevState.map((value) => ({ ...value, quantity: equalQuantity }))
      );
    }
  }, [equalQuantity]);

  useEffect(() => {
    if (isDuplicatedName) {
      setValuesState((prevState) =>
        prevState.map((value, index) => ({
          ...value,
          name: resultParameter?.values[0] + " " + (index + 1),
        }))
      );
    }
  }, [isDuplicatedName]);

  return {
    values: valuesState,
    onQuantityTypeChange,
    canUpdateQuantity: !equalQuantity,
    canUpdateName: !isDuplicatedName,
  };
};

export { useQuantityTypesTable };
