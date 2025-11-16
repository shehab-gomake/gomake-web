import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useStyle } from "@/components/button/style";
import { t } from "i18next";
import { PlusIcon } from "@/icons";

interface IProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}
const AddButtonOld = ({ label, onClick, style, className }: IProps) => {
  const { classes } = useStyle();
  return (
    <Button
      sx={{ ...classes.addBtn, ...style }}
      startIcon={<AddBoxOutlinedIcon />}
      variant={"contained"}
      onClick={onClick}
      className={className}
    >
      {label}
    </Button>
  );
};

const AddButton = ({ label, onClick, style, className }: IProps) => {
  const { classes, primaryColor } = useStyle();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  return (
    <Button
      sx={{
        ...classes.addButtonStyle,
        ...style,
        "& .MuiButton-startIcon": {
          ...(RTL
            ? { marginLeft: "4px", marginRight: 0 }
            : { marginRight: "4px", marginLeft: 0 }),
        },
      }}
      startIcon={<PlusIcon stroke={primaryColor(500)} />}
      onClick={onClick}
      className={className}
    >
      {label}
    </Button>
  );
};
export { AddButton };
