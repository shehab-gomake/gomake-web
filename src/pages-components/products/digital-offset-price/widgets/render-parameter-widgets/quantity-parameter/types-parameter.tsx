import { GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { useQuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  productQuantityTypesValuesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";
import { productSetsParamState, subProductsParametersState } from "@/store";
import { getParameterByParameterId } from "@/utils/constants";

const TypesParameter = ({
  classes,
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  type,
}) => {
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const { productTypesNumber } = useQuantityParameter();
  const productSetsParam = useRecoilValue<string>(productSetsParamState);
  const [quantityTypes, setQuantityTypes] = useRecoilState(productQuantityTypesValuesState);
  const [valuesState, setValuesState] = useRecoilState(tempProductQuantityTypesValuesState);
  const resultParameter = getParameterByParameterId(
    subProducts,
    "a330193f-492c-40a8-86f3-8edf5c8f0d5e"
  );
  const quantity = getParameterByParameterId(
    subProducts,
    "4991945c-5e07-4773-8f11-2e3483b70b53"
  );
  const isInputDisabled = productSetsParam === "true";
  useEffect(() => {
    setValuesState((prevState) =>
      prevState.map((value, index) => ({
        ...value,
        name: resultParameter?.values[0] + " " + (index + 1),
      }))
    );
  }, [resultParameter]);
  useEffect(() => {
    const quantityValue = quantity && quantity.values ? quantity?.values[0] : 0;
    if (quantityTypes.length === Number(productTypesNumber)) {
      setValuesState(quantityTypes);
      setQuantityTypes(quantityTypes);
    } else if (quantityTypes.length < productTypesNumber) {
      const array = [];
      for (let i = quantityTypes.length + 1; i <= productTypesNumber; i++) {
        array.push({
          name: resultParameter?.values[0] + " " + i,
          quantity: Number(quantityValue),
        });
        setValuesState([...quantityTypes, ...array]);
        setQuantityTypes([...quantityTypes, ...array]);
      }
    } else if (quantityTypes.length > productTypesNumber) {
      setValuesState(quantityTypes.slice(0, productTypesNumber));
      setQuantityTypes(quantityTypes.slice(0, productTypesNumber));
    }
  }, [productTypesNumber, quantityTypes, quantity]);
  // useEffect(() => {
  //   if (productSetsParam === "true") {
  //     onChangeSubProductsForPrice(
  //       parameter?.id,
  //       subSection?.id,
  //       section?.id,
  //       parameter?.parameterType,
  //       parameter?.name,
  //       parameter?.actionId,
  //       { values: "1" },
  //       subSection?.type,
  //       index,
  //       parameter?.actionIndex
  //     );
  //   }
  // }, [productSetsParam]);
  return (
    <Stack direction={"row"}>
      <GomakeTextInput
        style={classes.textInputStyle}
        defaultValue={parameter.defaultValue}
        placeholder={parameter.name}
        value={
          productSetsParam === "true"
            ? 1
            : index !== -1
              ? temp[index].values
              : ""
        }
        disabled={isInputDisabled}
        onChange={(e: any) => {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { values: e.target.value },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
          setQuantityTypes(valuesState);
        }}
        type={type}
      />
    </Stack>
  );
};

export { TypesParameter };
