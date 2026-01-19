import React, { useRef, useState, useEffect } from "react";
import Select, { StylesConfig } from "react-select";
import { Tooltip } from "@mui/material";

export interface IGoMakeMultiSelectOption {
    label: string;
    value: string;
}

interface IGoMakeMultiSelectProps {
    options: IGoMakeMultiSelectOption[];
    value?: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    closeMenuOnSelect?: boolean;
    hideSelectedOptions?: boolean;
    minWidth?: number;
    maxWidth?: number;
    maxHeight?: number;
}

// Component to check if text is truncated and show tooltip only if needed
const OptionWithTooltip: React.FC<{ label: string }> = ({ label }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const element = textRef.current;
        if (element) {
            setIsOverflowing(element.scrollWidth > element.clientWidth);
        }
    }, [label]);

    const textDiv = (
        <div
            ref={textRef}
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
            {label}
        </div>
    );

    if (isOverflowing) {
        return (
            <Tooltip title={label} placement="top" arrow>
                {textDiv}
            </Tooltip>
        );
    }

    return textDiv;
};

const GoMakeMultiSelect: React.FC<IGoMakeMultiSelectProps> = ({
    options,
    value = [],
    onChange,
    placeholder,
    isDisabled = false,
    isLoading = false,
    isClearable = false,
    isSearchable = true,
    closeMenuOnSelect = false,
    hideSelectedOptions = false,
    minWidth,
    maxWidth,
    maxHeight = 80,
}) => {
    // Convert value array to selected options
    const selectedOptions = options.filter((option) =>
        value.includes(option.value)
    );

    // Handle change
    const handleChange = (selectedOptions: any) => {
        const values = selectedOptions
            ? selectedOptions.map((option: IGoMakeMultiSelectOption) => option.value)
            : [];
        onChange(values);
    };

    // Custom styles to match GoMake form inputs
    const customStyles: StylesConfig<IGoMakeMultiSelectOption, true> = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "40px",
            borderRadius: "4px",
            border: "1px solid transparent",
            boxShadow: state.isFocused ? "0px 1px 10px rgba(0, 0, 0, 0.12)" : "0px 1px 10px rgba(0, 0, 0, 0.08)",
            backgroundColor: "#FFF",
            fontFamily: "Lexend, Heebo, sans-serif",
            fontSize: "14px",
            "&:hover": {
                borderColor: "transparent",
                boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.12)",
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: maxHeight,
            overflowY: "auto",
            padding: "2px 8px",
        }),
        input: (provided) => ({
            ...provided,
            margin: "0px",
            padding: "0px",
            fontFamily: "Heebo, sans-serif",
            fontSize: "14px",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#B1B1B1",
            fontFamily: "Heebo, sans-serif",
            fontSize: "12px",
        }),
        option: (provided, state) => ({
            ...provided,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "Heebo, sans-serif",
            fontSize: "14px",
            backgroundColor: state.isSelected
                ? "rgba(46, 48, 146, 0.08)"
                : state.isFocused
                    ? "rgba(46, 48, 146, 0.04)"
                    : "#FFF",
            color: "#000",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "rgba(46, 48, 146, 0.12)",
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "rgba(46, 48, 146, 0.1)",
            borderRadius: "4px",
            fontFamily: "Heebo, sans-serif",
            fontSize: "14px",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "var(--theme-primary-color, #2E3092)",   
            fontFamily: "Heebo, sans-serif",
            fontSize: "14px",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "var(--theme-primary-color, #2E3092)",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "rgba(46, 48, 146, 0.2)",
                color: "var(--theme-primary-color, #2E3092)",
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxHeight: 300,
            borderRadius: "4px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            border: "1px solid #E0E0E0",
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: 300,
            overflowY: "auto",
            padding: "4px 0",
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    return (
        <div style={{ minWidth: minWidth, maxWidth: maxWidth }}>
            <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder={placeholder}
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isSearchable={isSearchable}
                closeMenuOnSelect={closeMenuOnSelect}
                hideSelectedOptions={hideSelectedOptions}
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                classNamePrefix="gomake-multi-select"
                formatOptionLabel={(option) => <OptionWithTooltip label={option.label} />}
            />
        </div>
    );
};

export { GoMakeMultiSelect };

