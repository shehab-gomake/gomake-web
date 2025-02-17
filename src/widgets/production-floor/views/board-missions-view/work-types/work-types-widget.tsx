import { Stack } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

interface WorkType {
  name: string;
  quantity: number;
}

interface WorkTypesWidgetProps {
  types: WorkType[];
}

const WorkTypesWidget = ({ types }: WorkTypesWidgetProps) => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  return (
    <Stack
      style={{
        direction: dir,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {types.map((type, index) => (
        <Stack
          key={index}
          style={{
            direction: dir,
            display: "flex",
            flexDirection: "row",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "black",
              ...FONT_FAMILY.Inter(600, 14),
              textTransform: "capitalize",
            }}
          >
            {type.name}
          </span>
          <span>:</span>
          <span
            style={{
              color: primaryColor(500),
              ...FONT_FAMILY.Inter(600, 14),
            }}
          >
            {type.quantity}
          </span>
        </Stack>
      ))}
    </Stack>
  );
};

export default WorkTypesWidget;
