import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Divider } from "@mui/material";

const RelatedOrderItemsComponent = ({
  relatedOrderItems
}: {
  relatedOrderItems: any[];
}) => {
  const { t } = useTranslation();
  const { neutralColor, primaryColor } = useGomakeTheme();

  return (
    <Stack gap={"10px"} flexWrap={"wrap"}>
      {
        relatedOrderItems.map((orderItem, index) => (
          <Stack key={`order-item-${index}`} direction={'row'} gap={'16px'} alignItems="center">
            {
              orderItem.parameters.map((parameter, paramIndex) => {
                const isLastParameter = paramIndex === orderItem.parameters.length - 1;
                return (
                  <>
                    <span style={{
                      ...FONT_FAMILY.Lexend(500, 14),
                      color: neutralColor(500),
                      width: "max-content"
                    }}>{parameter.name}</span>
                    <span key={parameter.defaultUnit} style={{
                      ...FONT_FAMILY.Inter(500, 14),
                      color: primaryColor(900),
                      width: "max-content"
                    }}>
                      {parameter.values.join(', ')} {!!parameter.defaultUnit ? parameter.defaultUnit : ''}
                    </span>
                    {!isLastParameter && (
                      <Divider key={`divider-${parameter}`} orientation="vertical" flexItem />
                    )}
                  </>
                );
              })
            }
          </Stack>
        ))
      }
    </Stack>
  );
};

export { RelatedOrderItemsComponent };