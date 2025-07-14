import { Stack, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { FONT_FAMILY } from "@/utils/font-family";

const GoMakeInputLabel = ({
  label,
  required,
  note,
  style,
  labelStyle,
}: {
  label: string;
  required?: boolean;
  note?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <span style={{ ...FONT_FAMILY.Lexend(500, 14), ...labelStyle }}>
          {label}
        </span>
        {required && <span style={{ color: "red" }}>*</span>}
        {note && (
          <Tooltip title={note}>
            <HelpOutlineRoundedIcon fontSize="small" color="action" />
          </Tooltip>
        )}
      </Stack>
    </div>
  );
};

export { GoMakeInputLabel };
