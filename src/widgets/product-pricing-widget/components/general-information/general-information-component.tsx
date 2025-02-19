import { IOutput } from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import { ParametersMapping } from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { TableOutPutComponent } from "../table-output/table-output-component";
import { HtmlElementType, RuleType } from "../../enums";
import { Divider } from "@mui/material";
import { GeneralInformationDictionaryComponent } from "./general-information-dictionary-component";
import { _renderDeliveryDate } from "@/utils/helpers";

const GeneralInformationComponent = ({
  details,
  withTitle = true,
  actionName,
  details2,
}: {
  details: IOutput[];
  withTitle?: boolean;
  actionName?: string;
  details2?: any;
}) => {
  const { t } = useTranslation();
  const tableOutputs = details?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );
  let parameterOutputs = details?.filter(
    (parameter) =>
      parameter && parameter?.htmlElementType === HtmlElementType.TEXT
  );
  // if (selectedWorkFlow?.deliveryDate) {
  //   const newParameter = {
  //     name: t("home.headers.deliveryDate"),
  //     index: null,
  //     values: [_renderDeliveryDate(selectedWorkFlow?.deliveryDate)],
  //     outSourceValues: ["0"],
  //     rectangles: null,
  //     useableWasteRectangels: null,
  //     unuseableWasteRectangels: null,
  //     materialWidth: 0,
  //     materialLength: 0,
  //     unitType: 5,
  //     defaultUnit: "",
  //     id: "00000000-0000-0000-0000-000000000000",
  //     propertyType: 0,
  //     htmlElementType: HtmlElementType.TEXT,
  //     isEditable: false,
  //     displayInOutputId: null,
  //     tableHeaders: null,
  //     tableRows: null,
  //     orginalName: "Total time"
  //   };
  //   parameterOutputs = [...parameterOutputs, newParameter];
  // }

  return (
    <Stack gap={"10px"} flexWrap={"wrap"}>
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

      {details2 && (
        <GeneralInformationDictionaryComponent details2={details2} />
      )}
    </Stack>
  );
};

export { GeneralInformationComponent };
