import { GoMakeModal, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { useQuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import { QuantityTypesComponent } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/quantity-types-component";
import { useRecoilValue } from "recoil";
import { productQuantityTypesValuesState } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  productSetQuantityState,
  productSetsParamState,
  productSetsUnitsState,
} from "@/store";

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
  const { t } = useTranslation();
  const { openModal, setOpenModal, productTypesNumber } =
    useQuantityParameter();
  const productSetsParam = useRecoilValue<string>(productSetsParamState);

  const isInputDisabled = productSetsParam === "true";
  return (
    <Stack direction={"row"}>
      <GomakeTextInput
        style={classes.textInputStyle}
        defaultValue={parameter.defaultValue}
        placeholder={parameter.name}
        value={index !== -1 ? temp[index].values : ""}
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
    </Stack>
  );
};

export { TypesParameter };
