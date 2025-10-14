import React from "react";
import Select, { StylesConfig } from "react-select";

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
            />
        </div>
    );
};

export { GoMakeMultiSelect };

