import React from "react";
import Select from "react-select";

interface ProductMultiSelectProps {
  products: any[];
  selectedProductIds: any[];
  onProductChange: (selectedIds: any[]) => void;
  label?: string;
  placeholder?: string;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
}

const ProductMultiSelect = ({
  products,
  selectedProductIds,
  onProductChange,
  label,
  placeholder = "Select Products",
  containerStyle = {},
  labelStyle = {},
  selectStyle = {},
}: ProductMultiSelectProps) => {
  // Transform products list to react-select format
  const options = products.map((product) => ({
    value: product.id || product.value,
    label: product.name || product.label,
  }));

  // Get selected values in react-select format
  const selectedValues = options.filter((option) =>
    selectedProductIds.includes(option.value)
  );

  // Handle selection change
  const handleChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    onProductChange(selectedIds);
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "38px",
      borderRadius: "var(--theme-dropdown-border-radius, 4px)",
      border: "1px solid var(--theme-dropdown-border-color, transparent)",
      borderColor: "var(--theme-dropdown-border-color, transparent)",
      boxShadow: state.isFocused
        ? "none"
        : "var(--theme-dropdown-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
      "&:hover": {
        borderColor: "var(--theme-dropdown-border-color, transparent)",
      },
      ...selectStyle,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0f2fe",
      borderRadius: "4px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0369a1",
      fontSize: "14px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0369a1",
      "&:hover": {
        backgroundColor: "#0369a1",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0066cc"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#0066cc",
      },
    }),
  };

  return (
    <div style={containerStyle}>
      {label && <h3 style={labelStyle}>{label}</h3>}
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        className="product-multi-select"
        classNamePrefix="select"
        closeMenuOnSelect={false}
        isClearable
        isSearchable
        // Additional props for better UX
        noOptionsMessage={() => "No products found"}
        loadingMessage={() => "Loading..."}
      />
    </div>
  );
};

export default ProductMultiSelect;
