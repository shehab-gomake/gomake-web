import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { FONT_FAMILY } from "@/utils/font-family";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import { ReactNode } from "react";
import { EWorkSource } from "@/widgets/product-pricing-widget/enums";

/*interface ISelectProps extends SelectProps{
    options: { value: EWorkSource, label: string }[];
    onSelectWorkSource: (source: EWorkSource) => void
}*/

const StyledInput = styled(InputBase)(({ theme }) => {
  return {
    "& .MuiInputBase-input": {
      borderRadius: "var(--theme-select-border-radius, 16px)",
      position: "relative",
      backgroundColor: "var(--theme-select-bg, #F4F3FF)",
      width: "fit-content",
      fontSize: "var(--theme-select-font-size, 16px)",
      padding: "6px 26px 6px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      ...FONT_FAMILY.Lexend(500, 14),
      color:
        "var(--theme-select-text-color, var(--theme-primary-color, #5925DC))",
      "&:focus": {
        borderRadius: "var(--theme-select-border-radius, 16px)",
        borderColor:
          "var(--theme-select-border-color, var(--theme-primary-color, #5925DC))",
        boxShadow:
          "var(--theme-select-focus-shadow, 0 0 0 0.2rem var(--theme-select-bg, #F4F3FF))",
      },
      "&.Mui-disabled": {
        color:
          "var(--theme-select-text-color-disabled, var(--theme-primary-color, #5925DC))",
        opacity: 0.6,
      },
    },
  };
});

const GoMakeSelect = ({
  options,
  disabled,
  onSelectWorkSource,
  value,
}: any) => {
  const handleChange = (event: SelectChangeEvent<EWorkSource>) => {
    onSelectWorkSource(event.target.value as EWorkSource);
  };
  return (
    <Select
      disabled={disabled}
      sx={{
        width: "fit-content",
        "& .MuiSelect-icon": {
          color:
            "var(--theme-select-icon-color, var(--theme-primary-color, #5925DC))",
        },
        "& .MuiPaper-root": {
          backgroundColor: "var(--theme-primary-light, #FFFFFF)",
          borderRadius: "var(--theme-select-menu-radius, 8px)",
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            "& .MuiMenuItem-root": {
              color:
                "var(--theme-select-menu-item-text, var(--theme-text-primary, #000000))",
              "&:hover": {
                backgroundColor:
                  "var(--theme-select-menu-item-hover, rgba(0, 0, 0, 0.04))",
              },
              "&.Mui-selected": {
                backgroundColor:
                  "var(--theme-select-menu-item-selected, var(--theme-primary-light, rgba(89, 37, 220, 0.1)))",
                color:
                  "var(--theme-select-menu-item-selected-text, var(--theme-primary-color, #5925DC))",
                "&:hover": {
                  backgroundColor:
                    "var(--theme-select-menu-item-selected-hover, var(--theme-primary-light, rgba(89, 37, 220, 0.15)))",
                },
              },
            },
          },
        },
      }}
      value={value}
      onChange={handleChange}
      input={<StyledInput />}
    >
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

export { GoMakeSelect };
