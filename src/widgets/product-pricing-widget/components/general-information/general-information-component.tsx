import { IOutput } from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import { ParametersMapping } from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

const GeneralInformationComponent = ({
  details,
  withTitle = true,
  actionName,
}: {
  details: IOutput[];
  withTitle?: boolean;
  actionName?: string;
}) => {
  const { t } = useTranslation();
  return (
    <Stack gap={"10px"}>
      {withTitle && <h3>{t("pricingWidget.generalInformation")}</h3>}

      <Stack direction={"row"} gap={"16px"} flexWrap={"wrap"}>
        {actionName && (
          <span style={{ color: "#101828", ...FONT_FAMILY.Lexend(600, 18) }}>
            {actionName}
          </span>
        )}
        <ParametersMapping parameters={details} />
      </Stack>
    </Stack>
  );
};

export { GeneralInformationComponent };
