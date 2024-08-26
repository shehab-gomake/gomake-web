import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";
import { ArrowUpIcon } from "@/icons";
import { useRef } from "react";
import { createGlobalStyle } from "styled-components";

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
}

const UpdateValueAutoComplete = ({
  clickedOut,
  options,
  onChange,
  getOptionLabel,
  onChangeTextField
}: IUpdateValueAutoCompleteProps) => {
  const { secondColor } = useGomakeTheme();
  const optionsListEl = useRef();

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
            renderInput={(params) => <TextField onChange={onChangeTextField} {...params} />}
            onChange={((e: any, value: any) => {
              onChange(e, value);
            })}
            popupIcon={
              <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
                <ArrowUpIcon />
              </div>
            }
            style={{ height: 26 }}
            clearIcon={false}
            PaperComponent={(props) => <Paper ref={optionsListEl} {...props}>
              {props?.children}
            </Paper>}
          />
        </Paper>
      </ClickOutside>
    </>
  );
};

export { UpdateValueAutoComplete };