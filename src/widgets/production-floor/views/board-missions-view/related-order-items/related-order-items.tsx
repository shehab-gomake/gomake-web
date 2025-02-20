import Stack from "@mui/material/Stack";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const RelatedOrderItemsComponent = ({
  relatedOrderItems,
}: {
  relatedOrderItems: any[];
}) => {
  const { neutralColor, primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  return (
    <Stack gap={"4px"}>
      {relatedOrderItems.map((orderItem, index) => (
        <Stack
          key={`order-item-${index}`}
          gap={"8px"}
          padding={"5px"}
          borderRadius={"8px"}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color={secondColor(500)}
          >
            {t("sales.quote.item") + " #" + (index + 1)}
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={"12px"}>
            {orderItem.parameters.map((parameter) => (
              <Stack
                key={parameter.id}
                direction="row"
                alignItems="center"
                gap={"4px"}
              >
                <Typography
                  style={{
                    ...FONT_FAMILY.Lexend(500, 14),
                    color: neutralColor(700),
                  }}
                >
                  {parameter.name}:
                </Typography>
                <Typography
                  style={{
                    ...FONT_FAMILY.Inter(500, 14),
                    color: primaryColor(900),
                  }}
                >
                  {parameter.values.join(", ")}
                </Typography>
              </Stack>
            ))}
          </Stack>
          {index < relatedOrderItems?.length - 1 && (
            <Divider style={{ backgroundColor: neutralColor(300) }} />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export { RelatedOrderItemsComponent };
