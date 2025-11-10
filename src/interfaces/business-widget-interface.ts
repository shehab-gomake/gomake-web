export interface IBusinessWidget {
  label?: string;
  value?: any;
  isUnderLine?: boolean;
  onBlur?: any;
  isUpdate?: any;
  setIsUpdate?: any;
  options?: any;
  getOptionLabel?: any;
  onChange?: any;
  onInputChange?: any;
  setInputData?: any;
  specialStyle?: any;
  onChangeTextField?: any;
  onClickFlag?: any;
  flag?: any;
  sign?: string;
  isTwoDigit?: boolean;
  inputMainContainerStyle?: React.CSSProperties;
  placeholder?: string;
  isFetching?: boolean;
  defaultFiltering?: boolean;
  width?: any;
  renderOption?: any;
  isRightSign?: boolean;
  showClearIcon?: boolean;
  filterOptions?: (options: any[], state: { inputValue: string }) => any[];
  errorMessage?: string;
}
