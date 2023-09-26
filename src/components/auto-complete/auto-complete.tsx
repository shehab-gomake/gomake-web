import * as React from "react";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import {ArrowDownIcon} from "@/icons/arrow-down";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import Stack from "@mui/material/Stack";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => {

    return {
        direction: 'ltr',
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
        color: props?.error ? "red" : "#B9B9D9",
        border: props?.selectedOption
            ? "1px solid #43c3e8"
            : "1px solid rgba(237, 2, 140, 1)",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        "& .MuiOutlinedInput-root": {
            paddingRight: "9px!important",
            color: props?.error ? "red" : "",
            height: props?.style?.height || 40,
            fontFamily: "Lexend",
            fontStyle: "normal",
            fontWeight: 300,
            width: '100%',
            ...props?.style,
            "& fieldset": {
                border: "transparent",
                boxSizing: "border-box",
                borderRadius: "4px",
            },
            "& .MuiAutocomplete-input": {
                padding: 0,
                direction: props?.direction
            },
        },
        "& .MuiAutocomplete-endAdornment": {
            top: "calc(50% - 12px)",
        },
        ...props?.style,
    };
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
                            }: {
    value?: string | string[];
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
}) => {
    const [selectedOption, setSelectedOption] = useState<any>();
    const {t} = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    return (
        <StyledAutocomplete
            {...(value && {value})}
            {...(selectedOption && {selectedOption})}
            direction={dir}
            onChange={(e: any, value: any) => {
                onChange(e, value);
                setSelectedOption(value);
            }}
            style={style}
            options={options}
            disabled={disabled}
            popupIcon={<ArrowDownIcon fill={arrowColor}/>}
            renderInput={(params: any) => (
                <TextField
                    {...params}
                    placeholder={!multiple && (defaultValue?.label || placeholder)}
                    onChange={onChangeTextField || params.onChange}
                    InputProps={dir === 'rtl' ? {
                        ...params.InputProps,
                        startAdornment: (
                            <Stack display={'flex'}
                                   gap={'1px'}
                                   flexDirection={'row-reverse'}>
                              {params.InputProps.endAdornment.props.children}
                            </Stack>
                        ),
                        endAdornment: null
                    } : {
                        ...params.InputProps
                    }}
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
        />
    );
};

export {GoMakeAutoComplate};
