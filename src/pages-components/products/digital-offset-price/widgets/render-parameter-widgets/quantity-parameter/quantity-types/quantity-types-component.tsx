import Stack from "@mui/material/Stack";
import { useQuantityTypes } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/use-quantity-types";
import { FormInput } from "@/components/form-inputs/form-input";
import { PrimarySwitch } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { QuantityTypesTable } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/table/quantity-types-table";

interface IQuantityTypesComponent { }
const QuantityTypesComponent = ({ subSection, section }) => {
  const { inputs, isDuplicateName, toggleDuplicateName, save, setSave } =
    useQuantityTypes({ subSection, section });
  const { t } = useTranslation();
  const { classes } = useStyle();
  return (
    <Stack direction={"column"} height={"100%"} gap={"7px"}>
      <Stack direction={"row"} gap={"20%"} flexWrap={"wrap"}>
        {inputs.map((input) => (
          <Stack width={"30%"} paddingTop={"10px"} paddingBottom={"10px"}>
            <FormInput
              readonly={!!input.readonly}
              input={input}
              changeState={input.onChange}
              error={false}
            />
          </Stack>
        ))}
      </Stack>
      <Stack direction={"row"} alignItems={"center"} padding={"10px 0"}>
        <PrimarySwitch
          checked={isDuplicateName}
          onChange={toggleDuplicateName}
        />
        <span style={classes.duplicateName}>{t("sales.quote.duplicateName")}</span>
      </Stack>
      <Stack padding={"0 2px"}>
        <QuantityTypesTable onSave={() => { }} save={save} />
      </Stack>
      <Stack marginTop={"auto"} style={{ backgroundColor: "white" }}>
        <SecondaryButton
          onClick={() => {
            setSave(true);
          }}
          style={{ width: "100%" }}
          variant={"contained"}
        >
          {t("sales.quote.save")}
        </SecondaryButton>
      </Stack>
    </Stack>
  );
};

export { QuantityTypesComponent };
