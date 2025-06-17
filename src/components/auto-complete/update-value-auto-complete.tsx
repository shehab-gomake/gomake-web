import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";
import { ArrowUpIcon } from "@/icons";
import { useRef } from "react";
import { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import React from "react";

interface IUpdateValueAutoCompleteProps {
  value?: any;
  onUpdate?: () => void;
  onCancel?: () => void;
  onInputChange?: (e: string) => void;
  clickedOut?: () => void;
  options?: any;
  onChange?: any;
  getOptionLabel?: any;
  onChangeTextField?: any;
  loading?: boolean;
  defaultFiltering?: boolean;
  renderOption?: any;
  filterOptions?: (options: any[], state: { inputValue: string }) => any[];
}

const UpdateValueAutoComplete = ({
  clickedOut,
  options,
  onChange,
  getOptionLabel,
  onChangeTextField,
  loading = false,
  defaultFiltering = true,
  renderOption,
  value,
  filterOptions,
}: IUpdateValueAutoCompleteProps) => {
  const { secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const optionsListEl = useRef<HTMLDivElement | null>(null);
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const GlobalStyle = createGlobalStyle`
  .MuiAutocomplete-input {
    padding-left:0px !important;
  }
    .MuiAutocomplete-endAdornment {
    top: 50% !important;
    transform: translateY(-50%);
  }
`;
  return (
    <>
      <GlobalStyle />
      <ClickOutside exceptionRef={optionsListEl} onClick={clickedOut}>
        <RouteChangeConfirmation />
        <Paper
          component="form"
          sx={{
            paddingLeft: "4px",
            paddingRight: "2px",
            display: "inline-flex",
            width: 150,
            height: "26px",
            border: "1px solid " + secondColor(400),
            boxShadow: "none",
            position: "relative",
          }}
        >
          <Autocomplete
            id="updateValueAutoComplete"
            options={options}
            sx={{
              ml: 1,
              flex: 1,
              ...FONT_FAMILY.Lexend(400, 14),
              padding: 0,
              position: "relative",
            }}
            getOptionLabel={getOptionLabel}
            onChange={(e: any, value: any) => {
              onChange(e, value);
            }}
            renderOption={renderOption}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onChangeTextField}
                InputProps={{
                  ...params.InputProps,
                  ...(loading && {
                    endAdornment: (
                      <CircularProgress
                        color="inherit"
                        size={16}
                        sx={{ ml: 2 }}
                      />
                    ),
                  }),
                }}
              />
            )}
            loading={loading} // Pass loading prop to show spinner
            popupIcon={
              RTL ? (
                <div style={{ position: "absolute", left: -130 }}>
                  <ArrowUpIcon />
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <ArrowUpIcon />
                </div>
              )
            }
            style={{ height: 26 }}
            clearIcon={false}
            PaperComponent={React.useCallback(
              (props) => (
                <Paper
                  ref={optionsListEl}
                  {...props}
                  elevation={1}
                  sx={{
                    ...(props as any).sx,
                    zIndex: 1500, // Ensure proper stacking
                  }}
                >
                  {props.children}
                </Paper>
              ),
              []
            )}
            // filterOptions={defaultFiltering ? undefined : (x) => x}
            filterOptions={
              filterOptions ?? (defaultFiltering ? undefined : (x) => x)
            }
          />
        </Paper>
      </ClickOutside>
    </>
  );
};

export { UpdateValueAutoComplete };
