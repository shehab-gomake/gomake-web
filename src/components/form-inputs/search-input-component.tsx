import { GoMakeTextInputIcon } from "@/components";
import { InputAdornment } from "@mui/material";
import { SearchIcon } from "@/icons";
import { useStyle } from "@/components/form-inputs/style";
import { useTranslation } from "react-i18next";

interface ISearchInputProps {
  onChange: (value: string) => void;
  value?: string;
  placeHolder?: string;
  searchInputStyle?: any;
  bgColor?: string;
  filtersButton?: JSX.Element;
  inputRef?: any
}

const SearchInputComponent = ({
  onChange,
  value,
  placeHolder,
  searchInputStyle,
  bgColor,
  filtersButton,
  inputRef
}: ISearchInputProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  return (
    <GoMakeTextInputIcon
      bgColor={bgColor}
      onChange={(e) => {
        const trimmedValue = e.target.value.trimStart();
        onChange(trimmedValue);
      }}
      style={
        searchInputStyle
          ? { ...classes.searchInput, ...searchInputStyle }
          : classes.searchInput
      }
      placeholder={placeHolder || t("header.search")}
      value={value}
      inputRef={inputRef}
      startAdornment={
        <InputAdornment position="start">
          <div style={classes.iconStyle}>
            <SearchIcon width={20} height={20} />
          </div>
        </InputAdornment>
      }
      // endAdornment={filtersButton}
      endAdornment={
        <InputAdornment position="start">
          <div>{filtersButton}</div>
        </InputAdornment>
      }
    />
  );
};

export { SearchInputComponent };
