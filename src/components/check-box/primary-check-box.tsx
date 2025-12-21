import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { CheckIcon } from "./icons";

const UncheckedIcon = ({ disabled }: { disabled?: boolean }) => (
  <Box
    component="span"
    sx={{
      width: 20,
      height: 20,
      borderRadius: "6px",
      border: "1px solid #D0D5DD",
      backgroundColor: "transparent",
      opacity: disabled ? 0.5 : 1,
    }}
  />
);

const CheckedIcon = ({
  color,
  disabled,
}: {
  color: string;
  disabled?: boolean;
}) => (
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
      opacity: disabled ? 0.5 : 1,
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
  disabled?: boolean;
}

const PrimaryCheckbox = ({
  checked,
  onChange,
  color = "#2E3092",
  inputProps,
  disabled,
}: IProps) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<UncheckedIcon disabled={disabled} />}
      checkedIcon={<CheckedIcon color={color} disabled={disabled} />}
      inputProps={inputProps}
      disabled={disabled}
      disableRipple
      sx={{
        color: color,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        "&.Mui-checked": {
          color: color,
        },
        "&.Mui-disabled": {
          color: color,
          opacity: 0.5,
        },
      }}
    />
  );
};

export { PrimaryCheckbox };
