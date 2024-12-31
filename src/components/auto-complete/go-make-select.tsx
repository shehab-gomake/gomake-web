import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Collapse, Divider } from "@mui/material";
import { DownIcon, ArrowIcon, UpIcon } from "./icons"; // Use new icons if needed
import CircularProgress from "@mui/material/CircularProgress";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => ({
  direction: props?.direction,
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-md, 8px)",
  alignSelf: "stretch",
  borderRadius: "var(--radius-md, 8px)",
  border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
  background: "var(--Colors-Background-bg-primary, #FFF)",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",

  "& .MuiOutlinedInput-root": {
    paddingRight: "9px!important",
    height: props?.style?.height || 40,
    fontFamily: "Heebo",
    fontWeight: 500,
    width: "100%",
    ...props?.style,

    "& fieldset": {
      border: "transparent",
    },

    "& .MuiAutocomplete-endAdornment": {
      right: props?.direction === "rtl" ? "auto" : 0,
      left: props?.direction === "rtl" ? 0 : "auto",
      marginRight: props?.direction === "rtl" ? "0" : "6px",
      marginLeft: props?.direction === "rtl" ? "6px" : "0",
    },

    "& .MuiAutocomplete-input": {
      padding: 0,
      direction: props?.direction,
    },

    "& input::placeholder": {
      color: "#B1B1B1",
      opacity: 1,
    },
  },
  ...props?.style,
}));

const GroupHeader = styled("div")({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: "black",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  justifyContent: "space-between",
  fontWeight: 500,
});

const GroupItems = styled("ul")({
  padding: 0,
  listStyleType: "none",
});

interface GoMakeSelectProps {
  value: any | null;
  onChange: (event: React.SyntheticEvent, value: any | null) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onClose?: () => void;
  onOpen?: () => void;
  style?: CSSProperties;
  options: any[];
  autoHighlight?: boolean;
  getOptionLabel?: (option: any) => string;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any
  ) => ReactNode;
  disableClearable?: boolean;
  placeholder?: string;
  defaultValue?: any | null;
  disabled?: boolean;
  multiple?: boolean;
  onChangeTextField?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  PaperComponent?: React.ComponentType;
  withArrow?: boolean;
  groupBy?: (option: any) => string;
  loading?: boolean;
  defaultFiltering?: boolean;
  startIcon?: ReactNode;
  arrowIcon?: ReactNode;
  open?: boolean;
}

const GoMakeSelect = ({
  value,
  onChange,
  onInputChange,
  onKeyDown,
  onClose,
  style,
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
  withArrow = true,
  groupBy,
  loading,
  defaultFiltering = true,
  startIcon,
  open,
  onOpen,
}: GoMakeSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  useEffect(() => {
    if (value?.name) {
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

  return (
    <StyledAutocomplete
      value={value}
      selectedOption={selectedOption}
      direction={dir}
      onChange={(e: any, value: any) => {
        onChange(e, value);
        setSelectedOption(value);
      }}
      onInputChange={onInputChange}
      onKeyDown={onKeyDown}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      style={style}
      options={options}
      disabled={disabled}
      popupIcon={withArrow ? <ArrowIcon /> : ""}
      groupBy={groupBy}
      renderGroup={(params) => (
        <div key={params.key}>
          <GroupHeader onClick={() => toggleGroup(params.group)}>
            {params.group}
            {expandedGroups[params.group] ? <UpIcon /> : <DownIcon />}
          </GroupHeader>
          <Divider
            sx={{
              width: "97%",
              margin: "0 auto",
              borderColor: "#ECECEC",
              my: 1,
            }}
          />
          <Collapse in={expandedGroups[params.group]}>
            <GroupItems>{params.children}</GroupItems>
          </Collapse>
        </div>
      )}
      renderInput={(params: any) => (
        <TextField
          {...params}
          placeholder={placeholder}
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
      loading={loading}
      defaultValue={defaultValue}
      autoHighlight={autoHighlight}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      disableClearable={disableClearable}
      multiple={multiple}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.id === value?.id
      }
      PaperComponent={PaperComponent}
      filterOptions={defaultFiltering ? undefined : (x) => x}
    />
  );
};

export { GoMakeSelect };
