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

    // Custom styles for scrollable selected options
    const customStyles: StylesConfig<IGoMakeMultiSelectOption, true> = {
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: maxHeight,
            overflowY: "auto",
            padding: "2px 8px",
        }),
        option: (provided) => ({
            ...provided,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxHeight: 300,
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: 300,
            overflowY: "auto",
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

