import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { subProductsParametersState } from "@/store";
import {
  openQuantityComponentModalState,
  productQuantityTypesDuplicatedNameState,
  productQuantityTypesEqualQuantityState,
  productQuantityTypesValuesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";
import { getParameterByParameterId } from "@/utils/constants";
import cloneDeep from "lodash.clonedeep";

const useQuantityTypesTable = (save: boolean) => {
  const [, setQuantityTypes] = useRecoilState(productQuantityTypesValuesState);
  const [valuesState, setValuesState] = useRecoilState(
    tempProductQuantityTypesValuesState
  );
  const equalQuantity = useRecoilValue(productQuantityTypesEqualQuantityState);
  const isDuplicatedName = useRecoilValue(
    productQuantityTypesDuplicatedNameState
  );
  const setOpenModal = useSetRecoilState(openQuantityComponentModalState);
  const [subProducts,setSubProducts] = useRecoilState<any>(subProductsParametersState);

  const resultParameter = getParameterByParameterId(
    subProducts,
    "a330193f-492c-40a8-86f3-8edf5c8f0d5e"
  );

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
  // useEffect(() => {
  //   if (!!equalQuantity) {
  //     setValuesState((prevState) =>
  //       prevState.map((value) => ({ ...value, quantity: equalQuantity }))
  //     );
  //   }
  // }, [equalQuantity]);

  useEffect(() => {
    if (isDuplicatedName) {
      setValuesState((prevState) =>
        prevState.map((value, index) => ({
          ...value,
          name: resultParameter?.values[0] + " " + (index + 1),
        }))
      );
    }
  }, [isDuplicatedName, resultParameter]);

  return {
    values: valuesState,
    onQuantityTypeChange,
    canUpdateQuantity: !equalQuantity,
    canUpdateName: !isDuplicatedName,
  };
};

export { useQuantityTypesTable };
