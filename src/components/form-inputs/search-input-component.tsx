import {GoMakeTextInputIcon} from "@/components";
import {InputAdornment} from "@mui/material";
import {SearchIcon} from "@/icons";
import {useStyle} from "@/components/form-inputs/style";
import {useTranslation} from "react-i18next";
interface ISearchInputProps {
    onChange: (value: string) => void;
    value?: string;
}

const SearchInputComponent = ({onChange, value}: ISearchInputProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
  return (
      <GoMakeTextInputIcon
          onChange={(e) => {onChange(e.target.value)}}
          style={classes.searchInput}
          placeholder={t("header.search")}
          value={value}
          startAdornment={
              <InputAdornment position="start">
                  <div style={classes.iconStyle}>
                      <SearchIcon width={20} height={20} />
                  </div>
              </InputAdornment>
          }
      />
  );
}

export {SearchInputComponent};