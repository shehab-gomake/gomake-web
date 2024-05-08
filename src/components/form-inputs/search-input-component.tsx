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
}


const SearchInputComponent = ({ onChange, value, placeHolder, searchInputStyle, bgColor, filtersButton }: ISearchInputProps) => {

  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeTextInputIcon
      bgColor={bgColor}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      style={searchInputStyle || classes.searchInput}
      placeholder={placeHolder || t("header.search")}
      value={value}
      startAdornment={
        <InputAdornment position="start">
          <div style={classes.iconStyle}>
            <SearchIcon width={20} height={20} />
          </div>
        </InputAdornment>
      }
      endAdornment={filtersButton}
    />
  );
};

export { SearchInputComponent };
