import { GoMakeModal, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { useQuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import { QuantityTypesComponent } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/quantity-types-component";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  productQuantityTypesValuesState,
  tempProductQuantityTypesValuesState,
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  productSetQuantityState,
  productSetsParamState,
  productSetsUnitsState,
} from "@/store";

const QuantityParameter = ({
  classes,
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  type,
}) => {
  const { t } = useTranslation();
  const { openModal, setOpenModal, productTypesNumber } =
    useQuantityParameter();

  const productSetsParam = useRecoilValue<string>(productSetsParamState);
  const productSetQuantityParam = useRecoilValue<number>(
    productSetQuantityState
  );
  const productSetUnitsParam = useRecoilValue<number>(productSetsUnitsState);
  const [quantityTypes, setQuantityTypes] = useRecoilState(
    productQuantityTypesValuesState
  );
  const valuesState = useRecoilValue(tempProductQuantityTypesValuesState);
  useEffect(() => {
    if (productSetsParam === "true") {
      onChangeSubProductsForPrice(
        parameter?.id,
        subSection?.id,
        section?.id,
        parameter?.parameterType,
        parameter?.name,
        parameter?.actionId,
        {
          values: (productSetUnitsParam * productSetQuantityParam).toString(),
        },
        subSection?.type,
        index,
        parameter?.actionIndex
      );
    } else if (productSetsParam != "true") {
      onChangeSubProductsForPrice(
        parameter?.id,
        subSection?.id,
        section?.id,
        parameter?.parameterType,
        parameter?.name,
        parameter?.actionId,
        {
          values: parameter.defaultValue,
        },
        subSection?.type,
        index,
        parameter?.actionIndex
      );
    }
  }, [
    quantityTypes,
    productSetsParam,
    productSetUnitsParam,
    productSetQuantityParam,
  ]);
  const isInputDisabled = productTypesNumber > 1 || productSetsParam === "true";
  return (
    <Stack direction={"row"}>
      <GomakeTextInput
        style={classes.textInputStyle}
        defaultValue={parameter.defaultValue}
        placeholder={parameter.name}
        value={
          quantityTypes.length > 1 && productSetsParam !== "true"
            ? quantityTypes
                .reduce((acc, val) => acc + val.quantity, 0)
                .toString()
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
            parameter?.actionIndex
          );
        }}
        type={type}
      />
      {productTypesNumber > 1 && productSetsParam != "true" && (
        <IconButton
          onClick={() => {
            setOpenModal(true);
            setQuantityTypes(valuesState);
          }}
        >
          <SettingsIcon
            stroke={"rgba(237, 2, 140, 1)"}
            width={24}
            height={24}
          />
        </IconButton>
      )}
      <GoMakeModal
        insideStyle={{
          width: 420,
          height: 680,
        }}
        modalTitle={t("quantityTypes.title")}
        openModal={openModal}
        onClose={() => setOpenModal(false)}
      >
        <QuantityTypesComponent />
      </GoMakeModal>
    </Stack>
  );
};

export { QuantityParameter };
