import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useStyle } from "@/components/button/style";

interface IProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}
const AddButton = ({ label, onClick, style, className }: IProps) => {
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

export { AddButton };
