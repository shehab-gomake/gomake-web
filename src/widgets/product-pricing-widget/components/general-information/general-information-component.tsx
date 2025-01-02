import { IOutput } from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import { ParametersMapping } from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { TableOutPutComponent } from "../table-output/table-output-component";
import { HtmlElementType, RuleType } from "../../enums";
import { Divider } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GeneralInformationDictionaryComponent } from "./general-information-dictionary-component";

const GeneralInformationComponent = ({
  details,
  withTitle = true,
  actionName,
  details2
}: {
  details: IOutput[];
  withTitle?: boolean;
  actionName?: string;
  details2?: any;
}) => {
  const { t } = useTranslation();
  const { neutralColor, primaryColor } = useGomakeTheme();
  const tableOutputs = details?.filter(
    (parameter) =>
      parameter && parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );
  const parameterOutputs = details?.filter(
    (parameter) =>
      parameter && parameter?.htmlElementType === HtmlElementType.TEXT
  );
  return (
    <Stack gap={"10px"}>
      {withTitle && <h3>{t("pricingWidget.generalInformation")}</h3>}

      <Stack direction={"row"} gap={"16px"} flexWrap={"wrap"}>
        {actionName && (
          <span style={{ color: "#101828", ...FONT_FAMILY.Lexend(600, 18) }}>
            {actionName}
          </span>
        )}
        <ParametersMapping parameters={parameterOutputs} />
        <Divider orientation={"vertical"} flexItem />
        {tableOutputs?.map((parameter) => (
          <TableOutPutComponent {...parameter} />
        ))}
      </Stack>

      {details2 && <GeneralInformationDictionaryComponent details2={details2} />}
    </Stack>
  );
};

export { GeneralInformationComponent };
