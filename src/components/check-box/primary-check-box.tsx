import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { CheckIcon } from "./icons";

const UncheckedIcon = () => (
  <Box
    component="span"
    sx={{
      width: 20,
      height: 20,
      borderRadius: "6px",
      border: "1px solid #D0D5DD",
    }}
  />
);

const CheckedIcon = ({ color }: { color: string }) => (
  <Box
    component="span"
    sx={{
      width: 20,
      height: 20,
      borderRadius: "6px",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CheckIcon />
  </Box>
);

interface IProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  inputProps?: any;
}

const PrimaryCheckbox = ({
  checked,
  onChange,
  color = "#2E3092",
  inputProps,
}: IProps) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<UncheckedIcon />}
      checkedIcon={<CheckedIcon color={color} />}
      inputProps={inputProps}
      disableRipple
      sx={{
        color: color,
        "&.Mui-checked": {
          color: color,
        },
      }}
    />
  );
};

export { PrimaryCheckbox };
