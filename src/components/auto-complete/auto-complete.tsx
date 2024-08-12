import * as React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import { Collapse, Divider } from "@mui/material";
import { DownIcon, UpIcon } from "./icons";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => {
  return {
    direction: "ltr",
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
      width: "100%",
      ...props?.style,
      "& fieldset": {
        border: "transparent",
        boxSizing: "border-box",
        borderRadius: "4px",
      },
      "& .MuiAutocomplete-input": {
        padding: 0,
        direction: props?.direction,
      },
      "& input::placeholder": {
        color: "#B1B1B1",
        opacity: 1,
        fontFamily: "Heebo",
        fontStyle: "normal",
        fontWeight: 500,
      },
    },
    ...props?.style,
  };
});

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: 'black',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  justifyContent: 'space-between',
  // fontWeight: 'bold', 
  fontFamily: "Heebo",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px",
}));

const GroupItems = styled('ul')({
  padding: 0,
  listStyleType: 'none',
});

const GoMakeAutoComplate = ({
  value,
  onChange,
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
  arrowColor,
  onChangeTextField,
  PaperComponent,
  withArrow = false,
  groupBy,
  renderGroup,
}: {
  value?: any;
  onChange?: any;
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
  arrowColor?: any;
  onChangeTextField?: any;
  PaperComponent?: any;
  withArrow?: boolean;
  groupBy?: (option: any) => string; // Function to group options
  renderGroup?: (params: any) => React.ReactNode; // Function to render group headers
}) => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  React.useEffect(() => {
    if (value?.name) {
      setSelectedOption(value);
    } else {
      setSelectedOption(null);
    }
  }, [value]);
  

  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const optionsArray = Array.isArray(options) ? options : [];
  const groupByFunction = typeof groupBy === 'function' ? groupBy : (option) => option; // Default to identity function if not a function
  
  const uniqueGroups = Array.from(new Set(optionsArray.map(groupByFunction)));
  const lastGroup = uniqueGroups[uniqueGroups.length - 1];

  return (
    <StyledAutocomplete
      // {...(value && { value })}
      //value={value || value === 0 ? value : null}
      {...(value && { value })}
      {...(selectedOption && { selectedOption })}
      direction={dir}
      onChange={(e: any, value: any) => {
        onChange(e, value);
        setSelectedOption(value);
      }}
      style={style}
      options={options}
      disabled={disabled}
      popupIcon={withArrow ? <ArrowDropDownIcon /> : ""} // Conditionally render popupIcon based on withArrow prop
      groupBy={groupBy} // Group options by category
      renderGroup={(params) => (
        <div key={params.key}>
          <GroupHeader onClick={() => toggleGroup(params.group)}>
          {params.group}
            {expandedGroups[params.group] ? <UpIcon/> : <DownIcon/>}
          </GroupHeader>
          {params.group !== lastGroup && <Divider sx={{
            width: '97%',
            margin: '0 auto',
            borderColor: '#ECECEC',
            my: 1,
          }} />}
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
          InputProps={
            dir === "rtl"
              ? {
                ...params.InputProps,
                startAdornment: (
                  <Stack
                    display={"flex"}
                    gap={"1px"}
                    flexDirection={"row-reverse"}
                  >
                    {params.InputProps.endAdornment.props.children}
                  </Stack>
                ),
                endAdornment: null,
              }
              : {
                ...params.InputProps,
              }
          }
        />
      )}
      defaultValue={defaultValue}
      autoHighlight={autoHighlight}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      error={error}
      disableClearable={disableClearable}
      placeholder="Enter"
      multiple={multiple}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.id === value?.id
      }
      getOptionSelected={(option: any, value: any) => {
        return option?.id === value?.id;
      }}
      PaperComponent={PaperComponent}
    />
  );
};

export { GoMakeAutoComplate };
