import { useRef, FC } from "react";
import { TextField, TextFieldProps } from "@mui/material";

const TimeTextField: FC<TextFieldProps> = (props) => {
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenTimePicker = () => {
    if (timeInputRef.current) {
      timeInputRef.current.showPicker(); // Opens the native time picker
    }
  };

  return (
    <TextField
      {...props}
      inputRef={timeInputRef}
      onClick={handleOpenTimePicker}
      sx={{
        borderRadius: "8px",
        height: "40px",
        cursor: "pointer",
        ...props?.sx,
        "& .MuiOutlinedInput-root": {
          height: "100%",
          "& input": {
            padding: "0 14px",
          },
        },
      }}
    />
  );
};

export { TimeTextField };
