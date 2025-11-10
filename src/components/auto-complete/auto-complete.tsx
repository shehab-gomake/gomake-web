import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Collapse, Divider, Stack } from "@mui/material";
import { DownIcon, UpIcon } from "./icons";
import CircularProgress from "@mui/material/CircularProgress";
import { adaptMarginRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => {
  return {
    direction: props?.direction,
    boxSizing: "border-box",
    borderRadius: "4px",
    height: props?.style?.height || 40,
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    alignItems: "center",
    color: props?.error ? "red" : "#000000",
    backgroundColor: "#FFF",
    borderBottom: props?.selectedOption
      ? "2px solid rgb(67,195,232)"
      : "2px solid rgb(237, 2, 140)",
    boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
    "& .MuiOutlinedInput-root": {
      paddingRight: "9px!important",
      color: props?.error ? "red" : "",
      height: props?.style?.height || 40,
      fontFamily: "Heebo",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 14,
      width: "100%",
      // ...props?.style,
      "& fieldset": {
        border: "1px solid transparent",
        boxSizing: "border-box",
        borderRadius: "4px",
      },

      "& .MuiAutocomplete-endAdornment": {
        right: props?.direction === "rtl" ? "auto" : 0,
        left: props?.direction === "rtl" ? 0 : "auto",
        marginRight: props?.direction === "rtl" ? "0" : "4px",
        marginLeft: props?.direction === "rtl" ? "4px" : "0",
      },

      "& .MuiAutocomplete-input": {
        padding: 0,
        direction: props?.direction,
        flex: 1,
        "&.Mui-disabled": {
          cursor: "not-allowed",
          color: "#000",
          WebkitTextFillColor: "#000",
          opacity: 1,
        },
      },
      "& input::placeholder": {
        color: "#B1B1B1",
        opacity: 1,
        fontFamily: "Heebo",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: 12,
      },
    },
    ...props?.style,
  };
});

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: "black",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  justifyContent: "space-between",
  // fontWeight: 'bold',
  fontFamily: "Heebo",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px",
}));

const GroupItems = styled("ul")({
  padding: 0,
  listStyleType: "none",
});

// Inside your GoMakeAutoComplate function
const GoMakeAutoComplate = ({
  value,
  onChange,
  onInputChange,
  onKeyDown,
  onClose,
  style,
  error,
  options,
  autoHighlight,
  getOptionLabel,
  renderOption,
  disableClearable,
  placeholder,
  defaultValue,
  disabled,
  multiple = false,
  onChangeTextField,
  PaperComponent,
  withArrow = false,
  groupBy,
  popupIcon,
  renderGroup,
  loading, // Add loading prop
  defaultFiltering = true,
  startIcon,
  arrowIcon,
  open, // Add the `open` prop
  onOpen, // Add the `onOpen` prop
  noOptionsText,
  componentsProps,
  isOptionEqualToValue,
  labelText,
  getOptionDisabled,
  freeSolo = false,
  inputValue
}: {
  value?: any;
  onChange?: any;
  onInputChange?: any;
  onKeyDown?: any;
  onClose?: any;
  style?: any;
  error?: any;
  options: any;
  autoHighlight?: any;
  getOptionLabel?: any;
  renderOption?: any;
  disableClearable?: any;
  placeholder?: any;
  defaultValue?: any;
  multiple?: any;
  disabled?: any;
  onChangeTextField?: any;
  PaperComponent?: any;
  popupIcon?: any;
  withArrow?: boolean;
  renderGroup?: (params: any) => React.ReactNode;
  groupBy?: (option: any) => string;
  loading?: boolean; // Add loading prop
  defaultFiltering?: boolean;
  startIcon?: React.ReactNode;
  arrowIcon?: React.ReactNode;
  open?: boolean;
  onOpen?: () => void;
  noOptionsText?: string;
  componentsProps?: any;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  labelText?: string;
  getOptionDisabled?: (option: any) => boolean;
  freeSolo?: boolean;
  inputValue?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  useEffect(() => {
    if ((Array.isArray(value) && value.length > 0) || !Array.isArray(value)) {
      setSelectedOption(value);
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const optionsArray = Array.isArray(options) ? options : [];
  const groupByFunction =
    typeof groupBy === "function" ? groupBy : (option) => option;
  const uniqueGroups = Array.from(new Set(optionsArray.map(groupByFunction)));
  const lastGroup = uniqueGroups[uniqueGroups.length - 1];

  return (
    < >
      {
        labelText &&
        <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{labelText}</div>
      }
      <StyledAutocomplete
        value={value !== null && value !== undefined ? value : null}
        {...(selectedOption && { selectedOption })}
        {...(inputValue !== undefined && freeSolo && { inputValue })}
        direction={dir}
        onChange={(e: any, value: any) => {
          onChange(e, value);
          setSelectedOption(value);
        }}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        open={open} // Pass the `open` prop to Autocomplete
        onOpen={onOpen} // Pass the `onOpen` callback to Autocomplete
        onClose={onClose}
        style={style}
        options={options}
        disabled={disabled}
        freeSolo={freeSolo}
        popupIcon={withArrow ? popupIcon ? popupIcon : <ArrowDropDownIcon /> : ""}
        groupBy={groupBy}
        renderGroup={(params) => (
          <div key={params.key}>
            <GroupHeader onClick={() => toggleGroup(params.group)}>
              {params.group}
              {expandedGroups[params.group] ? <UpIcon /> : <DownIcon />}
            </GroupHeader>
            {params.group !== lastGroup && (
              <Divider
                sx={{
                  width: "97%",
                  margin: "0 auto",
                  borderColor: "#ECECEC",
                  my: 1,
                }}
              />
            )}
            <Collapse in={expandedGroups[params.group]}>
              <GroupItems>{params.children}</GroupItems>
            </Collapse>
          </div>
        )}
        renderInput={(params: any) => (
          <TextField
            {...params}
            placeholder={defaultValue?.label || placeholder}
            onChange={onChangeTextField || params.onChange}
            InputProps={{
              ...params.InputProps,
              ...(startIcon && {
                startAdornment: (
                  <div style={{ display: "flex", marginLeft: "10px" }}>
                    {startIcon}
                  </div>
                ),
              }),
              ...(loading && {
                endAdornment: (
                  <CircularProgress color="inherit" size={20} sx={{ ml: 2 }} />
                ),
              }),
            }}
          />
        )}
        loading={loading} // Pass loading prop to show spinner
        defaultValue={defaultValue}
        autoHighlight={autoHighlight}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        error={error}
        disableClearable={disableClearable}
        placeholder="Enter"
        multiple={multiple}
        getOptionSelected={(option: any, value: any) => option?.id === value?.id}
        PaperComponent={PaperComponent}
        filterOptions={defaultFiltering ? undefined : (x) => x} //? Bypass default filtering
        noOptionsText={noOptionsText}
        componentsProps={componentsProps}
        isOptionEqualToValue={
          isOptionEqualToValue ??
          ((option: any, value: any) => String(option?.id) === String(value?.id))
        }
        getOptionDisabled={getOptionDisabled}
      />
    </>

  );
};

export { GoMakeAutoComplate };
