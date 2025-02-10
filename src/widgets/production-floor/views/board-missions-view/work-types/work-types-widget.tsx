import { Box, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

interface WorkType {
  name: string;
  quantity: number;
}

interface WorkTypesWidgetProps {
  types: WorkType[];
}

const WorkTypesWidget = ({ types }: WorkTypesWidgetProps) => {
  const { primaryColor } = useGomakeTheme();

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      {types.map((type, index) => (
        <Typography key={index}>
          <span
            style={{
              color: "black",
              ...FONT_FAMILY.Inter(600, 14),
              textTransform: "capitalize",
            }}
          >
            {type.name}
          </span>
          :{" "}
          <span
            style={{
              color: primaryColor(500),
              ...FONT_FAMILY.Inter(600, 14),
            }}
          >
            {type.quantity}
          </span>
        </Typography>
      ))}
    </Box>
  );
};

export default WorkTypesWidget;
