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
import { getParameterByParameterCode } from "@/utils/constants";

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

  const resultParameter = getParameterByParameterCode(
    subProducts,
    "JobName"
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
