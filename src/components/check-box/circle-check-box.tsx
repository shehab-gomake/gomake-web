import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";

const UncheckedIcon = () => (
  <Box
    component="span"
    sx={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      border: "1px solid grey",
    }}
  />
);

const CheckedIcon = ({ color }: { color: string }) => (
  <Box
    component="span"
    sx={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        backgroundColor: "#FFFFFF",
        borderRadius: "50%",
      }}
    />
  </Box>
);

interface IProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color?: string;
}

const CircleCheckbox = ({ checked, onChange, color = "var(--theme-primary-color, #2E3092)" }: IProps) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<UncheckedIcon />}
      checkedIcon={<CheckedIcon color={color} />}
      sx={{
        color: color,
        "&.Mui-checked": {
          color: color,
        },
      }}
    />
  );
};

export { CircleCheckbox };
