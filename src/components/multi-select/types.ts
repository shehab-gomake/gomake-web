export interface IGoMakeMultiSelectOption {
  label: string;
  value: string;
}

export interface IGoMakeMultiSelectProps {
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
  maxHeight?: number;
  width?: string | number;
  minWidth?: string | number;
}

