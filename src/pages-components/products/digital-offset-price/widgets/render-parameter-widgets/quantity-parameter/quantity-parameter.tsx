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
  productSetsParamState,
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
  const [quantityTypes, setQuantityTypes] = useRecoilState(
    productQuantityTypesValuesState
  );
  const valuesState = useRecoilValue(tempProductQuantityTypesValuesState);

  const isInputDisabled = productTypesNumber > 1 || productSetsParam === "true";
  return (
    <Stack direction={"row"}>
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
